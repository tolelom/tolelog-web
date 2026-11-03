import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation, useLoaderData, Link } from 'react-router-dom';
import { parsePostSlugId, postPath } from '../utils/slug';
import { AuthContext } from '../context/AuthContext';
import { POST_API } from '../lib/api';
import { invalidateCache } from '../lib/api/cache';
import { renderMarkdown } from '../utils/markdown';
import { formatDateLong } from '../lib/format';
import { Post, PostListItem } from '../types';
import { useTOC } from '../hooks/useTOC';
import { useSeriesNav } from '../hooks/useSeriesNav';
import { useLike } from '../hooks/useLike';
import { useCopyCodeBlock } from '../hooks/useCopyCodeBlock';
import { useReturnFocus } from '../hooks/useReturnFocus';
import { useKatexReady } from '../hooks/useKatexReady';
import { useLatestRef } from '../hooks/useLatestRef';
import { useToast } from '../hooks/useToast';
import CommentSection from '../components/CommentSection';
import PageMeta from '../components/PageMeta';
import TagChip from '../components/TagChip';
import { ArticleJsonLd, BreadcrumbJsonLd } from '../components/StructuredData';
import TocList from '../components/post/TocList';
import SeriesNavigation from '../components/post/SeriesNavigation';
import DeletePostModal from '../components/post/DeletePostModal';
import { splitTags } from '../utils/tags';
import { firstHttpImage, plainTextExcerpt } from '../utils/postSummary';
import 'highlight.js/styles/atom-one-dark.css';
import './PostDetailPage.css';

// 같은 라우트에서 다른 글로 옮겨 가면 글 ID 를 key 로 새로 마운트해 이전 글의 상태(글·오류·좋아요·시리즈)를 버린다.
export default function PostDetailPage() {
    const { postId: rawPostId } = useParams<{ postId: string }>();
    const parsed = useMemo(() => parsePostSlugId(rawPostId), [rawPostId]);
    const numericId = parsed ? String(parsed.id) : undefined;
    return <PostDetail key={numericId ?? 'invalid'} numericId={numericId} />;
}

