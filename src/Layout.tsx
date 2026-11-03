import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './context/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import './App.css';

// SSG 빌드는 페이지마다 이 트리를 다시 렌더하므로 렌더 중에 부수 효과를 두지 않는다.
export default function Layout() {
    return (
        <HelmetProvider>
            <ErrorBoundary>
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <Navbar />
                            <Suspense fallback={<div className="page-loading"><div className="spinner" /><p>로딩 중...</p></div>}>
                                <Outlet />
                            </Suspense>
                            <ScrollRestoration />
                        </AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </HelmetProvider>
    );
}
