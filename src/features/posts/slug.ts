// 백엔드 internal/permalink/slug.go 의 Slugify 와 같아야 한다. 어긋나면 sitemap(prerender) 주소와
// 화면이 만드는 주소가 달라 canonical 이 어긋난다.

const SLUG_MAX_RUNES = 60;

export function slugify(title: string): string {
    if (!title) return '';

    let out = '';
    let lastWasHyphen = false;

    for (const ch of title.trim()) {
        if (isLetterOrDigit(ch)) {
            out += ch.toLowerCase();
            lastWasHyphen = false;
        } else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '_' || ch === '-') {
            if (out.length > 0 && !lastWasHyphen) {
                out += '-';
                lastWasHyphen = true;
            }
        }
    }

    out = out.replace(/-+$/, '');

    // Go 의 rune 처럼 코드 포인트 단위로 자른다(한글·이모지가 반으로 잘리지 않게).
    const runes = Array.from(out);
    if (runes.length > SLUG_MAX_RUNES) {
        out = runes.slice(0, SLUG_MAX_RUNES).join('').replace(/-+$/, '');
    }
    return out;
}

export function postPath(post: { id: number; title: string }): string {
    const slug = slugify(post.title);
    if (!slug) return `/post/${post.id}`;
    return `/post/${slug}-${post.id}`;
}

// "123" 과 "hello-world-123" 을 모두 받는다. 제목이 바뀌어도 옛 주소가 열리도록 id 만 믿는다.
export function parsePostSlugId(slugAndId: string | undefined): { id: number; slug?: string } | null {
    if (!slugAndId) return null;
    const match = slugAndId.match(/^(?:(.+)-)?(\d+)$/);
    if (!match) return null;
    const id = parseInt(match[2], 10);
    if (Number.isNaN(id) || id <= 0) return null;
    return match[1] ? { id, slug: match[1] } : { id };
}

const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
function isLetterOrDigit(ch: string): boolean {
    return LETTER_OR_DIGIT.test(ch);
}
