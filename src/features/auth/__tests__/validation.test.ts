import { describe, it, expect } from 'vitest';
import { collectErrors, PASSWORD_TOO_LONG_MESSAGE, passwordError, usernameError } from '../validation';

describe('authValidation', () => {
    it('아이디 규칙을 앞에서부터 하나만 알린다', () => {
        expect(usernameError('')).toBe('아이디를 입력해주세요.');
        expect(usernameError('abc')).toBe('아이디는 4자 이상이어야 합니다.');
        expect(usernameError('a'.repeat(21))).toBe('아이디는 20자 이하여야 합니다.');
        expect(usernameError('한글아이디')).toBe('아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.');
        expect(usernameError('tole_lom1')).toBeNull();
    });

    it('비밀번호 상한은 요청할 때만 UTF-8 바이트 수로 검사한다', () => {
        expect(passwordError('12345')).toBe('비밀번호는 6자 이상이어야 합니다.');
        expect(passwordError('a'.repeat(200))).toBeNull();
        expect(passwordError('a'.repeat(72), { checkMaxBytes: true })).toBeNull();
        expect(passwordError('a'.repeat(73), { checkMaxBytes: true })).toBe(PASSWORD_TOO_LONG_MESSAGE);
        expect(passwordError('가'.repeat(24), { checkMaxBytes: true })).toBeNull();
        expect(passwordError('가'.repeat(25), { checkMaxBytes: true })).toBe(PASSWORD_TOO_LONG_MESSAGE);
    });

    it('비밀번호 최소 길이는 이모지를 한 글자로 센다', () => {
        expect(passwordError('😀😀😀')).toBe('비밀번호는 6자 이상이어야 합니다.');
        expect(passwordError('😀'.repeat(6))).toBeNull();
    });

    it('문제가 있는 필드만 모은다', () => {
        expect(collectErrors({ username: null, password: '짧음' })).toEqual({ password: '짧음' });
    });
});
