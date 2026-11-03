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

// 목록 주소의 검색 조건을 유지한 채 page 만 바꾼다. 첫 페이지는 ?page= 를 붙이지 않는다(canonical 과 맞춘다).
export function listSearchParams(page: number, filters: Record<string, string>): Record<string, string> {
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(filters)) {
        if (value) params[key] = value;
    }
    if (page > 1) params.page = String(page);
    return params;
}
