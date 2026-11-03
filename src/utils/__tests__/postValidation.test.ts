import { describe, expect, it } from 'vitest';
import { postLimitError } from '../postValidation';

const valid = { title: '제목', content: '본문', tags: 'go,react' };

describe('postLimitError', () => {
    it('passes a post within every limit', () => {
        expect(postLimitError(valid)).toBeNull();
        expect(postLimitError({ ...valid, title: '가'.repeat(255), tags: '가'.repeat(50) })).toBeNull();
    });

    it('rejects a title over 255 characters', () => {
        expect(postLimitError({ ...valid, title: '가'.repeat(256) })).toBe('제목은 255자 이하여야 합니다');
    });

    it('rejects content over 500,000 characters', () => {
        expect(postLimitError({ ...valid, content: 'a'.repeat(500_001) })).toBe('내용은 500,000자 이하여야 합니다');
    });

    it('rejects a tag over 50 characters and names it', () => {
        const longTag = '가'.repeat(51);
        expect(postLimitError({ ...valid, tags: `go, ${longTag}` })).toBe(`태그는 50자 이하여야 합니다: ${longTag}`);
    });

    it('rejects a tag list over 500 characters', () => {
        const tags = Array.from({ length: 60 }, (_, i) => `tag${String(i).padStart(5, '0')}`).join(',');
        expect(postLimitError({ ...valid, tags })).toBe('태그는 모두 합쳐 500자 이하여야 합니다');
    });
});
