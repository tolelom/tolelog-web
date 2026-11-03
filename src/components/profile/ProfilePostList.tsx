import { Link } from 'react-router-dom';
import { PostListItem } from '../../types';
import { formatDate } from '../../lib/format';
import { postPath } from '../../utils/slug';
import Pager from '../Pager';
import TagChip from '../TagChip';
import { splitTags } from '../../utils/tags';

interface ProfilePostListProps {
    posts: PostListItem[];
    totalPosts: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    tagFilter: string | null;
    isOwner: boolean;
    profileUsername: string;
    onClearTagFilter: () => void;
    onTagClick: (tag: string) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
}

export default function ProfilePostList({
    posts,
    totalPosts,
    page,
    totalPages,
    hasMore,
    tagFilter,
    isOwner,
    profileUsername,
    onClearTagFilter,
    onTagClick,
    onPrevPage,
    onNextPage,
}: ProfilePostListProps) {
    const tag = tagFilter || '';

    return (
        <div className="profile-posts-section">
            <h2 className="profile-posts-title">
                {isOwner ? '내 글' : `${profileUsername}의 글`}
                {totalPosts > 0 && <span className="profile-posts-count">{totalPosts}</span>}
            </h2>

            {tag && (
                <div className="profile-tag-filter">
                    <span>태그: <strong>{tag}</strong></span>
                    <button className="profile-tag-clear" onClick={onClearTagFilter}>×</button>
                </div>
            )}

            {posts.length === 0 && (
                <div className="profile-status">
                    <p>{tag ? `'${tag}' 태그가 포함된 글이 없습니다.` : '아직 작성된 글이 없습니다.'}</p>
                </div>
            )}

            {posts.map((post: PostListItem) => (
                <Link
                    key={post.id}
                    to={postPath(post)}
                    className="profile-post-card"
                >
                    <h3 className="profile-post-title">{post.title}</h3>
                    {post.series && (
                        <div className="profile-post-series-badge">
                            {post.series.series_title}
                        </div>
                    )}
                    <div className="profile-post-meta">
                        <span className="profile-post-date">{formatDate(post.created_at)}</span>
                        {post.view_count > 0 && (
                            <span className="profile-post-views">조회 {post.view_count}</span>
                        )}
                        {post.tags && splitTags(post.tags).map((t: string) => (
                            <TagChip
                                key={t}
                                tag={t}
                                active={tag === t}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick(t); }}
                            />
                        ))}
                        {!post.is_public && (
                            <span className="profile-post-private">비공개</span>
                        )}
                    </div>
                    {post.excerpt && (
                        <p className="profile-post-preview">{post.excerpt}</p>
                    )}
                </Link>
            ))}

            {(posts.length > 0 || page > 1) && (
                <Pager
                    className="profile-pagination"
                    page={page}
                    totalPages={totalPages}
                    hasMore={hasMore}
                    onPrev={onPrevPage}
                    onNext={onNextPage}
                />
            )}
        </div>
    );
}
