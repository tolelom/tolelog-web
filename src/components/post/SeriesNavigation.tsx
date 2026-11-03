import { Link } from 'react-router-dom';
import { postPath } from '../../features/posts/slug';
import type { SeriesDetail, SeriesNav } from '../../types';

interface SeriesNavigationProps {
    nav: SeriesNav;
    currentPostId: number;
    tocOpen: boolean;
    detail: SeriesDetail | null;
    onToggleToc: () => void;
}

export default function SeriesNavigation({ nav, currentPostId, tocOpen, detail, onToggleToc }: SeriesNavigationProps) {
    return (
        <nav className="series-nav" aria-label="시리즈 네비게이션">
            <div className="series-nav-header">
                <Link to={`/series/${nav.series_id}`} className="series-nav-title">{nav.series_title}</Link>
                <div className="series-nav-header-right">
                    <span className="series-nav-count">{nav.current_order} / {nav.total_posts}</span>
                    <button className="series-toc-toggle" onClick={onToggleToc} aria-label={tocOpen ? '목록 접기' : '목록 펼치기'}>{tocOpen ? '▲' : '▼'}</button>
                </div>
            </div>
            {tocOpen && detail && (
                <ul className="series-toc-list">
                    {detail.posts.map((p, i) => (
                        <li key={p.id} className={p.id === currentPostId ? 'series-toc-current' : ''}>
                            <Link to={postPath(p)}><span className="series-toc-num">{i + 1}.</span> {p.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <div className="series-nav-buttons">
                {nav.prev_post ? (
                    <Link to={postPath(nav.prev_post)} className="series-nav-btn series-nav-prev">
                        <span className="series-nav-arrow">&larr;</span><span className="series-nav-label">{nav.prev_post.title}</span>
                    </Link>
                ) : <div />}
                {nav.next_post ? (
                    <Link to={postPath(nav.next_post)} className="series-nav-btn series-nav-next">
                        <span className="series-nav-label">{nav.next_post.title}</span><span className="series-nav-arrow">&rarr;</span>
                    </Link>
                ) : <div />}
            </div>
        </nav>
    );
}
