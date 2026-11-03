import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { generateTypes, SPEC_PATH, TYPES_PATH } from './contract-types.mjs';

const LOCAL_SPEC = fileURLToPath(new URL('../../tolelog-api/docs/swagger.json', import.meta.url));
const REMOTE_SPEC = 'https://raw.githubusercontent.com/tolelom/tolelog-api/main/docs/swagger.json';

async function fetchSpec(remote) {
    if (!remote) {
        const local = await readFile(LOCAL_SPEC, 'utf8').catch(() => null);
        if (local !== null) return { text: local, from: LOCAL_SPEC };
    }
    const response = await fetch(REMOTE_SPEC);
    if (!response.ok) throw new Error(`${REMOTE_SPEC} 다운로드 실패 (${response.status})`);
    return { text: await response.text(), from: REMOTE_SPEC };
}

const { text, from } = await fetchSpec(process.argv.includes('--remote'));
const spec = JSON.parse(text);
await writeFile(SPEC_PATH, text);
await writeFile(TYPES_PATH, await generateTypes(spec));
console.log(`API 계약을 ${from} 에서 가져와 src/types/api.gen.ts 를 다시 만들었습니다.`);
