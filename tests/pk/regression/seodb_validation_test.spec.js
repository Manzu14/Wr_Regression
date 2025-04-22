const { HomePage } = require('../../../pages/HomePage');
const { PreviousReconcillationPage } = require('../../../pages/package/PreviousReconcillationPage');
const { SingleDayBankingPage } = require('../../../pages/package/SingleDayBankingPage');
const { TestDataProvider } = require('../../../test-data/TestDataProvider');
const { test, expect } = require('../../fixures/test');

let homePage, singleDayBankingPage, previousReconcillationPage;
/**This testcase is applicable for only inhouse agent(BE) sites**/
test.describe('Sample tests to validate seodb functionality in singledaybanking Page', { tag: ['@regression', '@be', '@inhouse', '@stable'] }, () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        singleDayBankingPage = new SingleDayBankingPage(page);
        previousReconcillationPage = new PreviousReconcillationPage(page);
    });
    test.skip('[B2B][PKG][Inhouse]: Verify login agent details on SEODB page', { annotation: { type: 'test_key', description: 'B2B-3308' } }, async () => {
        await homePage.headerComponent.adminMenuIndicator.first().click();
        await homePage.headerComponent.adminSubMenuLink.first().click();
        await singleDayBankingPage.closeWrningPopupIfDisplayed();
        const userId = await new TestDataProvider().getUserIdDetails();
        const customerServiceId = await new TestDataProvider().getCustomerServiceCenterId();
        await expect(singleDayBankingPage.seodbPageHeaderText).toBeVisible({ timeout: 40_000 });
        await expect(singleDayBankingPage.agentDetails.first()).toHaveText(userId);
        await expect(singleDayBankingPage.agentDetails.nth(1)).toHaveText(customerServiceId);
    });
    test.skip('[B2B][PKG][Inhouse]:Verify Expenses chevron and Expenses details', { annotation: { type: 'test_key', description: 'B2B-3309' } }, async () => {
        await homePage.headerComponent.adminMenuIndicator.first().click();
        await homePage.headerComponent.adminSubMenuLink.first().click();
        await singleDayBankingPage.closeWrningPopupIfDisplayed();
        await expect(singleDayBankingPage.expensesText).toHaveText('Expenses');
        await singleDayBankingPage.expandToggelButton.last().click();
        await expect(singleDayBankingPage.paymentTypeTableDetails.last()).toBeVisible();
    });
    test.skip('[B2B][PKG][Inhouse]:Verify Previous reconciliation navigation', { annotation: { type: 'test_key', description: 'B2B-3310' } }, async () => {
        await homePage.headerComponent.adminMenuIndicator.first().click();
        await homePage.headerComponent.adminSubMenuLink.first().click();
        await singleDayBankingPage.closeWrningPopupIfDisplayed();
        await singleDayBankingPage.previousProcessing.click();
        await expect(previousReconcillationPage.previousProcessingComp).toBeVisible();
        await previousReconcillationPage.clickBackToPaymentProcessing();
        await expect(singleDayBankingPage.seodbPageHeaderText).toBeVisible();
    });
    test.skip(
        '[PKG][Inhouse]:Verify error message is displayed in Previous reconciliation page if user clicks on search without choosing the calendar date',
        { annotation: { type: 'test_key', description: 'B2B-3310' } },
        async () => {
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await singleDayBankingPage.previousProcessing.click();
            await expect(previousReconcillationPage.previousProcessingComp).toBeVisible();
            await previousReconcillationPage.SearchButton.click();
            await expect(previousReconcillationPage.alert).toBeVisible();
            await expect(previousReconcillationPage.alertText).toHaveText('Kies een datum. Selecteer een datum in de kalender.');
        },
    );
    test.skip(
        '[B2B][PKG][Inhouse]-Verify Previous reconciliation search',
        {
            annotation: {
                type: 'test_key',
                description: 'B2B-3310',
            },
        },
        async () => {
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await singleDayBankingPage.previousProcessing.click();
            await expect(previousReconcillationPage.previousProcessingComp).toBeVisible();
            await previousReconcillationPage.fromDateInputField.click();
            await previousReconcillationPage.selectActiveDateInCalender('januari 2024');
            await previousReconcillationPage.toDateInputField.click();
            await previousReconcillationPage.selectActiveDateInCalender('december 2024');
            await previousReconcillationPage.SearchButton.click();
            await expect(previousReconcillationPage.reconcilePaymentTable.first()).toBeVisible({ timeout: 40000 });
        },
    );
    test.skip(
        '[B2B][PKG][Inhouse]: Verify cash payment chevron and cash payment details',
        { annotation: { type: 'test_key', description: 'B2B-3311' } },
        async () => {
            const agentNumber = await new TestDataProvider().getSeodbSwitchAgentData();
            await homePage.headerComponent.agentSwitch(agentNumber);
            await expect(homePage.headerComponent.customerServiceCenterLink).toBeVisible({ timeout: 40_000 });
            await expect(homePage.headerComponent.customerServiceCenterLink).toContainText(` | TUI Store (${agentNumber})`);
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await expect(singleDayBankingPage.cashText).toHaveText('cash', { ignoreCase: true });
            await singleDayBankingPage.expandToggelButton.first().click();
            await expect(singleDayBankingPage.paymentTypeTableDetails.first()).toBeVisible();
        },
    );
    test.skip(
        '[PKG]: Verify Select a reason dropdown validation on click of confirm.',
        { annotation: { type: 'test_key', description: 'B2B-3312' } },
        async () => {
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await singleDayBankingPage.validateDifferenceInValue();
            await expect(singleDayBankingPage.selectReasonError).toHaveText('Selecteer een reden');
        },
    );
    test.skip(
        '[B2B][PKG][Inhouse]:Verify Voucher chevron voucher payments details',
        { annotation: { type: 'test_key', description: 'B2B-3313' } },
        async () => {
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await expect(singleDayBankingPage.voucherText).toHaveText('voucher', { ignoreCase: true });
            await singleDayBankingPage.voucherRowExpand.click();
            await expect(singleDayBankingPage.voucherTableDetails).toBeVisible();
        },
    );
    test.skip(
        '[B2B][PKG][Inhouse]:Verify integrated card chevron and  integrated card payment details',
        { annotation: { type: 'test_key', description: 'B2B-3314' } },
        async () => {
            const agentNumber = await new TestDataProvider().getSeodbSwitchAgentData();
            await homePage.headerComponent.agentSwitch(agentNumber);
            await homePage.headerComponent.adminMenuIndicator.first().click();
            await homePage.headerComponent.adminSubMenuLink.first().click();
            await singleDayBankingPage.closeWrningPopupIfDisplayed();
            await expect(singleDayBankingPage.integratedCardText).toHaveText('integrated card', { ignoreCase: true });
            await singleDayBankingPage.integratedCardRowExpand.click();
            await expect(singleDayBankingPage.integratedCardTableDetails).toBeVisible();
        },
    );
});
