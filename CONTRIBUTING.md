# 기여

```bash
npm run build             # 타입 검사, SSG 빌드
npm run build:csr         # 미리 렌더링 없는 빌드
npm run test              # Vitest 테스트
npm run test:coverage     # 커버리지 포함 테스트
npm run lint              # ESLint
npm run type-check        # TypeScript 타입 검사
```

폴더 구성과 지켜야 할 규칙은 `ARCHITECTURE.md`에 있습니다.

## API 계약

API 요청·응답 타입의 원본은 tolelog-api가 주석에서 생성하는 Swagger 2.0 문서(`docs/swagger.json`)입니다. 이 저장소는 사본을 `api-contract/swagger.json`에 두고, 거기서 `src/types/api.gen.ts`를 생성해 커밋합니다(swagger2openapi → openapi-typescript). `src/types/index.ts`의 API 타입은 생성된 타입의 별칭입니다.

```bash
npm run contract:sync     # tolelog-api의 Swagger를 가져와 사본과 타입을 다시 생성
npm run contract:types    # api-contract/swagger.json에서 src/types/api.gen.ts 생성
npm run contract:check    # 생성된 타입이 사본과 같은지 확인
```

- 백엔드 응답이 바뀌면 `npm run contract:sync`를 실행하고 바뀐 사본과 생성 파일을 함께 커밋합니다. 형제 디렉터리 `../tolelog-api`가 있으면 그 파일을, 없거나 `-- --remote`를 주면 GitHub main의 파일을 받습니다.
- `scripts/__tests__/contract-types.test.ts`는 생성 파일이 사본과 어긋나면 실패합니다. 네트워크는 쓰지 않습니다.
- 폼이 검사하는 입력 한도(`src/lib/api/limits.ts`)는 사본의 값과 같아야 하고, `src/lib/api/__tests__/limits.test.ts`가 확인합니다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy-frontend.yml`)가 lint, 타입 검사, 계약 검사, 테스트를 거쳐 SSG 빌드를 하고, nginx 이미지 `ghcr.io/tolelom/tolelog`를 linux/arm64로 `latest`, `main`, 커밋 SHA 태그로 올립니다. workflow는 이미지 push에서 끝나고, Renovate가 `server-config` 저장소의 이미지 digest를 올리면 git-sync가 서버에 반영합니다.

- 새 글이 미리 렌더링 결과에 들어가도록 매일 02:30 KST에 다시 빌드합니다. 즉시 다시 빌드하려면 workflow를 수동 실행하거나 `rebuild` 타입의 `repository_dispatch`를 보냅니다.
- CI 빌드는 secret `VITE_API_URL`을 씁니다.
- `VITE_SENTRY_DSN`을 주면 오류를 Sentry로 보냅니다.
