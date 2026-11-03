import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
    ToastContext,
    type ToastApi,
    type ToastItem,
    type ToastOptions,
    type ToastType,
} from './ToastContext';
import { ToastContainer } from '../components/ToastContainer';
import { notify } from '../utils/notify';

const DURATIONS: Record<ToastType, number> = { success: 3000, info: 4000, error: 6000 };
const MAX_STACK = 3;

interface TimerRecord {
    // 마우스를 올려 멈춘 동안은 null 이다.
    timeoutId: ReturnType<typeof setTimeout> | null;
    startedAt: number;
    remaining: number;
}

function clearTimer(timer: TimerRecord | undefined): void {
    if (timer?.timeoutId) clearTimeout(timer.timeoutId);
}

interface ToastProviderProps {
    children: ReactNode;
}

function makeId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timersRef = useRef<Map<string, TimerRecord>>(new Map());

    const dismiss = useCallback((id: string) => {
        clearTimer(timersRef.current.get(id));
        timersRef.current.delete(id);
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        timersRef.current.forEach(clearTimer);
        timersRef.current.clear();
        setToasts([]);
    }, []);

    const scheduleDismiss = useCallback((id: string, duration: number) => {
        const timeoutId = setTimeout(() => {
            timersRef.current.delete(id);
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
        timersRef.current.set(id, { timeoutId, startedAt: Date.now(), remaining: duration });
    }, []);

    const push = useCallback((type: ToastType, message: string, options?: ToastOptions): string => {
        const id = makeId();
        const duration = options?.duration ?? DURATIONS[type];
        const item: ToastItem = { id, type, message, createdAt: Date.now(), duration };

        setToasts(prev => {
            const next = [...prev, item];
            if (next.length > MAX_STACK) {
                const toEvict = next.slice(0, next.length - MAX_STACK);
                toEvict.forEach(ev => {
                    clearTimer(timersRef.current.get(ev.id));
                    timersRef.current.delete(ev.id);
                });
                return next.slice(-MAX_STACK);
            }
            return next;
        });

        scheduleDismiss(id, duration);
        return id;
    }, [scheduleDismiss]);

    const onHoverStart = useCallback((id: string) => {
        const timer = timersRef.current.get(id);
        if (!timer?.timeoutId) return;
        clearTimeout(timer.timeoutId);
        const elapsed = Date.now() - timer.startedAt;
        const remaining = Math.max(0, timer.remaining - elapsed);
        timersRef.current.set(id, { ...timer, timeoutId: null, remaining });
    }, []);

    const onHoverEnd = useCallback((id: string) => {
        const timer = timersRef.current.get(id);
        if (!timer || timer.timeoutId) return;
        scheduleDismiss(id, timer.remaining);
    }, [scheduleDismiss]);

    const api = useMemo<ToastApi>(() => ({
        success: (message, options) => push('success', message, options),
        error: (message, options) => push('error', message, options),
        info: (message, options) => push('info', message, options),
        dismiss,
        dismissAll,
    }), [push, dismiss, dismissAll]);

    useEffect(() => {
        notify._register(api);
        return () => notify._unregister();
    }, [api]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setToasts(prev => {
                if (prev.length === 0) return prev;
                const last = prev[prev.length - 1];
                clearTimer(timersRef.current.get(last.id));
                timersRef.current.delete(last.id);
                return prev.slice(0, -1);
            });
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach(clearTimer);
            timers.clear();
        };
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast: api }}>
            {children}
            <ToastContainer
                toasts={toasts}
                onDismiss={dismiss}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
            />
        </ToastContext.Provider>
    );
}
