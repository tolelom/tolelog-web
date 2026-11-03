import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';
import swagger2openapi from 'swagger2openapi';

const root = fileURLToPath(new URL('..', import.meta.url));
export const SPEC_PATH = `${root}api-contract/swagger.json`;
export const TYPES_PATH = `${root}src/types/api.gen.ts`;

const HEADER = `// 생성된 파일이다. 손으로 고치지 말고 npm run contract:types 로 다시 만든다.
// 원본: api-contract/swagger.json (tolelog-api 의 docs/swagger.json)

`;

export async function generateTypes(swagger) {
    // swagger2openapi 가 x-nullable 을 OpenAPI 3 의 nullable 로 바꿔 준다.
    const { openapi } = await swagger2openapi.convertObj(swagger, { patch: true, warnOnly: true });
    const ast = await openapiTS(openapi, { alphabetize: true });
    return HEADER + astToString(ast);
}

export async function readSpec() {
    return JSON.parse(await readFile(SPEC_PATH, 'utf8'));
}

async function main() {
    const generated = await generateTypes(await readSpec());
    if (process.argv.includes('--check')) {
        const committed = await readFile(TYPES_PATH, 'utf8').catch(() => '');
        if (committed !== generated) {
            console.error('src/types/api.gen.ts 가 api-contract/swagger.json 과 다릅니다. npm run contract:types 를 실행하세요.');
            process.exit(1);
        }
        return;
    }
    await writeFile(TYPES_PATH, generated);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await main();
}
