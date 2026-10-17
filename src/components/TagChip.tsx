import type { MouseEvent } from 'react';

interface TagChipProps {
    tag: string;
    active?: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

// 눌러서 그 태그로 거르는 태그 칩
export default function TagChip({ tag, active = false, onClick }: TagChipProps) {
    return (
        <button
            type="button"
            className={`tag-chip tag-chip-btn${active ? ' tag-chip-active' : ''}`}
            onClick={onClick}
        >
            {tag}
        </button>
    );
}
