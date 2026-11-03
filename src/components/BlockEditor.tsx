import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { parseBlocks, renderBlock } from '../features/markdown';
import { validateImageFile, compressImage, uploadImageToServer } from '../features/images/imageUpload';
import { useCopyCodeBlock } from '../hooks/useCopyCodeBlock';
import DOMPurify from 'dompurify';
import { FORMAT_MARKS, SHORTCUT_FORMATS } from './editorFormats';
import ImageBlockEditor from './blockEditor/ImageBlockEditor';
import { parseImageLine, withImageWidth } from './blockEditor/imageMarkdown';
import './BlockEditor.css';

const BLOCK_SEPARATOR = '\n\n';
// 블록 안의 버튼(이미지 크기 등)을 누르는 동안 편집이 닫히지 않도록 비활성화를 조금 미룬다.
const DEACTIVATE_DELAY_MS = 100;

interface EditorBlock {
    id: string;
    raw: string;
}

type BlockElement = HTMLTextAreaElement | HTMLDivElement;

export interface BlockEditorHandle {
    wrapSelection: (before: string, after: string) => void;
    getActiveTextarea: () => BlockElement | null;
}

export type InsertImage = (src: string, fileName: string) => void;

interface BlockEditorProps {
    content: string;
    onChange: (raw: string) => void;
    onImageInsert?: React.MutableRefObject<InsertImage | null>;
    token?: string | null;
}

function newBlock(raw: string = ''): EditorBlock {
    return { id: crypto.randomUUID(), raw };
}

