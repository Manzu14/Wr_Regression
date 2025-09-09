const { getUrl, getMarketType } = require('../config/test_config');
const { test: exportedTest, expect: exportedExpect } = require('@playwright/test');

exports.expect = exportedExpect;
exports.test = exportedTest.extend({
    page: async function ({ browser }, use) {
        const basePage = await getBasePage(browser);
        await use(basePage);
        // await basePage.close();
        // return basePage;
    },
});

// eslint-disable-next-line no-empty-pattern
exports.test.beforeEach(async ({}, testInfo) => {
    const marketType = getMarketType();
    if (hasSkipTag(testInfo.tags))
        exportedTest.skip(testInfo.tags.includes(`@skip_${marketType}`), `this test cannot be executed with market: "${marketType}"`);
});

function hasSkipTag(strings) {
    const pattern = /^@skip_.*$/;
    return strings.some(str => pattern.test(str));
}

/**
 * @param {import('@playwright/test').Browser} browser
 * @returns {Promise<import('@playwright/test').Page>} Page instance enriched with base url navigation and required cookies
 */
async function getBasePage(browser) {
    const context = await browser.newContext();
    const basePage = await context.newPage();
    const url = getUrl();
    await disableCookiesMsg(context, url);
    await basePage.goto(url);
    return basePage;
}

/**
 *
 * @param {import('@playwright/test').BrowserContext} context
 * @param {string} url
 * @returns {Promise<void>}
 */
async function disableCookiesMsg(context, url) {
    const domain = new URL(url).hostname;
    await context.addCookies([
        {
            name: 'CONSENTMGR',
            value: Date.now() + '%7Cconsent:true',
            path: '/',
            expires: -1,
            domain,
        },
    ]);
}
