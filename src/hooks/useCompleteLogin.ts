import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { AuthData } from '../types';

// 로그인·가입 응답으로 세션을 열고, PrivateRoute 가 보낸 경우 원래 가려던 화면으로 돌려보낸다.
export function useCompleteLogin(): (auth: AuthData) => void {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    return (auth: AuthData) => {
        login({
            token: auth.access_token,
            refreshToken: auth.refresh_token,
            username: auth.username,
            userId: auth.user_id,
            avatarUrl: auth.avatar_url,
        });
        const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/';
        navigate(from, { replace: true });
    };
}
