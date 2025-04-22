const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { test, expect } = require('../../fixures/test');
let refernceNumber, manageBookingPage;

test.describe.configure({ mode: 'default', retries: 3 });
test.describe('Validation of travel assistance and of adding fees and discounts in MMB', { tag: ['@regression', '@stable'] }, () => {
    test.beforeEach(async ({ sharedBookingState }) => {
        refernceNumber = sharedBookingState.bookingRefernceNumber;
        manageBookingPage = new ManageBookingPage(sharedBookingState.page);
        await manageBookingPage.validateBookingRetreivalInMmb(refernceNumber);
    });
    test.skip(
        '[B2B][PKG]: Verify Travel Assistance flag in MMB.',
        {
            tag: ['@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: {
                type: 'test_key',
                description: 'B2B-3302',
            },
        },
        async () => {
            await manageBookingPage.reservationWithAssistanceCheckBox.click();
            await manageBookingPage.updateButton.click();
            await expect(manageBookingPage.confirmChangesButton).toBeVisible({ timeout: 30_000 });
            await manageBookingPage.confirmChangesButton.click();
            await expect(manageBookingPage.travelWithAssistanceTextInReviewPage).toBeVisible({ timeout: 30_000 });
            await expect(manageBookingPage.reservationWithAssistanceText).toBeVisible();
            await expect(manageBookingPage.reservationWithAssistanceCheckBox).toBeChecked();
            await manageBookingPage.reservationCheckAndConfirmButton.click();
        },
    );

    test(
        '[B2B][PKG]: Verify ability to amend booking with fee & discounts and validate price breakdown in MMB.',
        {
            tag: ['@be', '@nl', '@inhouse'],
            annotation: {
                type: 'test_key',
                description: 'B2B-3303',
            },
        },
        async () => {
            test.setTimeout(300000);
            await expect(manageBookingPage.priceDetailsIcon).toBeVisible({ timeout: 40_000 });
            await manageBookingPage.priceDetailsIcon.click();
            await expect(manageBookingPage.mmbPriceDetailSection.totalPrice).not.toHaveText('€ 0.00', { timeout: 40_000 });
            await manageBookingPage.mmbPriceDetailSection.agentInformationLink.click();
            const totalPrice = await manageBookingPage.mmbPriceDetailSection.getTotalTravelSum();
            const { expectedFees, manageBookingReviewchangePage } = await manageBookingPage.mmbPriceDetailSection.addAgentFees();
            await manageBookingPage.confirmChangesButton.click();
            await expect(manageBookingReviewchangePage.reviewConfirmPageTableHeader).toBeVisible({ timeout: 40_000 });
            const actualAgentFees = await manageBookingReviewchangePage.getAgentFees();
            expect(actualAgentFees).toEqual(expectedFees);
            const expectedFinaltotalprice = parseFloat(totalPrice) + parseFloat(expectedFees);
            const finalTotalPrice = await manageBookingReviewchangePage.getnewCost();
            const actualFinalTotalPrice = finalTotalPrice.replace(/"/g, '');
            expect(parseFloat(actualFinalTotalPrice)).toEqual(expectedFinaltotalprice);
        },
    );
});
