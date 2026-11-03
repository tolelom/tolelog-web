import type { TocItem } from '../../hooks/useTOC';

interface TocListProps {
    items: TocItem[];
    activeId: string | null;
    className: string;
    onNavigate?: () => void;
}

export default function TocList({ items, activeId, className, onNavigate }: TocListProps) {
    return (
        <ul className={className}>
            {items.map((item, i) => (
                <li key={i} className={`toc-item toc-level-${item.level}`}>
                    <a
                        href={`#${item.id}`}
                        className={`toc-link${activeId === item.id ? ' toc-link-active' : ''}`}
                        onClick={onNavigate}
                    >
                        {item.text}
                    </a>
                </li>
            ))}
        </ul>
    );
}
