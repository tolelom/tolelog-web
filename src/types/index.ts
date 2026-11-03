import type { components } from './api.gen';

// 백엔드 API 의 요청·응답 모양은 api.gen.ts(tolelog-api Swagger 에서 생성)를 따른다.
type Schemas = components['schemas'];

export type SuccessResponse<T> = Omit<Schemas['dto.SuccessResponse'], 'data'> & { data: T };
export type ErrorResponse = Schemas['dto.ErrorResponse'];

export type AuthData = Schemas['dto.AuthDataResponse'];
export type User = Schemas['dto.UserResponse'];
export type AvatarUpload = Schemas['dto.AvatarResponse'];
export type ImageUpload = Schemas['dto.ImageUploadResponse'];
export type MessageData = Schemas['dto.MessageResponse'];

export type Post = Schemas['dto.PostResponse'];
export type PostListItem = Schemas['dto.PostListResponse'];
export type Pagination = Schemas['dto.Pagination'];
export type PostListWithPagination = Schemas['dto.PostListWithPagination'];
export type LikeToggle = Schemas['dto.LikeToggleResponse'];
export type LikeStatus = Schemas['dto.LikeStatusResponse'];

export type Comment = Schemas['dto.CommentResponse'];
export type CommentListResponse = Schemas['dto.CommentListResponse'];

export type Series = Schemas['dto.SeriesResponse'];
export type SeriesPostItem = Schemas['dto.SeriesPostItem'];
export type SeriesDetail = Schemas['dto.SeriesDetailResponse'];
export type SeriesNav = Schemas['dto.SeriesNavResponse'];
export type SeriesInfo = Schemas['dto.SeriesInfo'];

export type TagList = Schemas['dto.TagListResponse'];

export type CreatePostRequest = Schemas['dto.CreatePostRequest'];
export type UpdatePostRequest = Schemas['dto.UpdatePostRequest'];

export interface TagInfo {
    name: string;
    count: number;
}

export interface HeadingBlock {
    type: 'heading';
    level: number;
    text: string;
    raw: string;
}

export interface ParagraphBlock {
    type: 'paragraph';
    text: string;
    raw: string;
}

export interface CodeBlock {
    type: 'code';
    lang: string;
    code: string;
    raw: string;
}

export interface MathBlock {
    type: 'math_block';
    expr: string;
    raw: string;
}

export interface BlockquoteBlock {
    type: 'blockquote';
    text: string;
    raw: string;
}

export interface ChecklistItem {
    checked: boolean;
    text: string;
}

export interface ChecklistBlock {
    type: 'checklist';
    items: ChecklistItem[];
    raw: string;
}

export interface UnorderedListBlock {
    type: 'unordered_list';
    items: string[];
    raw: string;
}

export interface OrderedListBlock {
    type: 'ordered_list';
    items: string[];
    raw: string;
}

export interface TableBlock {
    type: 'table';
    headers: string[];
    alignments: string[];
    rows: string[][];
    raw: string;
}

export interface HrBlock {
    type: 'hr';
    raw: string;
}

export interface ImageBlock {
    type: 'image';
    alt: string;
    src: string;
    width: string | null;
    raw: string;
}

export interface FootnoteDefBlock {
    type: 'footnote_def';
    id: string;
    text: string;
    raw: string;
}

export type Block =
    | HeadingBlock
    | ParagraphBlock
    | CodeBlock
    | MathBlock
    | BlockquoteBlock
    | ChecklistBlock
    | UnorderedListBlock
    | OrderedListBlock
    | TableBlock
    | HrBlock
    | ImageBlock
    | FootnoteDefBlock;

export interface DraftData {
    title: string;
    content: string;
    is_public: boolean;
    tags: string;
    savedAt: string;
}

export interface PostFormData {
    title: string;
    content: string;
    is_public: boolean;
    tags: string;
}

export interface ImageValidationResult {
    valid: boolean;
    error?: string;
}
