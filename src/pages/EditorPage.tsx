import { useState, useContext, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { POST_API, SERIES_API } from '../lib/api';
import { STORAGE_KEYS } from '../utils/constants';
import { invalidateCache } from '../lib/api/cache';
import { postLimitError } from '../utils/postValidation';
import { useAutoSave, type SaveStatus } from '../hooks/useAutoSave';
import { useToast } from '../hooks/useToast';
import { useReturnFocus } from '../hooks/useReturnFocus';
import { useKatexReady } from '../hooks/useKatexReady';
import { useLatestRef } from '../hooks/useLatestRef';
import { useServerDraft } from '../hooks/useServerDraft';
import PageMeta from '../components/PageMeta';
import { postPath } from '../utils/slug';
import BlockEditor, { type BlockEditorHandle, type InsertImage } from '../components/BlockEditor';
import TagAutocompleteInput from '../components/TagAutocompleteInput';
import EditorToolbar from '../components/EditorToolbar';
import PreviewModal from '../components/PreviewModal';
import DraftRestorePrompt from '../components/DraftRestorePrompt';
import { FORMAT_MARKS, type FormatType } from '../components/editorFormats';
import type { ApiError } from '../lib/api/client';
import { PostFormData, DraftData, Series } from '../types';
import 'highlight.js/styles/atom-one-dark.css';
import './EditorPage.css';

const EMPTY_FORM: PostFormData = { title: '', content: '', is_public: true, tags: '' };
const NAVIGATE_AFTER_SAVE_MS = 800;
const UNTITLED = '제목 없음';

const SAVE_STATUS_VIEW: Record<SaveStatus, { className: string; label: string }> = {
    saving: { className: 'saving', label: '저장 중...' },
    saved: { className: 'saved', label: '\u2713 저장됨' },
    error: { className: 'error', label: '\u2717 저장 실패' },
};

// 편집 대상 글이 바뀌면(새 글 ↔ 글 수정) 이전 글의 입력·임시저장 상태를 버리도록 새로 마운트한다.
export default function EditorPage() {
    const { postId } = useParams<{ postId: string }>();
    return <PostEditor key={postId ?? 'new'} postId={postId} />;
}

function PostEditor({ postId }: { postId: string | undefined }) {
    const navigate = useNavigate();
    const { token, userId } = useContext(AuthContext);
    const tokenRef = useLatestRef(token);
    const { toast } = useToast();
    const imageInsertRef = useRef<InsertImage | null>(null);
    const editorRef = useRef<BlockEditorHandle | null>(null);
    const [formData, setFormData] = useState<PostFormData>(EMPTY_FORM);
    // 불러온 글(새 글이면 빈 양식). 이것과 같으면 고친 게 없으므로 임시저장하지 않는다.
    const [baseline, setBaseline] = useState<PostFormData>(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(!!postId);
    const [error, setError] = useState<string>('');
    const [showRestorePrompt, setShowRestorePrompt] = useState<boolean>(false);
    const [draftInfo, setDraftInfo] = useState<DraftData | null>(null);
    const [userSeries, setUserSeries] = useState<Series[]>([]);
    const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
    // 불러온 글이 속해 있던 시리즈. 저장할 때 "시리즈 없음"으로 바뀌었으면 여기서 뺀다.
    const [loadedSeriesId, setLoadedSeriesId] = useState<string>('');
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const isEditMode = !!postId;
    // 초안을 열었으면 저장이 곧 발행이 되지 않도록 임시저장과 발행을 나눈다.
    const [loadedStatus, setLoadedStatus] = useState<string | undefined>(undefined);
    const isEditingDraft = isEditMode && loadedStatus === 'draft';

    useReturnFocus(showRestorePrompt);
    useReturnFocus(showPreview);

    // 미리보기는 renderMarkdown 을 렌더마다 부르므로, KaTeX 가 늦게 로드되면 다시 그리게만 한다.
    useKatexReady();

    useEffect(() => {
        if (!userId) return;
        const controller = new AbortController();
        SERIES_API.getUserSeries(userId, { signal: controller.signal, token })
            .then(res => { if (res.status === 'success') setUserSeries(res.data || []); })
            .catch((err) => console.warn('editor: failed to load user series:', err));
        return () => controller.abort();
    }, [userId, token]);

    const { serverSaveOptions, beginPublish, cancelPublish } = useServerDraft(token, !isEditMode);

    const draftKey = isEditMode ? `${STORAGE_KEYS.DRAFT_EDIT}:${postId}` : STORAGE_KEYS.DRAFT;
    const { saveStatus, loadDraft, clearDraft, hasDraft, getFormattedSaveTime } = useAutoSave(formData, draftKey, serverSaveOptions, baseline);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (formData.title || formData.content) {
                e.preventDefault();
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formData.title, formData.content]);

    useEffect(() => {
        const controller = new AbortController();
        const offerDraftRestore = () => {
            if (!hasDraft()) return;
            setDraftInfo(loadDraft());
            setShowRestorePrompt(true);
        };

        if (postId) {
            const loadPost = async () => {
                try {
                    setIsLoading(true);
                    const response = await POST_API.getPost(postId, { signal: controller.signal, token: tokenRef.current ?? undefined });
                    if (response.status === 'success') {
                        const post = response.data;
                        if (userId && post.user_id !== userId) {
                            navigate(postPath(post), { replace: true });
                            return;
                        }
                        const loaded = {
                            title: post.title,
                            content: post.content,
                            is_public: post.is_public,
                            tags: post.tags || '',
                        };
                        setFormData(loaded);
                        setBaseline(loaded);
                        setLoadedStatus(post.status);
                        if (post.series) {
                            setSelectedSeriesId(String(post.series.series_id));
                            setLoadedSeriesId(String(post.series.series_id));
                        }
                        offerDraftRestore();
                    } else {
                        setError('글을 불러올 수 없습니다.');
                    }
                } catch (err: unknown) {
                    if (err instanceof Error && err.name === 'AbortError') return;
                    setError(err instanceof Error ? err.message : '글 불러오기에 실패했습니다.');
                } finally {
                    setIsLoading(false);
                }
            };
            loadPost();
        } else {
            offerDraftRestore();
            setIsLoading(false);
        }

        return () => controller.abort();
    }, [postId, hasDraft, loadDraft, navigate, userId, tokenRef]);

    const handleRestoreDraft = () => {
        if (draftInfo) {
            setFormData({
                title: draftInfo.title,
                content: draftInfo.content,
                is_public: draftInfo.is_public,
                tags: draftInfo.tags || '',
            });
        }
        setShowRestorePrompt(false);
    };

    const handleDiscardDraft = () => {
        clearDraft();
        setShowRestorePrompt(false);
        setDraftInfo(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleContentChange = (newContent: string) => {
        setFormData((prev) => ({
            ...prev,
            content: newContent,
        }));
    };

    const handleImageInsert: InsertImage = (src, fileName) => {
        imageInsertRef.current?.(src, fileName);
    };

    const handleFormat = (type: FormatType) => {
        editorRef.current?.wrapSelection(...FORMAT_MARKS[type]);
    };

    // 실패해도 글은 이미 저장됐으므로 알리기만 하고 넘어간다.
    const syncSeries = async (savedPostId: number, authToken: string) => {
        try {
            if (selectedSeriesId) {
                await SERIES_API.addPost(selectedSeriesId, savedPostId, 0, authToken);
            } else if (loadedSeriesId) {
                await SERIES_API.removePost(loadedSeriesId, savedPostId, authToken);
            }
        } catch (err: unknown) {
            const reason = err instanceof Error ? err.message : '';
            toast.error(`글은 저장했지만 시리즈에 반영하지 못했습니다${reason ? `: ${reason}` : ''}`);
        }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요');
            return;
        }
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요');
            return;
        }
        const limitError = postLimitError(formData);
        if (limitError) {
            setError(limitError);
            return;
        }
        if (!token) {
            setError('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        setIsSaving(true);
        setError('');
        const serverDraftId = await beginPublish();

        try {
            const targetPostId = isEditMode ? postId : serverDraftId;

            let response;
            if (targetPostId) {
                response = await POST_API.updatePost(
                    targetPostId,
                    formData.title,
                    formData.content,
                    formData.is_public,
                    token,
                    formData.tags
                );
            } else {
                response = await POST_API.createPost(
                    formData.title,
                    formData.content,
                    formData.is_public,
                    token,
                    formData.tags
                );
            }

            if (response.status !== 'success') {
                throw new Error('글 저장에 실패했습니다');
            }

            const savedPostId = targetPostId ? Number(targetPostId) : response.data?.id;
            if (savedPostId) await syncSeries(savedPostId, token);

            invalidateCache('posts:');
            invalidateCache('search:');

            const successMsg = isEditingDraft ? '글을 발행했습니다' : isEditMode ? '글이 수정되었습니다' : '글이 저장되었습니다';
            toast.success(successMsg);
            clearDraft();

            const targetPath = savedPostId ? postPath({ id: savedPostId, title: formData.title }) : '/';
            setTimeout(() => navigate(targetPath), NAVIGATE_AFTER_SAVE_MS);
        } catch (err: unknown) {
            cancelPublish();
            if ((err as ApiError).status === 401) {
                // 세션 만료 토스트는 request() 가 이미 띄웠다.
                navigate('/login');
                return;
            }
            const msg = err instanceof Error ? err.message : '글 저장에 실패했습니다';
            toast.error(msg);
            setError(msg);
            setIsSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!postId) return;
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요');
            return;
        }
        const limitError = postLimitError(formData);
        if (limitError) {
            setError(limitError);
            return;
        }
        if (!token) {
            setError('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            await POST_API.saveDraft(
                postId,
                formData.title.trim() || UNTITLED,
                formData.content,
                formData.tags || '',
                token,
                formData.is_public,
            );
            setBaseline(formData);
            clearDraft();
            toast.success('임시저장했습니다');
        } catch (err: unknown) {
            if ((err as ApiError).status === 401) {
                navigate('/login');
                return;
            }
            const msg = err instanceof Error ? err.message : '임시저장에 실패했습니다';
            toast.error(msg);
            setError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (isEditMode && postId) {
            // 제목을 고치다 취소해도 글 상세가 주소를 저장된 제목으로 다시 맞춘다.
            navigate(postPath({ id: Number(postId), title: formData.title }));
        } else {
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <div className="editor-page">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>글을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-page">
            <PageMeta title={isEditMode ? '글 수정' : '새 글 작성'} noindex />
            {showRestorePrompt && draftInfo && (
                <DraftRestorePrompt
                    isEditMode={isEditMode}
                    savedAgo={getFormattedSaveTime()}
                    onRestore={handleRestoreDraft}
                    onDiscard={handleDiscardDraft}
                />
            )}

            {error && <div className="error-message">{error}</div>}

            <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
                <div className="title-section">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="글 제목을 입력하세요..."
                        className="title-input"
                    />
                </div>

                <TagAutocompleteInput
                    value={formData.tags}
                    onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                />

                {userSeries.length > 0 && (
                    <div className="series-section">
                        <select
                            className="series-select"
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(e.target.value)}
                        >
                            <option value="">시리즈 없음</option>
                            {userSeries.map(s => (
                                <option key={s.id} value={String(s.id)}>{s.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                <EditorToolbar
                    onFormat={handleFormat}
                    onImageInsert={handleImageInsert}
                    onPreview={() => setShowPreview(true)}
                    previewDisabled={!formData.content.trim()}
                />

                <BlockEditor
                    ref={editorRef}
                    content={formData.content}
                    onChange={handleContentChange}
                    onImageInsert={imageInsertRef}
                    token={token}
                />

                <div className="button-section">
                    <div className="left-content">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                name="is_public"
                                checked={formData.is_public}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">
                                {formData.is_public ? '공개' : '비공개'}
                            </span>
                        </label>
                        <div className="save-indicator">
                            <span className={`save-status ${SAVE_STATUS_VIEW[saveStatus].className}`}>
                                {SAVE_STATUS_VIEW[saveStatus].label}
                            </span>
                        </div>
                    </div>
                    <div className="button-group">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            취소
                        </button>
                        {isEditingDraft ? (
                            <>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleSaveDraft}
                                    disabled={isSaving}
                                >
                                    임시저장
                                </button>
                                <button
                                    type="button"
                                    className="save-button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    발행
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '수정 완료' : '글 발행')}
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {showPreview && (
                <PreviewModal
                    title={formData.title}
                    content={formData.content}
                    tags={formData.tags}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
