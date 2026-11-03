import { describe, it, expect } from 'vitest';
import { collectErrors, passwordError, usernameError } from '../authValidation';

describe('authValidation', () => {
    it('아이디 규칙을 앞에서부터 하나만 알린다', () => {
        expect(usernameError('')).toBe('아이디를 입력해주세요.');
        expect(usernameError('abc')).toBe('아이디는 4자 이상이어야 합니다.');
        expect(usernameError('a'.repeat(21))).toBe('아이디는 20자 이하여야 합니다.');
        expect(usernameError('한글아이디')).toBe('아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.');
        expect(usernameError('tole_lom1')).toBeNull();
    });

    it('비밀번호 최대 길이는 넘겨줄 때만 검사한다', () => {
        expect(passwordError('12345')).toBe('비밀번호는 6자 이상이어야 합니다.');
        expect(passwordError('a'.repeat(200))).toBeNull();
        expect(passwordError('a'.repeat(129), 128)).toBe('비밀번호는 128자 이하여야 합니다.');
    });

    it('문제가 있는 필드만 모은다', () => {
        expect(collectErrors({ username: null, password: '짧음' })).toEqual({ password: '짧음' });
    });
});
