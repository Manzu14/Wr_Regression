const { HomePage } = require('../../../pages/HomePage');
const { test } = require('../../fixures/test');
const { expect } = require('@playwright/test');
/** @type {HomePage} */
let homePage;
/**This Testcase is applicable only for third party agent BE sites **/
test.describe('Sample test to validate language switch option', { tag: ['@regression', '@be', '@vip', '@3rdparty', '@stable'] }, () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    });
    test(
        '[3PA]-Validate after successful login the default langauge displayed is NL',
        { annotation: { type: 'test_key', description: 'B2B-3296' } },
        async () => {
            await expect(homePage.getDefaultLanguageLocator()).toBeVisible();
            await expect(homePage.getDefaultLanguageLocator()).toHaveText('NL');
        },
    );
    test(
        '[3PA]-Validate User able to see the default language NL after navigating to packages',
        { annotation: { type: 'test_key', description: 'B2B-3297' } },
        async () => {
            await expect(homePage.getDefaultLanguageLocator()).toHaveText('NL');
        },
    );
    test('[3PA]-Validate User able to change the language to Frans and back to NL', { annotation: { type: 'test_key', description: 'B2B-3298' } }, async () => {
        await test.step('Validate User able to change the language to Frans and FR displayed on the screen', async () => {
            await homePage.headerComponent.languageSwitch('Frans');
            await expect(homePage.getDefaultLanguageLocator()).toHaveText('FR');
        });
        await test.step('Validate User able to change back to default language NL from FR', async () => {
            await homePage.headerComponent.languageSwitch('Néerlandais');
            await expect(homePage.getDefaultLanguageLocator()).toHaveText('NL');
        });
    });
});
