import { escapeHtml } from './text';

// KaTeX(약 260KB)는 수식을 처음 그릴 때 불러온다. 도착하면 구독자에게 알려 다시 그리게 한다.

interface KatexModule {
    renderToString(expr: string, options: { displayMode: boolean; throwOnError: boolean }): string;
}

let katexModule: KatexModule | null = null;
let katexLoading: Promise<KatexModule> | null = null;
const katexReadyCallbacks = new Set<() => void>();

function notifyKatexReady(): void {
    katexReadyCallbacks.forEach((cb) => {
        try { cb(); } catch { /* 한 구독자의 오류가 다른 구독자 알림을 막지 않게 한다 */ }
    });
}

export function subscribeKatexReady(cb: () => void): () => void {
    katexReadyCallbacks.add(cb);
    return () => { katexReadyCallbacks.delete(cb); };
}

export function isKatexReady(): boolean {
    return katexModule !== null;
}

function loadKatex(): Promise<KatexModule> {
    if (katexModule) return Promise.resolve(katexModule);
    if (katexLoading) return katexLoading;
    katexLoading = Promise.all([
        import('katex') as Promise<{ default?: KatexModule } & KatexModule>,
        import('katex/dist/katex.min.css'),
    ]).then(([m]) => {
        katexModule = (m.default || m) as KatexModule;
        notifyKatexReady();
        return katexModule;
    });
    return katexLoading;
}

export function renderKatex(expr: string, displayMode: boolean): string {
    if (!katexModule) {
        void loadKatex();
        const tag = displayMode ? 'div' : 'span';
        return `<${tag} class="math-pending">${escapeHtml(expr)}</${tag}>`;
    }
    try {
        return katexModule.renderToString(expr, { displayMode, throwOnError: false });
    } catch {
        return `<span class="katex-error">${escapeHtml(expr)}</span>`;
    }
}
