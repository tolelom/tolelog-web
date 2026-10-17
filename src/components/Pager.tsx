interface PagerProps {
    page: number;
    totalPages: number;
    hasMore: boolean;
    onPrev: () => void;
    onNext: () => void;
    // 'pagination' 옆에 붙는 페이지별 클래스(home-pagination 등)
    className: string;
}

export default function Pager({ page, totalPages, hasMore, onPrev, onNext, className }: PagerProps) {
    return (
        <nav className={`pagination ${className}`} aria-label="페이지 탐색">
            <button
                className="page-btn"
                disabled={page <= 1}
                onClick={onPrev}
            >
                &larr; 이전
            </button>
            <span className="page-info">
                {totalPages > 0 ? `${page} / ${totalPages}` : page}
            </span>
            <button
                className="page-btn"
                disabled={!hasMore}
                onClick={onNext}
            >
                다음 &rarr;
            </button>
        </nav>
    );
}
