// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateTypes, readSpec, TYPES_PATH } from '../contract-types.mjs';

describe('API contract types', () => {
    it('src/types/api.gen.ts is generated from the vendored api-contract/swagger.json', async () => {
        const generated = await generateTypes(await readSpec());
        expect(readFileSync(TYPES_PATH, 'utf8') === generated, 'npm run contract:types 로 다시 생성하세요').toBe(true);
    }, 30_000);
});
