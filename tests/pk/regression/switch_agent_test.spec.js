const { HomePage } = require('../../../pages/HomePage');
const { TestDataProvider } = require('../../../test-data/TestDataProvider');
const { test, expect } = require('../../fixures/test');

/** @type {HomePage} */
let homePage;
/**This testcase is applicable for only inhouse agent(BE,NL) sites**/
test.describe('Sample test to validate switch agent option', { tag: ['@regression', '@be', '@nl', '@inhouse', '@stable'] }, () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    });
    test(
        '1.Validate inhouse agent (118501) able to switch to (118570) 2. Agent switch from (6962) to (2855)',
        { annotation: { type: 'test_key', description: 'B2B-3316' } },
        async () => {
            const agentNumber = await new TestDataProvider().getSwitchAgentData();
            await homePage.headerComponent.agentSwitch(agentNumber);
            await expect(homePage.headerComponent.customerServiceCenterLink).toContainText(` | TUI Store (${agentNumber})`);
        },
    );
});
