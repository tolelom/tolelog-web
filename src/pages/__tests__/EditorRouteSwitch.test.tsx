import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import EditorPage from '../EditorPage';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { makePost } from '../../test-utils/fixtures';

vi.mock('../../utils/api', () => ({
    POST_API: {
        getPost: vi.fn(async () => ({ status: 'success', data: makePost({ id: 5, title: '기존 제목', content: '기존 본문', user_id: 42 }) })),
    },
    SERIES_API: { getUserSeries: vi.fn(async () => ({ status: 'success', data: [] })) },
    TAG_API: { getTags: vi.fn(async () => ({ status: 'success', data: [] })) },
}));

vi.mock('vite-react-ssg', () => ({
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function GoToNewPost() {
    const navigate = useNavigate();
    return <button onClick={() => navigate('/editor')}>새 글</button>;
}

describe('EditorPage 라우트 전환', () => {
    it('글 수정에서 새 글 쓰기로 바로 옮겨 가면 이전 글 내용을 남기지 않는다', async () => {
        renderWithProviders(
            <>
                <GoToNewPost />
                <Routes>
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/editor/:postId" element={<EditorPage />} />
                </Routes>
            </>,
            { route: '/editor/5', authValue: { token: 'T', userId: 42 } },
        );
        await screen.findByDisplayValue('기존 제목');

        fireEvent.click(screen.getByRole('button', { name: '새 글' }));

        expect(await screen.findByPlaceholderText(/제목/)).toHaveValue('');
    });
});
