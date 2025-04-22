// @ts-check
const { getAgentType, getCountryType, isPackage } = require('./config/test_config');
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const junitOptions = {
    embedAnnotationsAsProperties: true,
    outputFile: `./junit-report/${getAgentType()}-${getCountryType()}-xray-report.xml`,
};

module.exports = defineConfig({
    /* Maximum time one test can run for. */
    timeout: 300_000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 30_000,
    },
    testDir: isPackage() ? './tests/pk' : './tests/fo',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html'], ['junit', junitOptions]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    grep: new RegExp(`(?=.*@${getCountryType().toLowerCase()})(?=.*@${getAgentType().toLowerCase()})`),
    use: {
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-first-failure',
        actionTimeout: 30_000,
        launchOptions: {
            args: ['--ignore-certificate-errors'],
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], channel: 'chromium' },
        },
    ],
});
