import type { PostListItem, Pagination, PostListWithPagination } from '../types';

export interface PostListPage {
    posts: PostListItem[];
    pagination?: Pagination;
    hasMore: boolean;
}

// 글 목록 응답을 읽는다. pagination 이 없는 응답은 한 페이지가 가득 찼으면 다음이 있다고 본다.
export function parsePostListPage(
    data: PostListItem[] | PostListWithPagination,
    page: number,
    pageSize: number,
): PostListPage {
    const posts = Array.isArray(data) ? data : data.posts || [];
    const pagination = Array.isArray(data) ? undefined : data.pagination;
    const hasMore = pagination ? page < pagination.total_pages : posts.length === pageSize;
    return { posts, pagination, hasMore };
}

// 주소의 ?page= 를 읽는다. 없거나 숫자가 아니거나 1보다 작으면 첫 페이지다.
export function parsePageParam(value: string | null): number {
    const page = parseInt(value ?? '', 10);
    return Number.isFinite(page) && page > 1 ? page : 1;
}