const BlockEditor = forwardRef<BlockEditorHandle, BlockEditorProps>(function BlockEditor({ content, onChange, onImageInsert, token }, ref) {
    const [blocks, setBlocks] = useState<EditorBlock[]>(() => initBlocks(content));
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');
    const blockElements = useRef<Record<number, BlockElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    // 블록들이 지금 나타내는 마크다운. 부모가 내려준 content 가 이것과 다를 때만 블록을 다시 만든다.
    const blocksContent = useRef<string>(content);
    const pendingCursorPos = useRef<number | null>(null);

    useEffect(() => {
        if (content === blocksContent.current) return;
        blocksContent.current = content;
        setBlocks(initBlocks(content));
    }, [content]);

    useEffect(() => {
        if (activeIndex === null) return;
        const el = blockElements.current[activeIndex];
        if (!el) return;
        el.focus();
        if (el instanceof HTMLTextAreaElement) {
            if (pendingCursorPos.current !== null) {
                el.selectionStart = pendingCursorPos.current;
                el.selectionEnd = pendingCursorPos.current;
                pendingCursorPos.current = null;
            }
            autoResize(el);
        }
    }, [activeIndex, blocks]);

    const emitChange = useCallback((newBlocks: EditorBlock[]) => {
        const raw = newBlocks.map(b => b.raw).join(BLOCK_SEPARATOR);
        blocksContent.current = raw;
        onChange(raw);
    }, [onChange]);

    const handleImageResize = useCallback((index: number, width: string | null) => {
        setBlocks(prev => {
            const resizedRaw = withImageWidth(prev[index].raw, width);
            if (resizedRaw === null) return prev;
            const newBlocks = [...prev];
            newBlocks[index] = { ...prev[index], raw: resizedRaw };
            emitChange(newBlocks);
            return newBlocks;
        });
    }, [emitChange]);

    const updateBlock = useCallback((index: number, newRaw: string) => {
        setBlocks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], raw: newRaw };
            emitChange(updated);
            return updated;
        });
    }, [emitChange]);

    const wrapSelection = useCallback((before: string, after: string) => {
        if (activeIndex === null) return;
        const ta = blockElements.current[activeIndex];
        if (!(ta instanceof HTMLTextAreaElement)) return;

        const { selectionStart: start, selectionEnd: end, value: text } = ta;
        updateBlock(activeIndex, text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end));

        // 값이 바뀐 textarea 가 다시 그려진 뒤에 선택 영역을 감싼 글자 안쪽으로 옮긴다.
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = start + before.length;
            ta.selectionEnd = end + before.length;
        });
    }, [activeIndex, updateBlock]);

    useImperativeHandle(ref, () => ({
        wrapSelection,
        getActiveTextarea: () => activeIndex !== null ? blockElements.current[activeIndex] ?? null : null,
    }), [wrapSelection, activeIndex]);

    // 비어 있는 마지막 블록이 있으면 그 블록을, 없으면 새 블록을 연다.
    const handleEmptyAreaClick = () => {
        setBlocks(prev => {
            const lastBlock = prev[prev.length - 1];
            if (lastBlock && lastBlock.raw.trim() === '') {
                setActiveIndex(prev.length - 1);
                return prev;
            }
            const newBlocks = [...prev, newBlock()];
            setActiveIndex(newBlocks.length - 1);
            emitChange(newBlocks);
            return newBlocks;
        });
    };

    const replaceBlocks = (makeNext: (prev: EditorBlock[]) => EditorBlock[], nextActive: number, cursorPos: number | null) => {
        setBlocks(prev => {
            const newBlocks = makeNext(prev);
            pendingCursorPos.current = cursorPos;
            setActiveIndex(nextActive);
            emitChange(newBlocks);
            return newBlocks;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
        const ta = e.currentTarget;
        const raw = blocks[index]?.raw || '';
        const isCodeBlock = raw.trimStart().startsWith('```');
        const cursorPos = ta.selectionStart;
        const cursorAtStart = ta.selectionStart === 0 && ta.selectionEnd === 0;

        const shortcut = (e.ctrlKey || e.metaKey) ? SHORTCUT_FORMATS[e.key.toLowerCase()] : undefined;
        if (shortcut) {
            e.preventDefault();
            wrapSelection(...FORMAT_MARKS[shortcut]);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey && isCodeBlock) {
            // 코드 블록은 Enter 가 줄바꿈이다. 끝에서 빈 줄에 한 번 더 누르면 그 빈 줄을 지우고 블록을 빠져나간다.
            const lines = raw.slice(0, cursorPos).split('\n');
            const onTrailingEmptyLine = cursorPos === raw.length && lines.length > 1 && lines[lines.length - 1].trim() === '';
            if (!onTrailingEmptyLine) return;
            e.preventDefault();
            const codeWithoutEmptyLine = lines.slice(0, -1).join('\n');
            replaceBlocks(prev => {
                const next = [...prev];
                next[index] = { ...next[index], raw: codeWithoutEmptyLine };
                next.splice(index + 1, 0, newBlock());
                return next;
            }, index + 1, 0);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            replaceBlocks(prev => {
                const next = [...prev];
                next[index] = { ...next[index], raw: raw.slice(0, cursorPos) };
                next.splice(index + 1, 0, newBlock(raw.slice(cursorPos)));
                return next;
            }, index + 1, 0);
            return;
        }

        if (e.key === 'Backspace' && raw === '' && index === 0 && blocks.length > 1) {
            e.preventDefault();
            replaceBlocks(prev => prev.slice(1), 0, null);
            return;
        }

        if (e.key === 'Backspace' && cursorAtStart && index > 0) {
            e.preventDefault();
            const prevLength = blocks[index - 1].raw.length;
            replaceBlocks(prev => {
                const next = [...prev];
                next[index - 1] = { ...prev[index - 1], raw: prev[index - 1].raw + prev[index].raw };
                next.splice(index, 1);
                return next;
            }, index - 1, prevLength);
            return;
        }

        if (e.key === 'ArrowUp' && ta.selectionStart === 0 && index > 0) {
            e.preventDefault();
            setActiveIndex(index - 1);
            return;
        }

        if (e.key === 'ArrowDown' && ta.selectionStart === ta.value.length && index < blocks.length - 1) {
            e.preventDefault();
            setActiveIndex(index + 1);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        updateBlock(index, e.target.value);
        autoResize(e.target);
    };

    const deactivateOnBlur = (e: React.FocusEvent, index: number) => {
        if (containerRef.current?.contains(e.relatedTarget as Node)) return;
        setTimeout(() => {
            setActiveIndex(prev => prev === index ? null : prev);
        }, DEACTIVATE_DELAY_MS);
    };

    const insertImage = useCallback<InsertImage>((src, fileName) => {
        setBlocks(prev => {
            const insertAt = activeIndex !== null ? activeIndex + 1 : prev.length;
            const newBlocks = [...prev];
            newBlocks.splice(insertAt, 0, newBlock(`![${fileName}](${src})`));
            setActiveIndex(null);
            emitChange(newBlocks);
            return newBlocks;
        });
    }, [activeIndex, emitChange]);

    useEffect(() => {
        if (onImageInsert) {
            onImageInsert.current = insertImage;
        }
    }, [insertImage, onImageInsert]);

    useCopyCodeBlock(containerRef);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        // 자식 요소로 옮겨 갈 때도 dragleave 가 오므로, 편집기 밖으로 나갈 때만 끈다.
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    };
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));

        for (const file of files) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                setUploadError(validation.error || '유효하지 않은 이미지입니다.');
                continue;
            }
            try {
                setUploadError('');
                const compressed = await compressImage(file);
                if (token) {
                    insertImage(await uploadImageToServer(compressed, token), file.name);
                } else {
                    const reader = new FileReader();
                    reader.onload = () => insertImage(reader.result as string, file.name);
                    reader.readAsDataURL(compressed);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '이미지 업로드 실패';
                setUploadError('이미지 업로드 실패: ' + message);
            }
        }
    };

    return (
        <div
            className={`block-editor ${isDragOver ? 'drag-over' : ''}`}
            ref={containerRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {uploadError && (
                <div className="block-upload-error" role="alert">
                    {uploadError}
                    <button className="block-upload-error-close" onClick={() => setUploadError('')} aria-label="오류 닫기">×</button>
                </div>
            )}
            {blocks.map((block, index) => {
                const isActive = activeIndex === index;
                const activeImage = isActive ? parseImageLine(block.raw) : null;
                const setElement = (el: BlockElement | null) => { blockElements.current[index] = el; };
                return (
                    <div key={block.id} className={`block-wrapper ${isActive ? 'active' : ''}`}>
                        {activeImage ? (
                            <ImageBlockEditor
                                image={activeImage}
                                focusRef={setElement}
                                onResize={(width) => handleImageResize(index, width)}
                                onBlur={(e) => deactivateOnBlur(e, index)}
                            />
                        ) : isActive ? (
                            <textarea
                                ref={setElement}
                                className="block-textarea"
                                value={block.raw}
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onBlur={(e) => deactivateOnBlur(e, index)}
                                placeholder="내용을 입력하세요..."
                                rows={1}
                            />
                        ) : (
                            <div
                                className="block-rendered md-body"
                                onClick={() => setActiveIndex(index)}
                                dangerouslySetInnerHTML={{ __html: renderBlockHtml(block.raw) }}
                            />
                        )}
                    </div>
                );
            })}
            <div className="block-empty-area" onClick={handleEmptyAreaClick}>
                {blocks.length === 0 && (
                    <span className="block-placeholder">여기를 클릭하여 글을 작성하세요...</span>
                )}
            </div>
        </div>
    );
});

export default BlockEditor;

function initBlocks(content: string): EditorBlock[] {
    const parsed = content.trim() ? parseBlocks(content) : [];
    return parsed.length > 0 ? parsed.map(b => newBlock(b.raw)) : [newBlock()];
}

// renderBlock 은 renderMarkdown 과 달리 소독하지 않으므로 여기서 DOMPurify 를 거친다.
function renderBlockHtml(raw: string): string {
    if (raw.trim() === '') {
        return '<p class="block-empty-text">&nbsp;</p>';
    }
    return DOMPurify.sanitize(parseBlocks(raw).map(renderBlock).join('\n'));
}

function autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
