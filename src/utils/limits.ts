// tolelog-api 의 검증 한도다. api-contract/swagger.json 과 다르면 limits 테스트가 실패한다.
// 서버는 글자 수를 유니코드 코드 포인트로 센다(JS 의 length 는 UTF-16 단위라 이모지를 둘로 센다).
export const USERNAME_MIN = 4;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 6;
// bcrypt 가 72바이트까지만 받는다. 한글은 한 글자가 3바이트다.
export const PASSWORD_MAX_BYTES = 72;
export const POST_TITLE_MAX = 255;
export const POST_CONTENT_MAX = 500_000;
export const POST_TAGS_MAX = 500;
export const TAG_NAME_MAX = 50;
export const SEARCH_QUERY_MIN = 2;
export const SEARCH_QUERY_MAX = 100;
export const COMMENT_MAX = 2000;
export const SERIES_TITLE_MAX = 255;
export const SERIES_DESCRIPTION_MAX = 2000;

export function charCount(text: string): number {
    return [...text].length;
}

export function utf8ByteLength(text: string): number {
    return new TextEncoder().encode(text).length;
}
