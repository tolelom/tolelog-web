import { AUTH_API } from '../utils/api';
import { useCompleteLogin } from '../hooks/useCompleteLogin';
import AuthForm from './AuthForm';
import { collectErrors, passwordError, usernameError } from './authValidation';

const REGISTER_FIELDS = [
    { name: 'username', label: '아이디', type: 'text', autoComplete: 'username' },
    { name: 'password', label: '비밀번호', type: 'password', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: '비밀번호 확인', type: 'password', autoComplete: 'new-password' },
];

function validateRegister(formData: Record<string, string>) {
    return collectErrors({
        username: usernameError(formData.username),
        password: passwordError(formData.password, { checkMaxBytes: true }),
        confirmPassword: formData.password !== formData.confirmPassword ? '비밀번호가 일치하지 않습니다.' : null,
    });
}

export default function RegisterBox() {
    const completeLogin = useCompleteLogin();

    const handleSubmit = async (formData: Record<string, string>) => {
        const response = await AUTH_API.register(formData.username, formData.password);
        completeLogin(response.data);
    };

    return (
        <AuthForm
            title="회원가입"
            fields={REGISTER_FIELDS}
            submitLabel="회원가입"
            loadingLabel="가입 중..."
            onSubmit={handleSubmit}
            validate={validateRegister}
        />
    );
}
