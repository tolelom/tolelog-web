import { AUTH_API } from '../lib/api';
import { useCompleteLogin } from '../hooks/useCompleteLogin';
import AuthForm from './AuthForm';
import { collectErrors, passwordError, usernameError } from '../features/auth/validation';

const LOGIN_FIELDS = [
    { name: 'username', label: '아이디', type: 'text', autoComplete: 'username' },
    { name: 'password', label: '비밀번호', type: 'password', autoComplete: 'current-password' },
];

function validateLogin(formData: Record<string, string>) {
    return collectErrors({
        username: usernameError(formData.username),
        password: passwordError(formData.password),
    });
}

export default function LoginBox() {
    const completeLogin = useCompleteLogin();

    const handleSubmit = async (formData: Record<string, string>) => {
        const response = await AUTH_API.login(formData.username, formData.password);
        completeLogin(response.data);
    };

    return (
        <AuthForm
            title="로그인"
            fields={LOGIN_FIELDS}
            submitLabel="로그인"
            loadingLabel="로그인 중..."
            onSubmit={handleSubmit}
            validate={validateLogin}
        />
    );
}
