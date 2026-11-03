import type { FocusEvent, KeyboardEvent, MouseEvent, Ref, TouchEvent } from 'react';
import type { ImageLine } from './imageMarkdown';

const SIZE_PRESETS: { label: string; width: string | null }[] = [
    { label: '작게', width: '25%' },
    { label: '보통', width: '50%' },
    { label: '크게', width: '75%' },
    { label: '원본', width: null },
];

const MIN_DRAG_WIDTH_PX = 40;
const KEYBOARD_STEP_PERCENT = 5;
const MIN_KEYBOARD_PERCENT = 10;

interface ImageBlockEditorProps {
    image: ImageLine;
    onResize: (width: string | null) => void;
    onBlur: (e: FocusEvent<HTMLDivElement>) => void;
    focusRef: Ref<HTMLDivElement>;
}

export default function ImageBlockEditor({ image, onResize, onBlur, focusRef }: ImageBlockEditorProps) {
    const startDrag = (e: MouseEvent | TouchEvent, startX: number) => {
        e.preventDefault();
        e.stopPropagation();
        const wrapperEl = (e.currentTarget as HTMLElement).closest<HTMLElement>('.image-resize-wrapper');
        if (wrapperEl) trackResizeDrag(startX, wrapperEl, onResize);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const currentPercent = parseInt(image.width || '100', 10);
        const delta = e.key === 'ArrowRight' ? KEYBOARD_STEP_PERCENT : -KEYBOARD_STEP_PERCENT;
        const nextPercent = Math.max(MIN_KEYBOARD_PERCENT, Math.min(100, currentPercent + delta));
        onResize(`${nextPercent}%`);
    };

    return (
        <div ref={focusRef} tabIndex={0} className="block-image-editor" onBlur={onBlur}>
            <div className="image-resize-wrapper" style={image.width ? { width: image.width } : {}}>
                <img src={image.src} alt={image.alt} draggable={false} />
                <div
                    className="image-resize-handle"
                    role="slider"
                    tabIndex={0}
                    aria-label="이미지 크기 조절"
                    aria-valuetext={image.width || '원본'}
                    onMouseDown={(e) => startDrag(e, e.clientX)}
                    onTouchStart={(e) => startDrag(e, e.touches[0].clientX)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className="image-resize-controls">
                {SIZE_PRESETS.map(preset => (
                    <button
                        key={preset.label}
                        className={`image-resize-btn ${image.width === preset.width ? 'active' : ''}`}
                        onMouseDown={(e) => {
                            // 누르는 순간 포커스가 빠져 편집기가 닫히지 않게 막는다.
                            e.preventDefault();
                            onResize(preset.width);
                        }}
                    >
                        {preset.label}
                    </button>
                ))}
                <span className="image-size-label">{image.width || '원본'}</span>
            </div>
        </div>
    );
}

// 드래그 중에는 DOM 너비만 바꾸고, 놓을 때 한 번만 마크다운에 반영한다.
function trackResizeDrag(startX: number, wrapperEl: HTMLElement, onResize: (width: string) => void) {
    const editorEl = wrapperEl.closest<HTMLElement>('.block-image-editor');
    const availableWidth = editorEl ? editorEl.getBoundingClientRect().width : 0;
    if (!availableWidth) return;

    const startWidthPx = wrapperEl.getBoundingClientRect().width;
    const percentAt = (currentX: number): string => {
        const widthPx = Math.max(startWidthPx + (currentX - startX), MIN_DRAG_WIDTH_PX);
        return `${Math.min(Math.round((widthPx / availableWidth) * 100), 100)}%`;
    };

    const onMouseMove = (e: globalThis.MouseEvent) => { wrapperEl.style.width = percentAt(e.clientX); };
    const onMouseUp = (e: globalThis.MouseEvent) => {
        onResize(percentAt(e.clientX));
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
    };
    const onTouchMove = (e: globalThis.TouchEvent) => {
        e.preventDefault();
        wrapperEl.style.width = percentAt(e.touches[0].clientX);
    };
    const onTouchEnd = (e: globalThis.TouchEvent) => {
        onResize(percentAt(e.changedTouches[0].clientX));
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}
