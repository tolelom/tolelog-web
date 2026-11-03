import { charCount, PASSWORD_MAX_BYTES, PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN, utf8ByteLength } from '../lib/api/limits';

export type FormErrors = Record<string, string>;

export const PASSWORD_TOO_LONG_MESSAGE =
    `비밀번호가 너무 깁니다. ${PASSWORD_MAX_BYTES}바이트(영문 ${PASSWORD_MAX_BYTES}자, 한글 ${PASSWORD_MAX_BYTES / 3}자) 이하로 입력해주세요.`;

export function usernameError(username: string): string | null {
    if (!username) return '아이디를 입력해주세요.';
    if (username.length < USERNAME_MIN) return `아이디는 ${USERNAME_MIN}자 이상이어야 합니다.`;
    if (username.length > USERNAME_MAX) return `아이디는 ${USERNAME_MAX}자 이하여야 합니다.`;
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return '아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.';
    return null;
}

export function isPasswordTooLong(password: string): boolean {
    return utf8ByteLength(password) > PASSWORD_MAX_BYTES;
}

// 로그인은 길이 상한을 보지 않는다. 가입·변경 때 막았으므로 상한을 넘는 계정은 없다.
export function passwordError(password: string, { checkMaxBytes = false } = {}): string | null {
    if (!password) return '비밀번호를 입력해주세요.';
    if (charCount(password) < PASSWORD_MIN) return `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.`;
    if (checkMaxBytes && isPasswordTooLong(password)) return PASSWORD_TOO_LONG_MESSAGE;
    return null;
}

export function collectErrors(checks: Record<string, string | null>): FormErrors {
    const errors: FormErrors = {};
    for (const [field, message] of Object.entries(checks)) {
        if (message) errors[field] = message;
    }
    return errors;
}
