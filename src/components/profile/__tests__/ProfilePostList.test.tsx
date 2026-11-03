import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ProfilePostList from '../ProfilePostList';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { makePostListItem } from '../../../test-utils/fixtures';

const post = makePostListItem({
    id: 27,
    title: 'Mark and Sweep GC',
    view_count: 3,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
    excerpt: '도달 가능한 객체만 유지하고, 나머지는 삭제하는 알고리즘',
});

describe('ProfilePostList', () => {
    it('shows the excerpt the list API returns under each post', () => {
        renderWithProviders(
            <ProfilePostList
                posts={[post]}
                totalPosts={1}
                page={1}
                totalPages={1}
                hasMore={false}
                tagFilter={null}
                isOwner={false}
                profileUsername="tolelom"
                onClearTagFilter={vi.fn()}
                onTagClick={vi.fn()}
                onPrevPage={vi.fn()}
                onNextPage={vi.fn()}
            />,
        );
        expect(screen.getByText(post.excerpt!)).toBeInTheDocument();
    });
});
