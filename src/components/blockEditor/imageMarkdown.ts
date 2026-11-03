const IMAGE_LINE_RE = /^(!\[([^\]]*)\]\(([^)]+)\))(?:\{width=([^}]+)\})?$/;

export interface ImageLine {
    alt: string;
    src: string;
    width: string | null;
}

export function parseImageLine(raw: string): ImageLine | null {
    const match = raw.trim().match(IMAGE_LINE_RE);
    return match ? { alt: match[2], src: match[3], width: match[4] || null } : null;
}

// 너비가 null 이면 {width=…} 를 떼어 원본 크기로 되돌린다. 이미지 줄이 아니면 null.
export function withImageWidth(raw: string, width: string | null): string | null {
    const match = raw.match(IMAGE_LINE_RE);
    if (!match) return null;
    return width ? `${match[1]}{width=${width}}` : match[1];
}
