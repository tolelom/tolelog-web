// VITE_SENTRY_DSN 이 있을 때만 Sentry 를 별도 청크로 불러온다. 없으면 콘솔에만 남긴다.

type CaptureFn = (err: unknown, context?: Record<string, unknown>) => void;

const consoleCapture: CaptureFn = (err, context) => {
    if (context) console.error('[Error]', err, context);
    else console.error('[Error]', err);
};

let capture: CaptureFn = consoleCapture;
let initialized = false;

// Sentry 가 로드되기 전에 난 오류는 콘솔에만 남는다.
export function initErrorReporting(): void {
    if (initialized) return;
    initialized = true;

    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn || typeof window === 'undefined') return;

    import('@sentry/react')
        .then((Sentry) => {
            Sentry.init({
                dsn,
                environment: import.meta.env.MODE,
                // 오류만 보낸다. 성능 추적과 세션 리플레이는 끈다.
                tracesSampleRate: 0,
                replaysSessionSampleRate: 0,
                replaysOnErrorSampleRate: 0,
            });
            capture = (err, context) => {
                Sentry.captureException(err, context ? { extra: context } : undefined);
            };
        })
        .catch(() => { /* 콘솔 기록을 그대로 쓴다 */ });
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
    capture(err, context);
}
