// 쉼표로 이은 태그 문자열을 나눈다. 앞뒤 공백을 지우고 빈 항목만 버린다(순서·중복은 그대로).
export function splitTags(tags: string): string[] {
    return tags.split(',').map(t => t.trim()).filter(Boolean);
}
