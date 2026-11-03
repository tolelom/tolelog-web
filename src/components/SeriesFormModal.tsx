import { useState, useEffect, useRef } from 'react';
import type { Series } from '../types';
import { useReturnFocus } from '../hooks/useReturnFocus';
import { useModalKeyboard } from '../hooks/useModalKeyboard';
import { SERIES_DESCRIPTION_MAX, SERIES_TITLE_MAX } from '../lib/api/limits';
import './SeriesFormModal.css';

interface SeriesFormModalProps {
    series?: Series | null;
    onSubmit: (title: string, description: string) => Promise<void>;
    onClose: () => void;
}

export default function SeriesFormModal({ series, onSubmit, onClose }: SeriesFormModalProps) {
    const isEdit = !!series;
    const [title, setTitle] = useState(series?.title || '');
    const [description, setDescription] = useState(series?.description || '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // 제목 칸에 포커스를 주기 전에 불러야 여는 버튼을 기억한다.
    useReturnFocus(true);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    useModalKeyboard(modalRef, onClose, 'input:not(:disabled), textarea:not(:disabled), button:not(:disabled)');

    const handleSubmit = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError('시리즈 제목을 입력해주세요.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit(trimmedTitle, description.trim());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="series-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={isEdit ? '시리즈 수정' : '새 시리즈 만들기'}>
            <div className="series-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <h3 className="series-modal-title">
                    {isEdit ? '시리즈 수정' : '새 시리즈 만들기'}
                </h3>

                <div className="series-modal-field">
                    <label className="series-modal-label" htmlFor="series-title">제목</label>
                    <input
                        ref={titleRef}
                        id="series-title"
                        type="text"
                        className="series-modal-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="시리즈 제목"
                        maxLength={SERIES_TITLE_MAX}
                        disabled={isSubmitting}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    />
                </div>

                <div className="series-modal-field">
                    <label className="series-modal-label" htmlFor="series-description">설명</label>
                    <textarea
                        id="series-description"
                        className="series-modal-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="시리즈에 대한 간단한 설명 (선택)"
                        maxLength={SERIES_DESCRIPTION_MAX}
                        rows={3}
                        disabled={isSubmitting}
                    />
                </div>

                {error && <p className="series-modal-error">{error}</p>}

                <div className="series-modal-actions">
                    <button
                        className="series-modal-btn-cancel"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        className="series-modal-btn-submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title.trim()}
                    >
                        {isSubmitting ? '저장 중...' : (isEdit ? '수정' : '만들기')}
                    </button>
                </div>
            </div>
        </div>
    );
}
