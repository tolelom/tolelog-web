// 초안을 /editor/:id 로 열었을 때 백엔드로 가는 PUT payload. fetch 만 stub 하고 실제 POST_API 를 쓴다.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import EditorPage from '../EditorPage';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { makePost } from '../../test-utils/fixtures';
import type { Post } from '../../types';

vi.mock('vite-react-ssg', () => ({
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

type Put = { url: string; body: Record<string, unknown> };

function stubApi(post: Post): Put[] {
    const puts: Put[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET';
        if (method === 'PUT') puts.push({ url, body: JSON.parse(String(init?.body)) });
        const data = method === 'GET' && url.endsWith(`/api/v1/posts/${post.id}`) ? post
            : method === 'PUT' ? { id: post.id }
            : [];
        return new Response(JSON.stringify({ status: 'success', data }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    }));
    return puts;
}

async function openInEditor(post: Post) {
    renderWithProviders(
        <Routes>
            <Route path="/editor/:postId" element={<EditorPage />} />
            <Route path="/post/*" element={<p>글 상세 화면</p>} />
        </Routes>,
        { authValue: { token: 'T', userId: 42 }, route: `/editor/${post.id}` },
    );
    await screen.findByDisplayValue(post.title);
}

function publicToggle(): HTMLInputElement {
    return document.querySelector('input[name="is_public"]') as HTMLInputElement;
}

const draft = () => makePost({ id: 5, title: '쓰던 초안', content: '초안 본문', user_id: 42, is_public: false, status: 'draft' });

describe('EditorPage: 초안 저장과 발행', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it('초안에는 수정 완료 대신 임시저장과 발행 버튼이 있다', async () => {
        stubApi(draft());
        await openInEditor(draft());
        expect(screen.getByRole('button', { name: '임시저장' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '발행' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '수정 완료' })).not.toBeInTheDocument();
    });

    it('임시저장은 draft 로 남기고 바꾼 공개 설정을 함께 보낸 뒤 페이지에 머문다', async () => {
        const puts = stubApi(draft());
        await openInEditor(draft());
        fireEvent.click(publicToggle());
        fireEvent.click(screen.getByRole('button', { name: '임시저장' }));
        await waitFor(() => expect(puts).toHaveLength(1));
        expect(puts[0].url).toMatch(/\/api\/v1\/posts\/5$/);
        expect(puts[0].body).toMatchObject({ status: 'draft', is_public: true, title: '쓰던 초안' });
        expect(await screen.findByText('임시저장했습니다')).toBeInTheDocument();
        await new Promise(r => setTimeout(r, 1000));
        expect(screen.queryByText('글 상세 화면')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('쓰던 초안')).toBeInTheDocument();
    });

    it('발행은 published 와 현재 공개 설정을 보내고 글로 이동한다', async () => {
        const puts = stubApi(draft());
        await openInEditor(draft());
        fireEvent.click(screen.getByRole('button', { name: '발행' }));
        await waitFor(() => expect(puts).toHaveLength(1));
        expect(puts[0].body).toMatchObject({ status: 'published', is_public: false });
        expect(await screen.findByText('글 상세 화면', {}, { timeout: 3000 })).toBeInTheDocument();
    });

    it('발행된 글은 수정 완료 하나로 저장하고 published 를 유지한다', async () => {
        const published = makePost({ id: 7, title: '발행한 글', content: '본문', user_id: 42, is_public: true, status: 'published' });
        const puts = stubApi(published);
        await openInEditor(published);
        expect(screen.queryByRole('button', { name: '임시저장' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: '수정 완료' }));
        await waitFor(() => expect(puts).toHaveLength(1));
        expect(puts[0].body).toMatchObject({ status: 'published', is_public: true });
    });
});
