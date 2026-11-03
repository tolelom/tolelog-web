import { describe, expect, it } from 'vitest';
import spec from '../../../../api-contract/swagger.json';
import {
    charCount, COMMENT_MAX, PASSWORD_MAX_BYTES, PASSWORD_MIN, POST_CONTENT_MAX, POST_TAGS_MAX, POST_TITLE_MAX,
    SEARCH_QUERY_MAX, SEARCH_QUERY_MIN, SERIES_DESCRIPTION_MAX, SERIES_TITLE_MAX, TAG_NAME_MAX, USERNAME_MAX,
    USERNAME_MIN, utf8ByteLength,
} from '../limits';

interface FieldSchema {
    minLength?: number;
    maxLength?: number;
    'x-max-bytes'?: string;
    'x-tag-max-runes'?: string;
}

function field(definition: string, name: string): FieldSchema {
    const definitions = spec.definitions as unknown as Record<string, { properties: Record<string, FieldSchema> }>;
    return definitions[definition].properties[name];
}

describe('limits match the API contract', () => {
    it('username and password', () => {
        for (const def of ['dto.RegisterRequest', 'dto.LoginRequest']) {
            expect(field(def, 'username')).toMatchObject({ minLength: USERNAME_MIN, maxLength: USERNAME_MAX });
        }
        expect(field('dto.RegisterRequest', 'password')).toMatchObject({ minLength: PASSWORD_MIN, 'x-max-bytes': String(PASSWORD_MAX_BYTES) });
        expect(field('dto.ChangePasswordRequest', 'new_password')).toMatchObject({ minLength: PASSWORD_MIN, 'x-max-bytes': String(PASSWORD_MAX_BYTES) });
    });

    it('post title, content and tags', () => {
        for (const def of ['dto.CreatePostRequest', 'dto.UpdatePostRequest']) {
            expect(field(def, 'title').maxLength).toBe(POST_TITLE_MAX);
            expect(field(def, 'content').maxLength).toBe(POST_CONTENT_MAX);
            expect(field(def, 'tags')).toMatchObject({ maxLength: POST_TAGS_MAX, 'x-tag-max-runes': String(TAG_NAME_MAX) });
        }
    });

    it('comment and series', () => {
        expect(field('dto.CreateCommentRequest', 'content').maxLength).toBe(COMMENT_MAX);
        expect(field('dto.UpdateCommentRequest', 'content').maxLength).toBe(COMMENT_MAX);
        for (const def of ['dto.CreateSeriesRequest', 'dto.UpdateSeriesRequest']) {
            expect(field(def, 'title').maxLength).toBe(SERIES_TITLE_MAX);
            expect(field(def, 'description').maxLength).toBe(SERIES_DESCRIPTION_MAX);
        }
    });

    it('search query', () => {
        const q = spec.paths['/posts/search'].get.parameters.find(p => p.name === 'q');
        expect(q).toMatchObject({ minLength: SEARCH_QUERY_MIN, maxLength: SEARCH_QUERY_MAX });
    });
});

describe('length helpers', () => {
    it('counts characters as code points like the server', () => {
        expect(charCount('가나다')).toBe(3);
        expect(charCount('😀a')).toBe(2);
    });

    it('counts UTF-8 bytes', () => {
        expect(utf8ByteLength('abc')).toBe(3);
        expect(utf8ByteLength('가')).toBe(3);
        expect(utf8ByteLength('😀')).toBe(4);
    });
});
