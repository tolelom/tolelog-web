import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type LoginParams } from './AuthContext';
import { AUTH_API } from '../utils/api';
import { AUTH_TOKENS_EVENT, type AuthTokens } from '../utils/api/client';
import { STORAGE_KEYS } from '../utils/constants';

const isBrowser = typeof window !== 'undefined';

interface SessionUser {
    username: string | null;
    userId: number | null;
    avatarUrl: string | null;
}

const NO_USER: SessionUser = { username: null, userId: null, avatarUrl: null };

function userFromJson(json: string): SessionUser {
    const parsed = JSON.parse(json);
    return {
        username: parsed?.username ?? null,
        userId: parsed?.user_id ?? null,
        avatarUrl: parsed?.avatar_url ?? null,
    };
}

function readStoredToken(key: string): string | null {
    if (!isBrowser) return null;
    try { return localStorage.getItem(key); } catch { return null; }
}

function readStoredUser(): SessionUser {
    if (!isBrowser) return NO_USER;
    try {
        const json = localStorage.getItem(STORAGE_KEYS.USER);
        return json ? userFromJson(json) : NO_USER;
    } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
        return NO_USER;
    }
}

function persist(key: string, value: string | null): void {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    // SSG 와 하이드레이션 첫 렌더는 비로그인으로 같게 두고, 마운트 뒤 localStorage 에서 읽는다.
    // 읽기 전(ready=false)에는 저장 effect 가 localStorage 를 지우지 않고, 로그인이 필요한 화면은 판단을 미룬다.
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<SessionUser>(NO_USER);
    const [ready, setReady] = useState(false);
    const { username, userId, avatarUrl } = user;

    const clearSession = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        setUser(NO_USER);
    }, []);

    useEffect(() => {
        setToken(readStoredToken(STORAGE_KEYS.TOKEN));
        setRefreshToken(readStoredToken(STORAGE_KEYS.REFRESH_TOKEN));
        setUser(readStoredUser());
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) persist(STORAGE_KEYS.TOKEN, token);
    }, [token, ready]);

    useEffect(() => {
        if (ready) persist(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }, [refreshToken, ready]);

    useEffect(() => {
        if (!ready) return;
        const json = username && userId
            ? JSON.stringify({ username, user_id: userId, avatar_url: avatarUrl || '' })
            : null;
        persist(STORAGE_KEYS.USER, json);
    }, [username, userId, avatarUrl, ready]);

    // 이미 로그아웃했으면 늦게 도착한 갱신 토큰으로 다시 로그인되지 않게 버린다.
    useEffect(() => {
        const handleTokens = (e: Event) => {
            const tokens = (e as CustomEvent<AuthTokens | null>).detail;
            if (!tokens) {
                clearSession();
                return;
            }
            setToken(prev => (prev === null ? null : tokens.token));
            setRefreshToken(prev => (prev === null ? null : tokens.refreshToken));
        };
        window.addEventListener(AUTH_TOKENS_EVENT, handleTokens);
        return () => window.removeEventListener(AUTH_TOKENS_EVENT, handleTokens);
    }, [clearSession]);

    useEffect(() => {
        const syncFromOtherTab = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.TOKEN) {
                if (!e.newValue) {
                    clearSession();
                } else {
                    setToken(e.newValue);
                    setRefreshToken(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
                    setUser(readStoredUser());
                }
            }
            if (e.key === STORAGE_KEYS.REFRESH_TOKEN) {
                setRefreshToken(e.newValue ?? null);
            }
            if (e.key === STORAGE_KEYS.USER) {
                if (!e.newValue) {
                    setUser(NO_USER);
                } else {
                    try { setUser(userFromJson(e.newValue)); } catch { /* 깨진 값이면 지금 상태를 둔다 */ }
                }
            }
        };
        window.addEventListener('storage', syncFromOtherTab);
        return () => window.removeEventListener('storage', syncFromOtherTab);
    }, [clearSession]);

    const login = (params: LoginParams) => {
        setToken(params.token);
        setRefreshToken(params.refreshToken);
        setUser({ username: params.username, userId: params.userId, avatarUrl: params.avatarUrl || null });
    };

    const logout = () => {
        if (token) {
            AUTH_API.logout(token).catch((err) => console.warn('auth: logout request failed:', err));
        }
        clearSession();
    };

    const setAvatarUrl = useCallback((url: string | null) => {
        setUser(prev => ({ ...prev, avatarUrl: url }));
    }, []);

    return (
        <AuthContext.Provider value={{ token, refreshToken, username, userId, avatarUrl, ready, login, logout, setAvatarUrl }}>
            {children}
        </AuthContext.Provider>
    );
}
