import { test as base } from '@playwright/test';

export const test = base.extend({
    // Define any additional fixtures if necessary
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
        // Attach trace
        const tracePath = await testInfo.outputPath('trace.zip');
        await testInfo.attach('trace', {
            path: tracePath,
            contentType: 'application/zip',
        });

        // Attach screenshots and videos if available
        // The code below assumes that attachments are automatically saved by Playwright
        // on test failure, as configured in your playwright.config.ts
        for (const attachment of testInfo.attachments) {
            if (attachment.name === 'screenshot' || attachment.name === 'video') {
                await testInfo.attach(attachment.name, {
                    path: attachment.path,
                    contentType: attachment.contentType,
                });
            }
        }
    }
});

// Make sure to re-export the test object
export default test;
