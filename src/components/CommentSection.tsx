import { useState, useEffect, useContext, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { notify as toast } from '../utils/notify';
import { AuthContext } from '../context/AuthContext';
import { COMMENT_API } from '../utils/api';
import { resolveAssetUrl } from '../utils/assetUrl';
import { formatDate } from '../utils/format';
import { COMMENT_MAX } from '../utils/limits';
import type { Comment } from '../types';
import './CommentSection.css';

interface CommentSectionProps {
    postId: number;
}

export default memo(function CommentSection({ postId }: CommentSectionProps) {
    const { token, userId, ready } = useContext(AuthContext);
    const [comments, setComments] = useState<Comment[]>([]);
    const [total, setTotal] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    const fetchComments = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoadError(null);
            const response = await COMMENT_API.getComments(postId, { signal, token: token ?? undefined });
            if (response.status === 'success') {
                setComments(response.data.comments);
                setTotal(response.data.total);
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return;
            // "댓글 없음"과 구분되도록 실패는 재시도 버튼과 함께 목록 자리에 보인다.
            setLoadError(err instanceof Error ? err.message : '댓글을 불러오지 못했습니다.');
        }
    }, [postId, token]);

    useEffect(() => {
        if (!ready) return;
        const controller = new AbortController();
        fetchComments(controller.signal);
        return () => controller.abort();
    }, [fetchComments, retryKey, ready]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !content.trim()) return;

        setIsSubmitting(true);
        setError('');
        try {
            await COMMENT_API.createComment(postId, content.trim(), token);
            setContent('');
            await fetchComments();
            toast.success('댓글을 작성했습니다.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '댓글 작성에 실패했습니다.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!token) return;
        try {
            await COMMENT_API.deleteComment(postId, commentId, token);
            await fetchComments();
            toast.success('댓글을 삭제했습니다.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.';
            setError(msg);
        }
    };

    return (
        <section className="comment-section">
            <h3 className="comment-title">
                댓글<span className="comment-count">{total}</span>
            </h3>

            {token ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        className="comment-textarea"
                        placeholder="댓글을 작성해주세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={COMMENT_MAX}
                    />
                    <div className="comment-submit-row">
                        <button
                            type="submit"
                            className="comment-submit-btn"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? '작성 중...' : '댓글 작성'}
                        </button>
                    </div>
                    {error && <p className="comment-error">{error}</p>}
                </form>
            ) : (
                <div className="comment-login-prompt">
                    <Link to="/login">로그인</Link>하고 댓글을 남겨보세요.
                </div>
            )}

            {loadError ? (
                <div className="comment-load-error" role="alert">
                    <p>{loadError}</p>
                    <button type="button" className="comment-retry-btn" onClick={() => setRetryKey((k) => k + 1)}>
                        다시 시도
                    </button>
                </div>
            ) : comments.length === 0 ? (
                <p className="comment-empty">아직 댓글이 없습니다.</p>
            ) : (
                <div className="comment-list">
                    {comments.map((cm) => (
                        <div key={cm.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-avatar" aria-hidden="true">
                                    {cm.avatar_url ? (
                                        <img src={resolveAssetUrl(cm.avatar_url)} alt="" />
                                    ) : (
                                        cm.author.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="comment-author">{cm.author}</span>
                                <span className="comment-date">{formatDate(cm.created_at)}</span>
                                {userId === cm.user_id && (
                                    <div className="comment-actions">
                                        <button
                                            className="comment-delete-btn"
                                            onClick={() => handleDelete(cm.id)}
                                            aria-label={`${cm.author}의 댓글 삭제`}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="comment-content">{cm.content}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
});
