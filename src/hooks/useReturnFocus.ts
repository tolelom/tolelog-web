import { useEffect, useRef } from 'react';

export function useReturnFocus(isOpen: boolean): void {
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
        return () => {
            const el = previouslyFocusedRef.current;
            if (el && typeof el.focus === 'function' && document.body.contains(el)) {
                el.focus();
            }
        };
    }, [isOpen]);
}
