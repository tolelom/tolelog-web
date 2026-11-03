import { useEffect, useState } from 'react';
import { isKatexReady, subscribeKatexReady } from '../features/markdown';

// KaTeX 가 로드되면 값이 바뀐다. renderMarkdown 을 memo 하는 쪽은 이 값을 의존성에 넣는다.
export function useKatexReady(): number {
    const [version, setVersion] = useState<number>(isKatexReady() ? 1 : 0);

    useEffect(() => {
        if (isKatexReady()) return;
        return subscribeKatexReady(() => setVersion((v) => v + 1));
    }, []);

    return version;
}
