import { describe, it, expect } from 'vitest';
import { parsePageParam } from '../postList';

describe('parsePageParam', () => {
    it('읽을 수 있는 페이지 번호는 그대로 쓴다', () => {
        expect(parsePageParam('3')).toBe(3);
    });

    it('없거나 숫자가 아니거나 1보다 작으면 첫 페이지로 본다', () => {
        expect(parsePageParam(null)).toBe(1);
        expect(parsePageParam('')).toBe(1);
        expect(parsePageParam('abc')).toBe(1);
        expect(parsePageParam('0')).toBe(1);
        expect(parsePageParam('-2')).toBe(1);
    });
});
