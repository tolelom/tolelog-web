import type { Block } from '../../types';

const FOOTNOTE_DEF_RE = /^\[\^([\w-]+)\]:\s+(.+)$/;
// 수평선은 같은 문자가 3개 이상이어야 한다 (CommonMark). `-*-` 같은 혼용은 문단이다.
const HR_RE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)]+)\)(\{width=([^}]+)\})?$/;
const TABLE_DELIMITER_RE = /^\|[\s:-]+\|/;
const CHECKLIST_RE = /^\s*[-*+]\s+\[[ xX]\]\s/;
const CHECKLIST_ITEM_RE = /^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/;
const UNORDERED_RE = /^\s*[-*+]\s+/;
const ORDERED_RE = /^\s*\d+\.\s+/;

const isMathFence = (line: string) => line.trim().startsWith('$$');
const isCodeFence = (line: string) => line.trimStart().startsWith('```');
const isQuoteLine = (line: string) => line.trimStart().startsWith('>');
const isBlank = (line: string) => line.trim() === '';

function isTableLine(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && trimmed.endsWith('|');
}

// 구분선(| --- |)이 뒤따르지 않는 | 줄은 문단이다.
function startsTable(lines: string[], index: number): boolean {
    return isTableLine(lines[index])
        && index + 1 < lines.length
        && isTableLine(lines[index + 1])
        && TABLE_DELIMITER_RE.test(lines[index + 1].trim());
}

// parseBlocks 의 블록 디스패치 조건과 정확히 같아야 한다.
// 어긋나면 문단 fallback 이 한 줄도 소비하지 못해 무한 루프가 된다.
function isBlockStart(lines: string[], index: number): boolean {
    const line = lines[index];
    return isBlank(line)
        || FOOTNOTE_DEF_RE.test(line)
        || isMathFence(line)
        || isCodeFence(line)
        || HR_RE.test(line)
        || HEADING_RE.test(line)
        || IMAGE_LINE_RE.test(line.trim())
        || startsTable(lines, index)
        || isQuoteLine(line)
        || CHECKLIST_RE.test(line)
        || UNORDERED_RE.test(line)
        || ORDERED_RE.test(line);
}

