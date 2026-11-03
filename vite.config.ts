/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 로그인이 필요한 라우트는 prerender 하지 않는다. 로그인·회원가입은 공개 폼이라 prerender 한다.
// prerender 하지 않은 경로는 nginx 가 홈 HTML 로 폴백해 하이드레이션이 어긋난다.
const PRIVATE_ROUTES = new Set<string>([
  'settings',
  'drafts',
  'editor',
  'editor_private',
]);

// vite-react-ssg 는 경로를 앞 / 없이('login') 넘긴다.
function normalizePath(p: string): string {
  if (p === '/' || p === '') return '/';
  return p.startsWith('/') ? p.slice(1) : p;
}

// 백엔드 sitemap.xml 에서 prerender 할 글·사용자·시리즈 주소를 얻는다. 받지 못하면 정적 라우트만 만든다.
async function discoverDynamicRoutes(): Promise<string[]> {
  const apiBase =
    process.env.VITE_SSG_API_URL
    || process.env.VITE_API_URL
    || 'https://api.tolelom.xyz';
  // 백엔드는 sitemap 을 /api/v1 없이 루트에 둔다.
  const url = `${apiBase.replace(/\/$/, '')}/sitemap.xml`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[ssg] sitemap fetch ${res.status} ${url} — 동적 라우트 prerender 생략`);
      return [];
    }
    const xml = await res.text();
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
    const paths = locs
      .map(loc => {
        try { return new URL(loc).pathname; }
        catch { return loc.startsWith('/') ? loc : null; }
      })
      .filter((p): p is string => !!p && /^\/(post|user|series)\//.test(p));
    console.info(`[ssg] sitemap 에서 ${paths.length} 개 공개 라우트 발견`);
    return paths;
  } catch (err) {
    console.warn(`[ssg] sitemap 접근 실패 — 동적 라우트 prerender 생략:`, err instanceof Error ? err.message : err);
    return [];
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // manualChunks 는 SSR 빌드의 external 모듈과 충돌해 쓰지 않는다. katex 는 dynamic import 로 따로 나뉜다.
  },
  // Node 에서 ESM/CJS 로 불러오다 깨지는 라이브러리는 SSR 번들에 넣는다.
  ssr: {
    noExternal: ['highlight.js', 'dompurify', 'react-helmet-async'],
  },
  ssgOptions: {
    async includedRoutes(paths) {
      const staticPublic = paths.filter(p => {
        const norm = normalizePath(p);
        if (norm === '*') return false;
        if (norm.includes(':')) return false;
        if (PRIVATE_ROUTES.has(norm)) return false;
        if (norm.startsWith('editor/') || norm.startsWith('editor')) return false;
        return true;
      });
      const discovered = (await discoverDynamicRoutes()).map(normalizePath);
      const all = new Set<string>([...staticPublic.map(normalizePath), ...discovered]);
      all.delete('');
      all.add('/');
      return Array.from(all);
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // 로컬 .env.local 의 사이트 주소가 canonical·구조화 데이터 테스트를 흔들지 않게 고정한다.
    env: { VITE_SITE_URL: 'https://blog.tolelom.xyz' },
    coverage: {
      reporter: ['text', 'json-summary', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/__tests__/**', 'src/test/**', 'src/test-utils/**', 'src/main.tsx', 'src/vite-env.d.ts', 'src/types/**'],
      // 낮은 바닥값. 커버리지가 오르면 함께 올린다.
      thresholds: { lines: 58, branches: 50 },
    },
  },
})
