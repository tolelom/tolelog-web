import { ViteReactSSG } from 'vite-react-ssg';
import './index.css';
import { routes } from './App';
import { initErrorReporting } from './lib/errorReporting';

if (typeof window !== 'undefined') {
    initErrorReporting();
}

export const createRoot = ViteReactSSG({ routes });
