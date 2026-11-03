export const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 끝에 / 를 붙이지 않는다(경로와 바로 이어 붙인다).
export const SITE_URL: string = import.meta.env.VITE_SITE_URL || 'https://blog.tolelom.xyz';
export const SITE_NAME: string = 'Tolelog';
export const SITE_DESCRIPTION: string = 'Tolelog - 마크다운 블로그 플랫폼';

export const STORAGE_KEYS = {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    DRAFT: 'tolelog_draft',
    DRAFT_EDIT: 'tolelog_draft_edit',
    THEME: 'tolelog_theme',
} as const;

export const AUTO_SAVE_DELAY_MS: number = 1000;

export const BLOG_OWNER_ID: number = 1;

export const IMAGE_CONSTRAINTS = {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
    MAX_WIDTH: 1200,
    QUALITY: 0.8,
} as const;
