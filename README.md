# Tolelog Web

> 개인 블로그 플랫폼의 웹 프론트엔드

React 19 · TypeScript · Vite 8 · vite-react-ssg · 서비스 https://blog.tolelom.xyz

API 서버는 [tolelog-api](https://github.com/tolelom/tolelog-api)입니다.

## 기능

- 블록 기반 마크다운 에디터: 편집 중인 블록만 원문, 나머지는 렌더링 결과로 표시. 자동 저장, 임시저장 목록, 미리보기
- 마크다운 표, 각주, 코드 하이라이트, 수식
- 브라우저에서 줄이고 압축한 뒤 올리는 이미지 업로드
- 글 상세의 목차, 시리즈 이전/다음 이동
- 댓글, 좋아요, 태그 자동완성과 태그 필터, 검색
- 사용자 프로필, 아바타, 비밀번호 변경, 계정 삭제
- 다크/라이트 테마
- 미리 렌더링한 공개 페이지와 페이지별 메타 태그(SEO)

## 시작하기

Node.js 22와 로컬 tolelog-api가 필요합니다.

```bash
git clone https://github.com/tolelom/tolelog-web.git
cd tolelog-web
npm install
cp .env.example .env
npm run dev
```

| 접속 | 주소 |
|---|---|
| 개발 서버 | http://localhost:5173 |

`.env.example`과 개발 서버 프록시는 API를 http://localhost:3000으로 봅니다. tolelog-api를 `PORT=3000`으로 띄우거나 `VITE_API_URL`을 바꿉니다.

## 문서

| 문서 | 내용 |
|---|---|
| `ARCHITECTURE.md` | 시스템 구성, 미리 렌더링, 폴더 구성과 지켜야 할 규칙 |
| `api-contract/swagger.json` | tolelog-api Swagger 사본(API 계약) |

## 기여

개발 명령, API 계약 동기화 절차, 배포 흐름은 `CONTRIBUTING.md`에 있습니다.
