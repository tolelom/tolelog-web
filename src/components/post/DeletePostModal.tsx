import { useEffect, useRef } from 'react';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

interface DeletePostModalProps {
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeletePostModal({ isDeleting, onConfirm, onCancel }: DeletePostModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useModalKeyboard(modalRef, onCancel, 'button:not(:disabled)');

    useEffect(() => {
        // 실수로 지우지 않도록 첫 포커스는 취소 버튼에 둔다. 모달이 그려진 다음 프레임에 옮긴다.
        requestAnimationFrame(() => {
            modalRef.current?.querySelector<HTMLElement>('.btn-delete-cancel')?.focus();
        });
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div className="delete-modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-label="글 삭제 확인">
            <div className="delete-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <p className="delete-modal-text">이 글을 삭제하시겠습니까?</p>
                <p className="delete-modal-sub">삭제된 글은 복구할 수 없습니다.</p>
                <div className="delete-modal-actions">
                    <button className="btn-delete-cancel" onClick={onCancel} disabled={isDeleting}>취소</button>
                    <button className="btn-delete-confirm" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? '삭제 중...' : '삭제'}</button>
                </div>
            </div>
        </div>
    );
}
