import { test as base } from '@playwright/test';

const test = base.extend({
    // Extend test fixtures...
});

test.afterEach(async ({ testInfo }) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const tracePath = await testInfo.outputPath('trace.zip');
        await testInfo.attach('trace', {
            path: tracePath,
            contentType: 'application/zip',
        });
    }
});

export default test;
