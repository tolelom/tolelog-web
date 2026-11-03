import { useRef, type RefObject } from 'react';

// 이펙트가 값을 읽기만 하고, 값이 바뀌었다고 다시 실행되면 안 될 때 쓴다.
export function useLatestRef<T>(value: T): RefObject<T> {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}
