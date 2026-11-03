import { useCallback, useMemo, useRef } from 'react';
import { POST_API } from '../lib/api';
import type { ServerSaveOptions } from './useAutoSave';
import type { PostFormData } from '../types';

const UNTITLED = '제목 없음';

// 새 글을 쓰는 동안 서버에 draft 를 자동저장한다. 발행할 때는 새 글을 만들지 않고 이 draft 를 발행해야
// 고아 draft 가 남지 않으므로, 발행 전에 beginPublish 로 draft id 를 받는다.
export function useServerDraft(token: string | null, enabled: boolean) {
    const draftIdRef = useRef<number | null>(null);
    const inFlightRef = useRef<Promise<void> | null>(null);
    const isPublishingRef = useRef(false);

    const saveDraft = useCallback(async (data: PostFormData) => {
        // 서버는 빈 본문을 거부하고, 발행 중에 draft 로 저장하면 발행한 글이 draft 로 되돌아간다.
        if (!token || !data.content.trim() || isPublishingRef.current) return;
        const title = data.title.trim() || UNTITLED;
        const save = (async () => {
            if (draftIdRef.current) {
                await POST_API.saveDraft(draftIdRef.current, title, data.content, data.tags || '', token);
            } else {
                const result = await POST_API.createDraft(title, data.content, data.tags || '', token);
                draftIdRef.current = result.data.id;
            }
        })();
        inFlightRef.current = save;
        try {
            await save;
        } finally {
            if (inFlightRef.current === save) inFlightRef.current = null;
        }
    }, [token]);

    const serverSaveOptions = useMemo<ServerSaveOptions>(() => ({
        enabled: enabled && !!token,
        onSave: saveDraft,
    }), [enabled, token, saveDraft]);

    // 진행 중인 자동저장이 draft 를 만들고 있으면 그 id 를 받을 때까지 기다린다.
    const beginPublish = useCallback(async (): Promise<number | null> => {
        isPublishingRef.current = true;
        await inFlightRef.current?.catch(() => {});
        return draftIdRef.current;
    }, []);

    const cancelPublish = useCallback(() => {
        isPublishingRef.current = false;
    }, []);

    return { serverSaveOptions, beginPublish, cancelPublish };
}
