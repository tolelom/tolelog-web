import type { KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TagChip from '../TagChip';
import { formatDate } from '../../lib/format';
import { postPath } from '../../features/posts/slug';
import { splitTags } from '../../features/posts/tags';
import type { PostListItem } from '../../types';

interface HomePostCardProps {
    post: PostListItem;
    activeTag: string;
    onTagClick: (tag: string) => void;
}

// 카드 전체가 글 링크라서, 안쪽의 작성자·태그는 링크 이동을 막고 자기 동작만 한다(<a> 안에 <a> 를 둘 수 없다).
function stopCardLink(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
}

export default function HomePostCard({ post, activeTag, onTagClick }: HomePostCardProps) {
    const navigate = useNavigate();
    const goToAuthor = () => navigate(`/user/${post.user_id}`);

    return (
        <Link to={postPath(post)} className="home-post-card">
            <h2 className="home-post-title">{post.title}</h2>
            <div className="home-post-meta">
                <span
                    className="home-post-author"
                    role="link"
                    tabIndex={0}
                    onClick={(e) => { stopCardLink(e); goToAuthor(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { stopCardLink(e); goToAuthor(); } }}
                >
                    {post.author}
                </span>
                <span className="home-post-sep">&middot;</span>
                <span className="home-post-date">{formatDate(post.created_at)}</span>
                {post.view_count > 0 && (
                    <>
                        <span className="home-post-sep">&middot;</span>
                        <span className="home-post-views">조회 {post.view_count}</span>
                    </>
                )}
            </div>
            {post.series && (
                <div className="home-post-series-badge">
                    {post.series.series_title}
                </div>
            )}
            {post.tags && (
                <div className="home-post-tags">
                    {splitTags(post.tags).map(t => (
                        <TagChip
                            key={t}
                            tag={t}
                            active={activeTag === t}
                            onClick={(e) => { stopCardLink(e); onTagClick(t); }}
                        />
                    ))}
                </div>
            )}
            {post.excerpt && (
                <p className="home-post-preview">{post.excerpt}</p>
            )}
        </Link>
    );
}
