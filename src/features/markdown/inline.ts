import { escapeHtml } from './text';
import { renderKatex } from './katex';
import { resolveContentImageUrl } from '../../lib/assetUrl';

export function parseInlineWithRefs(text: string, refs: Set<string>): string {
    if (!text) return '';

    let result = '';
    let i = 0;

    while (i < text.length) {
        if (text[i] === '!' && text[i + 1] === '[') {
            const altEnd = text.indexOf(']', i + 2);
            if (altEnd !== -1 && text[altEnd + 1] === '(') {
                const urlEnd = text.indexOf(')', altEnd + 2);
                if (urlEnd !== -1) {
                    const alt = text.slice(i + 2, altEnd);
                    const url = text.slice(altEnd + 2, urlEnd);
                    let endIdx = urlEnd + 1;
                    let widthStyle = 'max-width: 100%; height: auto;';
                    const widthMatch = text.slice(urlEnd + 1).match(/^\{width=([^}]+)\}/);
                    if (widthMatch) {
                        widthStyle = `width: ${widthMatch[1]}; height: auto; max-width: 100%;`;
                        endIdx = urlEnd + 1 + widthMatch[0].length;
                    }
                    result += `<img src="${escapeHtml(resolveContentImageUrl(url))}" alt="${escapeHtml(alt)}" style="${widthStyle}" loading="lazy" />`;
                    i = endIdx;
                    continue;
                }
            }
        }

        if (text[i] === '[' && text[i + 1] === '^') {
            const end = text.indexOf(']', i + 2);
            if (end !== -1 && text[end + 1] !== ':') {
                const id = text.slice(i + 2, end);
                if (id && /^[\w-]+$/.test(id)) {
                    refs.add(id);
                    result += `<sup class="footnote-ref"><a href="#fn-${escapeHtml(id)}" id="fnref-${escapeHtml(id)}">${escapeHtml(id)}</a></sup>`;
                    i = end + 1;
                    continue;
                }
            }
        }

        if (text[i] === '[') {
            const labelEnd = text.indexOf(']', i + 1);
            if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
                const urlEnd = text.indexOf(')', labelEnd + 2);
                if (urlEnd !== -1) {
                    const label = text.slice(i + 1, labelEnd);
                    const url = text.slice(labelEnd + 2, urlEnd);
                    result += `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${parseInlineWithRefs(label, refs)}</a>`;
                    i = urlEnd + 1;
                    continue;
                }
            }
        }

        if (text[i] === '`') {
            const end = text.indexOf('`', i + 1);
            if (end !== -1) {
                const code = escapeHtml(text.slice(i + 1, end));
                result += `<code class="inline-code">${code}</code>`;
                i = end + 1;
                continue;
            }
        }

        if (text[i] === '$' && text[i + 1] !== '$') {
            const end = text.indexOf('$', i + 1);
            if (end !== -1 && end > i + 1) {
                const expr = text.slice(i + 1, end);
                result += renderKatex(expr, false);
                i = end + 1;
                continue;
            }
        }

        if (text[i] === '*' && text[i + 1] === '*') {
            const end = text.indexOf('**', i + 2);
            if (end !== -1) {
                const inner = parseInlineWithRefs(text.slice(i + 2, end), refs);
                result += `<strong>${inner}</strong>`;
                i = end + 2;
                continue;
            }
        }

        if (text[i] === '*' && text[i + 1] !== '*') {
            const end = text.indexOf('*', i + 1);
            if (end !== -1 && end > i + 1) {
                const inner = parseInlineWithRefs(text.slice(i + 1, end), refs);
                result += `<em>${inner}</em>`;
                i = end + 1;
                continue;
            }
        }

        if (text[i] === '~' && text[i + 1] === '~') {
            const end = text.indexOf('~~', i + 2);
            if (end !== -1) {
                const inner = parseInlineWithRefs(text.slice(i + 2, end), refs);
                result += `<del>${inner}</del>`;
                i = end + 2;
                continue;
            }
        }

        if (text[i] === '\n') {
            result += '<br>';
            i++;
            continue;
        }

        result += escapeHtml(text[i]);
        i++;
    }

    return result;
}

export function parseInline(text: string): string {
    return parseInlineWithRefs(text, new Set());
}
