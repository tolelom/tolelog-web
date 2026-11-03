import { charCount, POST_CONTENT_MAX, POST_TAGS_MAX, POST_TITLE_MAX, TAG_NAME_MAX } from '../../lib/api/limits';
import { splitTags } from './tags';

interface PostLimitsInput {
    title: string;
    content: string;
    tags: string;
}

export function postLimitError({ title, content, tags }: PostLimitsInput): string | null {
    if (charCount(title) > POST_TITLE_MAX) return `제목은 ${POST_TITLE_MAX}자 이하여야 합니다`;
    if (charCount(content) > POST_CONTENT_MAX) return `내용은 ${POST_CONTENT_MAX.toLocaleString('ko-KR')}자 이하여야 합니다`;
    if (charCount(tags) > POST_TAGS_MAX) return `태그는 모두 합쳐 ${POST_TAGS_MAX}자 이하여야 합니다`;
    const longTag = splitTags(tags).find(tag => charCount(tag) > TAG_NAME_MAX);
    if (longTag) return `태그는 ${TAG_NAME_MAX}자 이하여야 합니다: ${longTag}`;
    return null;
}
