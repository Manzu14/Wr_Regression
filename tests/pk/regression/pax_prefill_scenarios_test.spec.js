import { test } from '../../fixures/test';
import { expect } from '@playwright/test';
import { PaxPrefillPage } from '../../../pages/package/PaxPrefillPage';
import { LoginPage } from '../../../pages/LoginPage';
const { HomePage } = require('../../../pages/HomePage');
const { TestDataProvider } = require('../../../test-data/TestDataProvider');
let paxPrefill, companionDataMyTui;

test.describe('Pax prefill automated scenarios', { tag: ['@regression', '@be', '@nl', '@vip', '@inhouse', '@stable'] }, () => {
    test.beforeEach(async ({ page }) => {
        paxPrefill = new PaxPrefillPage(page);
    });
    test(
        'Verify lead passenger is preselected and passenger info is displayed as per template',
        { annotation: { type: 'test_key', description: 'B2B-428' } },
        async () => {
            await paxPrefill.provideCustomerEmail();
            await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
            await expect(paxPrefill.checkboxMainTraveler).toBeChecked();
            await expect(paxPrefill.leadPassengerName).not.toBeEmpty();
            await expect(paxPrefill.leadPassengerDOB).not.toBeEmpty();
            await expect(paxPrefill.leadPassengerGender).toHaveText(/Man|Vrouw/);
            const totalCompanions = await paxPrefill.travelerCompanionTotal.count();
            for (let i = 0; i < totalCompanions; i++) {
                companionDataMyTui = await paxPrefill.getCompanionInfoMyTUI(i + 1);
                expect(companionDataMyTui.firstNameCompanion).not.toEqual('');
                expect(companionDataMyTui.lastNameCompanion).not.toEqual('');
                expect(companionDataMyTui.genderCompanion).not.toEqual('');
                expect(companionDataMyTui.dayCompanionDOB).not.toEqual('');
                expect(companionDataMyTui.monthCompanionDOB).not.toEqual('');
                expect(companionDataMyTui.yearCompanionDOB).not.toEqual('');
            }
        },
    );
    test('Verify correct behavior of show more CTA in lead passenger card', { annotation: { type: 'test_key', description: 'B2B-433' } }, async () => {
        await paxPrefill.provideCustomerEmail();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await paxPrefill.showMoreLink.click();
        await expect(paxPrefill.addressDetails).toBeVisible();
        await paxPrefill.showMoreLink.click();
        await expect(paxPrefill.addressDetails).toBeHidden();
    });
    test('Verify customer email field is disabled after valid submission', { annotation: { type: 'test_key', description: 'B2B-426' } }, async () => {
        await paxPrefill.provideCustomerEmail();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await expect(paxPrefill.inputEmail).toBeDisabled();
    });
    test('Verify correct displaying and behavior of the total passenger count', { annotation: { type: 'test_key', description: 'B2B-437' } }, async () => {
        await paxPrefill.provideCustomerEmail();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await expect(paxPrefill.totalCount).toContainText('Totale reisgezelschap: 1');
        const totalCompanions = await paxPrefill.travelerCompanionTotal.count();
        await paxPrefill.selectAllAvailableCompanionsAndCheckTotal(totalCompanions);
        for (let i = 0; i < totalCompanions; i++) {
            const checkTraveler = await paxPrefill.getAllTravelersCheckboxes(i + 1);
            await checkTraveler.click();
            await expect(paxPrefill.totalCount).toContainText(`Totale reisgezelschap: ${totalCompanions - i}`);
        }
    });

    test(
        'Verify correct error messages are displayed after entering an invalid customer email',
        { annotation: { type: 'test_key', description: 'B2B-427' } },
        async () => {
            const invalidFormatEmail = 'test';
            const expectedErrorInvalidFormat = 'Ongeldige e-mail format. Voer een geldig e-mailadres in (bijvoorbeeld gebruiker@voorbeeld.com)';
            await paxPrefill.validateCustomerInvalidEmail(invalidFormatEmail);
            await expect(paxPrefill.errorMessageText).toHaveText(expectedErrorInvalidFormat);
            await paxPrefill.closeButton.click();

            const expectedErrorBlankEmail = 'E-mailadres mag niet leeg zijn. Gelieve een geldig e-mailadres in te geven.';
            await paxPrefill.validateCustomerInvalidEmail('');
            await expect(paxPrefill.errorMessageText).toHaveText(expectedErrorBlankEmail);
            await paxPrefill.closeButton.click();

            const noActiveAccount = 'testing.pat@perf.test.uk';
            const notActiveError = 'Het account dat aan dit e-mailadres is gekoppeld, is nog niet geactiveerd.';
            await paxPrefill.validateCustomerInvalidEmail(noActiveAccount);
            await expect(paxPrefill.errorMessageText).toHaveText(notActiveError);
            await paxPrefill.closeButton.click();

            const noExistingAccount = 'rekhass@gtu.be';
            const nonExistingAccountError = 'Er is geen account gekoppeld aan dit adres. Controleer of de gegevens correct zijn.';
            await paxPrefill.validateCustomerInvalidEmail(noExistingAccount);
            await expect(paxPrefill.errorMessageText).toHaveText(nonExistingAccountError);
            await paxPrefill.closeButton.click();

            const differentSourceMarketEmail = 'testautomation985@gmail.com';
            const differentSourceMarketError = 'E-mail is niet gekoppeld aan deze markt. Controleer of de gegevens correct zijn.';
            await paxPrefill.validateCustomerInvalidEmail(differentSourceMarketEmail);
            await expect(paxPrefill.errorMessageText).toHaveText(differentSourceMarketError);
            await paxPrefill.closeButton.click();
        },
    );
    test('Verify session is cleared on next customer', { annotation: { type: 'test_key', description: 'B2B-444' } }, async () => {
        await paxPrefill.inputCustomerEmailAndCloseModal();
        await paxPrefill.goToNextCustomer();
        await expect(paxPrefill.inputEmail).toBeEmpty();
        await paxPrefill.closeButton.click();
    });
    test('Verify session is cleared on different agent login', { annotation: { type: 'test_key', description: 'B2B-1405' } }, async () => {
        const homePage = new HomePage(paxPrefill.page);
        await paxPrefill.inputCustomerEmailAndCloseModal();
        const agentNumber = await new TestDataProvider().getSwitchAgentData();
        await homePage.headerComponent.agentSwitch(agentNumber);
        await expect(homePage.headerComponent.customerServiceCenterLink).toContainText(` | TUI Store (${agentNumber})`);
        await paxPrefill.myTUIButton.click();
        await expect(paxPrefill.inputEmail).toBeEmpty();
    });

    test('Verify session is cleared on logout', { annotation: { type: 'test_key', description: 'B2B-1807' } }, async () => {
        const url = paxPrefill.page.url();
        await paxPrefill.inputCustomerEmailAndCloseModal();
        await paxPrefill.logoutLink.click();
        await paxPrefill.continueButtonInPopUp.click();
        await paxPrefill.page.waitForLoadState('load');
        await paxPrefill.page.goto(url);
        await new LoginPage(paxPrefill.page).doLogin();
        await paxPrefill.page.waitForLoadState('load');
        await paxPrefill.myTUIButton.click();
        await expect(paxPrefill.inputEmail).toBeEmpty();
    });

    test('Verify closing of the modal and not saving changed data on cancel button', { annotation: { type: 'test_key', description: 'B2B-439' } }, async () => {
        await paxPrefill.provideCustomerEmail();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await expect(paxPrefill.totalCount).toContainText('Totale reisgezelschap: 1');
        const totalCompanions = await paxPrefill.travelerCompanionTotal.count();
        await paxPrefill.selectAllAvailableCompanionsAndCheckTotal(totalCompanions);
        await paxPrefill.cancelButton.click();
        await expect(paxPrefill.dialogHeader).toBeHidden();
        await paxPrefill.myTUIButton.click();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await expect(paxPrefill.totalCount).toContainText('Totale reisgezelschap: 1');
        for (let i = 0; i < totalCompanions; i++) {
            const checkboxStateCompanion = await paxPrefill.getUnselectedCompanions(i + 1);
            await expect(checkboxStateCompanion).toBeVisible();
        }
    });
    test('Verify data is saved in session after confirm', { annotation: { type: 'test_key', description: 'B2B-443' } }, async () => {
        await paxPrefill.provideCustomerEmail();
        await expect(paxPrefill.customerAccountDialog).toBeVisible({ timeout: 30000 });
        await expect(paxPrefill.totalCount).toContainText('Totale reisgezelschap: 1');
        const totalCompanions = await paxPrefill.travelerCompanionTotal.count();
        await paxPrefill.selectAllAvailableCompanionsAndCheckTotal(totalCompanions);
        await paxPrefill.confirmButton.click();
        await expect(paxPrefill.dialogHeader).toBeHidden();
        await paxPrefill.page.reload();
        await paxPrefill.validateAllCompanionsAreAdded(totalCompanions);
    });
});