function PostDetail({ numericId }: { numericId: string | undefined }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, token, ready } = useContext(AuthContext);
    const tokenRef = useLatestRef(token);
    const prerenderedMeta = useLoaderData() as PostListItem | null | undefined;
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>('');
    const contentRef = useRef<HTMLDivElement | null>(null);

    const { toc, activeTocId, mobileTocOpen, setMobileTocOpen } = useTOC(post?.content ?? null);
    const { seriesNav, seriesTocOpen, seriesDetail, toggleSeriesToc } = useSeriesNav(numericId, token ?? undefined);
    const { liked, likeCount, likeLoading, handleLike } = useLike(numericId, token, post?.like_count || 0);
    const { toast } = useToast();

    useReturnFocus(deleteConfirm);

    const katexVersion = useKatexReady();
    const renderedHtml = useMemo(
        () => ({ __html: post ? renderMarkdown(post.content) : '' }),
        // renderMarkdown 은 KaTeX 가 로드되기 전엔 수식을 원문으로 그리므로, 로드되면 다시 그린다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [post, katexVersion],
    );

    useCopyCodeBlock(contentRef, !!post);

    // 토큰이 갱신돼도 보는 사람이 같으면 다시 부르지 않는다(조회수·스크롤·댓글 입력 유지).
    useEffect(() => {
        if (!ready) return;
        if (!numericId) {
            setError('잘못된 게시글 주소입니다.');
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();
        const loadPost = async () => {
            try {
                setIsLoading(true);
                const response = await POST_API.getPost(numericId, { signal: controller.signal, token: tokenRef.current ?? undefined });
                if (response.status === 'success') {
                    setPost(response.data);
                } else {
                    setError('글을 찾을 수 없습니다.');
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                setError(err instanceof Error ? err.message : '글 로드에 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        loadPost();
        return () => controller.abort();
    }, [numericId, userId, ready, tokenRef]);

    // /post/123 이나 제목이 바뀐 옛 슬러그로 들어오면 주소창만 지금 제목의 주소로 바꾼다.
    useEffect(() => {
        if (!post) return;
        const canonical = postPath({ id: post.id, title: post.title });
        if (location.pathname !== canonical) {
            navigate(canonical + location.search + location.hash, { replace: true });
        }
    }, [post, location.pathname, location.search, location.hash, navigate]);

    const closeDeleteModal = () => {
        setDeleteConfirm(false);
        setDeleteError('');
    };

    const handleDelete = async () => {
        if (!numericId || !token) return;
        setIsDeleting(true);
        setDeleteError('');
        try {
            const response = await POST_API.deletePost(numericId, token);
            if (response.status === 'success') {
                invalidateCache('posts:');
                invalidateCache('search:');
                toast.success('글을 삭제했습니다.');
                navigate('/');
            } else {
                const msg = '글 삭제에 실패했습니다.';
                setDeleteError(msg);
                toast.error(msg);
                setDeleteConfirm(false);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '글 삭제에 실패했습니다.';
            setDeleteError(msg);
            toast.error(msg);
            setDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="post-detail-page">
                {prerenderedMeta && (
                    <PageMeta
                        title={prerenderedMeta.title}
                        description={prerenderedMeta.excerpt}
                        canonical={postPath(prerenderedMeta)}
                        ogType="article"
                        article={{
                            publishedTime: prerenderedMeta.created_at,
                            modifiedTime: prerenderedMeta.updated_at,
                            author: prerenderedMeta.author,
                            tags: prerenderedMeta.tags ? splitTags(prerenderedMeta.tags) : undefined,
                        }}
                    />
                )}
                <article className="post-article" aria-busy="true">
                    <div className="skeleton skeleton-text-lg skeleton-w-70p skeleton-mb-16" />
                    <div className="post-meta-skeleton">
                        <div className="skeleton skeleton-text-sm skeleton-w-80" />
                        <div className="skeleton skeleton-text-sm skeleton-w-60" />
                        <div className="skeleton skeleton-text-sm skeleton-w-50" />
                    </div>
                    <div className="post-content-skeleton">
                        <div className="skeleton skeleton-text skeleton-w-full" />
                        <div className="skeleton skeleton-text skeleton-w-90p" />
                        <div className="skeleton skeleton-text skeleton-w-full" />
                        <div className="skeleton skeleton-text skeleton-w-80p" />
                        <div className="skeleton skeleton-text skeleton-w-65p" />
                    </div>
                </article>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail-page">
                <div className="error-container">
                    <h2>오류</h2>
                    <p>{error || '글을 찾을 수 없습니다.'}</p>
                    <Link to="/" className="back-link">글 목록으로 돌아가기</Link>
                </div>
            </div>
        );
    }

    const isOwner = userId && userId === post.user_id;
    const createdAt = formatDateLong(post.created_at);
    const updatedAt = formatDateLong(post.updated_at);

    const metaDescription = plainTextExcerpt(post.content);
    const ogImage = firstHttpImage(post.content) ?? undefined;
    const tagList = post.tags ? splitTags(post.tags) : [];
    const postCanonical = postPath({ id: post.id, title: post.title });

    return (
        <div className="post-detail-page">
            <PageMeta
                title={post.title}
                description={metaDescription}
                canonical={postCanonical}
                ogImage={ogImage}
                ogType="article"
                noindex={!post.is_public}
                article={{
                    publishedTime: post.created_at,
                    modifiedTime: post.updated_at,
                    author: post.author,
                    tags: tagList,
                }}
            />
            {post.is_public && (
                <>
                    <ArticleJsonLd
                        url={postCanonical}
                        title={post.title}
                        description={metaDescription}
                        authorName={post.author}
                        datePublished={post.created_at}
                        dateModified={post.updated_at}
                        image={ogImage}
                        tags={tagList}
                    />
                    <BreadcrumbJsonLd
                        items={[
                            { name: '홈', url: '/' },
                            { name: post.title, url: postCanonical },
                        ]}
                    />
                </>
            )}
            {toc.length > 0 && (
                <nav className="toc-panel" aria-label="목차">
                    <p className="toc-title">목차</p>
                    <TocList items={toc} activeId={activeTocId} className="toc-list" />
                </nav>
            )}
            <article className="post-article">
                <nav className="post-breadcrumb">
                    <Link to="/" className="breadcrumb-link">홈</Link>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-current">{post.title}</span>
                </nav>

                <header className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <button type="button" className="author" onClick={() => navigate(`/user/${post.user_id}`)}>{post.author}</button>
                        <span className="separator">•</span>
                        <span className="date">{createdAt}</span>
                        {updatedAt && createdAt !== updatedAt && (<><span className="separator">•</span><span className="updated">수정: {updatedAt}</span></>)}
                        {post.view_count > 0 && (<><span className="separator">•</span><span className="views">조회 {post.view_count}</span></>)}
                    </div>
                </header>

                {post.tags && (
                    <div className="post-tags">
                        {tagList.map((t: string) => (
                            <TagChip key={t} tag={t} onClick={() => navigate(`/?tag=${encodeURIComponent(t)}`)} />
                        ))}
                    </div>
                )}

                {toc.length > 0 && (
                    <div className="toc-mobile">
                        <button className="toc-mobile-toggle" onClick={() => setMobileTocOpen(v => !v)}>목차 {mobileTocOpen ? '▲' : '▼'}</button>
                        {mobileTocOpen && (
                            <TocList items={toc} activeId={activeTocId} className="toc-mobile-list" onNavigate={() => setMobileTocOpen(false)} />
                        )}
                    </div>
                )}

                <div ref={contentRef} className="post-content markdown-content md-body" dangerouslySetInnerHTML={renderedHtml} />

                <div className="post-like-section">
                    <button className={`post-like-btn${liked ? ' post-like-btn-active' : ''}`} onClick={handleLike} disabled={!token || likeLoading} title={token ? (liked ? '좋아요 취소' : '좋아요') : '로그인 후 이용 가능'}>
                        <span className="post-like-icon">{liked ? '♥' : '♡'}</span>
                        <span className="post-like-count">{likeCount}</span>
                    </button>
                </div>

                {seriesNav && (
                    <SeriesNavigation
                        nav={seriesNav}
                        currentPostId={post.id}
                        tocOpen={seriesTocOpen}
                        detail={seriesDetail}
                        onToggleToc={toggleSeriesToc}
                    />
                )}

                {isOwner && (
                    <div className="post-actions">
                        <Link to={`/editor/${post.id}`} className="btn-edit">수정</Link>
                        <button className="btn-delete" onClick={() => setDeleteConfirm(true)}>삭제</button>
                        {deleteError && <span className="delete-error">{deleteError}</span>}
                    </div>
                )}

                <CommentSection postId={post.id} />

                {deleteConfirm && (
                    <DeletePostModal isDeleting={isDeleting} onConfirm={handleDelete} onCancel={closeDeleteModal} />
                )}
            </article>
        </div>
    );
}