export function parseBlocks(text: string): Block[] {
    if (!text) return [];

    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const blocks: Block[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (isBlank(line)) {
            i++;
            continue;
        }

        const footnoteDefMatch = line.match(FOOTNOTE_DEF_RE);
        if (footnoteDefMatch) {
            const id = footnoteDefMatch[1];
            const fnText = footnoteDefMatch[2];
            blocks.push({
                type: 'footnote_def',
                id,
                text: fnText,
                raw: line,
            });
            i++;
            continue;
        }

        if (isMathFence(line)) {
            const isOneLine = line.trim().endsWith('$$') && line.trim().length > 4;
            if (isOneLine) {
                const expr = line.trim().slice(2, -2).trim();
                blocks.push({ type: 'math_block', expr, raw: line });
                i++;
                continue;
            }
            const mathLines: string[] = [];
            i++;
            while (i < lines.length && !isMathFence(lines[i])) {
                mathLines.push(lines[i]);
                i++;
            }
            const raw = '$$\n' + mathLines.join('\n') + '\n$$';
            blocks.push({ type: 'math_block', expr: mathLines.join('\n'), raw });
            i++;
            continue;
        }

        if (isCodeFence(line)) {
            const indent = line.length - line.trimStart().length;
            const langMatch = line.trimStart().slice(3).trim();
            const lang = langMatch || '';
            const codeLines: string[] = [];
            i++;
            while (i < lines.length) {
                if (isCodeFence(lines[i]) && (lines[i].trim().length - lines[i].trimStart().length <= indent || lines[i].trim() === '```')) {
                    break;
                }
                codeLines.push(lines[i]);
                i++;
            }
            const raw = '```' + langMatch + '\n' + codeLines.join('\n') + '\n```';
            blocks.push({ type: 'code', lang, code: codeLines.join('\n'), raw });
            i++;
            continue;
        }

        if (HR_RE.test(line)) {
            blocks.push({ type: 'hr', raw: line });
            i++;
            continue;
        }

        const headingMatch = line.match(HEADING_RE);
        if (headingMatch) {
            blocks.push({
                type: 'heading',
                level: headingMatch[1].length,
                text: headingMatch[2],
                raw: line,
            });
            i++;
            continue;
        }

        const imgMatch = line.trim().match(IMAGE_LINE_RE);
        if (imgMatch) {
            blocks.push({
                type: 'image',
                alt: imgMatch[1],
                src: imgMatch[2],
                width: imgMatch[4] || null,
                raw: line,
            });
            i++;
            continue;
        }

        if (startsTable(lines, i)) {
            const tableLines: string[] = [];
            while (i < lines.length && isTableLine(lines[i])) {
                tableLines.push(lines[i]);
                i++;
            }
            const headerCells = parseTableRow(tableLines[0]);
            const alignments = parseTableAlignments(tableLines[1]);
            const bodyRows = tableLines.slice(2).map(parseTableRow);
            blocks.push({
                type: 'table',
                headers: headerCells,
                alignments,
                rows: bodyRows,
                raw: tableLines.join('\n'),
            });
            continue;
        }

        if (isQuoteLine(line)) {
            const quoteLines: string[] = [];
            // > 없이 이어지는 줄도 빈 줄이나 제목이 나오기 전까지는 같은 인용문이다(lazy continuation).
            while (i < lines.length && (isQuoteLine(lines[i]) || (!isBlank(lines[i]) && quoteLines.length > 0 && !lines[i].trimStart().startsWith('#')))) {
                quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
                i++;
            }
            blocks.push({
                type: 'blockquote',
                text: quoteLines.join('\n'),
                raw: quoteLines.map(l => '> ' + l).join('\n'),
            });
            continue;
        }

        if (CHECKLIST_RE.test(line)) {
            const checkItems: { checked: boolean; text: string }[] = [];
            while (i < lines.length && CHECKLIST_RE.test(lines[i])) {
                const match = lines[i].match(CHECKLIST_ITEM_RE);
                if (match) {
                    checkItems.push({
                        checked: match[1].toLowerCase() === 'x',
                        text: match[2],
                    });
                }
                i++;
            }
            const raw = checkItems.map(item =>
                `- [${item.checked ? 'x' : ' '}] ${item.text}`
            ).join('\n');
            blocks.push({ type: 'checklist', items: checkItems, raw });
            continue;
        }

        if (UNORDERED_RE.test(line)) {
            const listResult = parseList(lines, i, 'unordered');
            blocks.push(listResult.block);
            i = listResult.nextIndex;
            continue;
        }

        if (ORDERED_RE.test(line)) {
            const listResult = parseList(lines, i, 'ordered');
            blocks.push(listResult.block);
            i = listResult.nextIndex;
            continue;
        }

        const paraLines: string[] = [];
        while (i < lines.length && !isBlockStart(lines, i)) {
            paraLines.push(lines[i]);
            i++;
        }
        if (paraLines.length === 0) {
            // isBlockStart 가 위 조건과 어긋났을 때 무한 루프 대신 이 줄을 문단으로 소비한다.
            paraLines.push(line);
            i++;
        }
        blocks.push({
            type: 'paragraph',
            text: paraLines.join('\n'),
            raw: paraLines.join('\n'),
        });
    }

    return blocks;
}

function parseTableRow(line: string): string[] {
    return line.trim().slice(1, -1).split('|').map(cell => cell.trim());
}

function parseTableAlignments(line: string): string[] {
    return line.trim().slice(1, -1).split('|').map(cell => {
        const trimmed = cell.trim();
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
        if (trimmed.endsWith(':')) return 'right';
        return 'left';
    });
}

interface ListParseResult {
    block: Block;
    nextIndex: number;
}

function parseList(lines: string[], startIndex: number, type: 'ordered' | 'unordered'): ListParseResult {
    const items: string[] = [];
    let i = startIndex;
    const pattern = type === 'ordered' ? ORDERED_RE : UNORDERED_RE;

    while (i < lines.length) {
        const line = lines[i];
        if (isBlank(line)) {
            // 빈 줄 하나를 사이에 둔 항목은 같은 리스트다.
            if (i + 1 < lines.length && pattern.test(lines[i + 1])) {
                i++;
                continue;
            }
            break;
        }
        if (pattern.test(line)) {
            const content = line.replace(pattern, '');
            items.push(content);
            i++;
        } else if (line.startsWith('  ') || line.startsWith('\t')) {
            if (items.length > 0) {
                items[items.length - 1] += '\n' + line.trim();
            }
            i++;
        } else {
            break;
        }
    }

    const raw = lines.slice(startIndex, i).join('\n');
    return {
        block: { type: type === 'ordered' ? 'ordered_list' : 'unordered_list', items, raw } as Block,
        nextIndex: i,
    };
}
