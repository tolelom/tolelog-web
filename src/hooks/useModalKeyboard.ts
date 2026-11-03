import { useEffect, type RefObject } from 'react';

// Escape 로 닫고, Tab 이 모달 밖으로 나가지 않게 처음·끝에서 돌린다.
export function useModalKeyboard(
    modalRef: RefObject<HTMLElement | null>,
    onClose: () => void,
    focusableSelector: string,
    enabled: boolean = true,
): void {
    useEffect(() => {
        if (!enabled) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab' || !modalRef.current) return;
            const focusable = modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalRef, onClose, focusableSelector, enabled]);
}
