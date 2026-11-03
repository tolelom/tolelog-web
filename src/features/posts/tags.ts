// 빈 항목만 버리고 순서·중복은 그대로 둔다(서버에 저장된 그대로 보여 준다).
export function splitTags(tags: string): string[] {
    return tags.split(',').map(t => t.trim()).filter(Boolean);
}
