import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastProvider';
import { makeAuthValue } from './fixtures';

export interface RenderOptionsEx extends Omit<RenderOptions, 'wrapper'> {
    authValue?: Partial<AuthContextType>;
    route?: string;
    path?: string;
}

export function renderWithProviders(ui: ReactElement, options: RenderOptionsEx = {}) {
    const { authValue, route = '/', path, ...rest } = options;

    const wrapped = path
        ? <Routes><Route path={path} element={ui} /></Routes>
        : ui;

    const tree = (auth: Partial<AuthContextType> | undefined) => (
        <MemoryRouter initialEntries={[route]}>
            <AuthContext.Provider value={makeAuthValue(auth)}>
                <ToastProvider>{wrapped}</ToastProvider>
            </AuthContext.Provider>
        </MemoryRouter>
    );

    const result = render(tree(authValue), rest);
    return {
        ...result,
        // 같은 화면을 유지한 채 로그인 상태만 바꾼다(토큰 갱신, 다른 탭의 로그아웃 등).
        rerenderAuth: (next: Partial<AuthContextType>) => result.rerender(tree(next)),
    };
}
