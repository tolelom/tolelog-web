interface DraftRestorePromptProps {
    isEditMode: boolean;
    savedAgo: string;
    onRestore: () => void;
    onDiscard: () => void;
}

export default function DraftRestorePrompt({ isEditMode, savedAgo, onRestore, onDiscard }: DraftRestorePromptProps) {
    return (
        <div className="restore-prompt" role="dialog" aria-modal="true" aria-label="임시 저장 복구" onKeyDown={(e) => { if (e.key === 'Escape') onDiscard(); }}>
            <div className="restore-content">
                <h3>{isEditMode ? '이전에 수정하던 내용이 있습니다' : '저장된 임시 글이 있습니다'}</h3>
                <p>마지막 저장: {savedAgo}</p>
                <div className="restore-actions">
                    <button className="btn-restore" onClick={onRestore}>
                        복구하기
                    </button>
                    <button className="btn-discard" onClick={onDiscard}>
                        버리기
                    </button>
                </div>
            </div>
        </div>
    );
}
