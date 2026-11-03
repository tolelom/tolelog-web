const DESCRIPTION_MAX_LENGTH = 160;

// 메타 description 용으로 본문에서 마크다운 기호를 걷어 낸 앞부분.
export function plainTextExcerpt(content: string, maxLength: number = DESCRIPTION_MAX_LENGTH): string {
    return content
        .replace(/!\[.*?\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/[*_~`>]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

// og:image 는 크롤러가 받아 갈 수 있는 절대 주소여야 하므로 http(s) 이미지만 쓴다.
export function firstHttpImage(content: string): string | null {
    const match = content.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
    return match ? match[1] : null;
}
