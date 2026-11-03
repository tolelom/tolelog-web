export type FormErrors = Record<string, string>;

const USERNAME_MIN = 4;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 6;

export function usernameError(username: string): string | null {
    if (!username) return '아이디를 입력해주세요.';
    if (username.length < USERNAME_MIN) return `아이디는 ${USERNAME_MIN}자 이상이어야 합니다.`;
    if (username.length > USERNAME_MAX) return `아이디는 ${USERNAME_MAX}자 이하여야 합니다.`;
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return '아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.';
    return null;
}

export function passwordError(password: string, maxLength?: number): string | null {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < PASSWORD_MIN) return `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.`;
    if (maxLength !== undefined && password.length > maxLength) return `비밀번호는 ${maxLength}자 이하여야 합니다.`;
    return null;
}

export function collectErrors(checks: Record<string, string | null>): FormErrors {
    const errors: FormErrors = {};
    for (const [field, message] of Object.entries(checks)) {
        if (message) errors[field] = message;
    }
    return errors;
}
