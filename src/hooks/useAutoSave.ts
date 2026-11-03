import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS, AUTO_SAVE_DELAY_MS } from '../utils/constants';
import { notify } from '../utils/notify';
import { captureException } from '../utils/errorReporting';
import { formatTimeAgo } from '../utils/format';
import type { PostFormData, DraftData } from '../types';

const SERVER_SAVE_DELAY_MS = 5000;

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface ServerSaveOptions {
    enabled: boolean;
    delay?: number;
    onSave: (data: PostFormData) => Promise<void>;
}

export interface UseAutoSaveReturn {
    saveStatus: SaveStatus;
    loadDraft: () => DraftData | null;
    clearDraft: () => void;
    hasDraft: () => boolean;
    getFormattedSaveTime: () => string;
}

function sameForm(a: PostFormData, b: PostFormData): boolean {
    return a.title === b.title && a.content === b.content && a.is_public === b.is_public && (a.tags || '') === (b.tags || '');
}

export function useAutoSave(
    formData: PostFormData,
    storageKey: string = STORAGE_KEYS.DRAFT,
    serverSave?: ServerSaveOptions,
    baseline?: PostFormData
): UseAutoSaveReturn {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const serverSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef<DraftData | null>(null);
    const hasNotifiedFailureRef = useRef(false);

    const saveDraft = useCallback((data: PostFormData) => {
        try {
            const draftData: DraftData = {
                title: data.title,
                content: data.content,
                is_public: data.is_public,
                tags: data.tags || '',
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            lastSavedRef.current = draftData;
            setSaveStatus('saved');
        } catch (error) {
            captureException(error, { source: 'useAutoSave.save' });
            setSaveStatus('error');
        }
    }, [storageKey]);

    // 불러온 내용 그대로면(고친 게 없으면) 임시저장하지 않는다.
    useEffect(() => {
        if (baseline && sameForm(formData, baseline)) return;
        setSaveStatus('saving');

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveDraft(formData);
        }, AUTO_SAVE_DELAY_MS);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [formData, saveDraft, baseline]);

    useEffect(() => {
        if (!serverSave?.enabled) return;

        if (serverSaveTimeoutRef.current) {
            clearTimeout(serverSaveTimeoutRef.current);
        }

        serverSaveTimeoutRef.current = setTimeout(async () => {
            try {
                await serverSave.onSave(formData);
                hasNotifiedFailureRef.current = false;
            } catch {
                if (!hasNotifiedFailureRef.current) {
                    notify.error('자동 저장 실패. 네트워크를 확인해주세요.');
                    hasNotifiedFailureRef.current = true;
                }
            }
        }, serverSave.delay ?? SERVER_SAVE_DELAY_MS);

        return () => {
            if (serverSaveTimeoutRef.current) {
                clearTimeout(serverSaveTimeoutRef.current);
            }
        };
    }, [formData, serverSave?.enabled, serverSave?.delay, serverSave?.onSave]);

    const loadDraft = useCallback((): DraftData | null => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                return JSON.parse(saved) as DraftData;
            }
            return null;
        } catch (error) {
            captureException(error, { source: 'useAutoSave.load' });
            return null;
        }
    }, [storageKey]);

    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            lastSavedRef.current = null;
            setSaveStatus('saved');
        } catch (error) {
            captureException(error, { source: 'useAutoSave.clear' });
        }
    }, [storageKey]);

    const hasDraft = useCallback((): boolean => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved !== null;
        } catch {
            return false;
        }
    }, [storageKey]);

    const getFormattedSaveTime = (): string => {
        const draft = loadDraft();
        return draft?.savedAt ? formatTimeAgo(draft.savedAt) : '';
    };

    return {
        saveStatus,
        loadDraft,
        clearDraft,
        hasDraft,
        getFormattedSaveTime,
    };
}
