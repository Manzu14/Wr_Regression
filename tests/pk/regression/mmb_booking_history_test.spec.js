const { BookingHistoryPage } = require('../../../pages/package/BookingHistoryPage');
const { BookingPaymentHistoryPage } = require('../../../pages/package/BookingPaymentHistoryPage');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { test, expect } = require('../../fixures/test');
let refernceNumber;

test.describe.configure({ mode: 'default', retries: 3 });
test.describe('Verify booking history details in MMB', { tag: ['@regression', '@stable'] }, () => {
    test.beforeEach(async ({ sharedBookingState }) => {
        refernceNumber = sharedBookingState.bookingRefernceNumber;
        const manageBookingPage = new ManageBookingPage(sharedBookingState.page);
        await manageBookingPage.validateBookingRetreivalInMmb(refernceNumber);
    });
    test(
        '[B2B][PKG]: Verify booking history details in MMB',
        {
            tag: ['@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: {
                type: 'test_key',
                description: 'B2B-3299',
            },
        },
        async ({ sharedBookingState }) => {
            const bookingHistory = new BookingHistoryPage(sharedBookingState.page);
            await bookingHistory.openBookingHistoryPage();
            await expect(bookingHistory.bookingVersionList).toBeVisible();
            await expect(bookingHistory.bookingDate).toBeVisible();
            await bookingHistory.validateAgentDetails();
            await expect(bookingHistory.productType).toContainText('Vlucht en verblijf');
            await bookingHistory.validateTabHeadersForBasicPackageBooking();
        },
    );

    test(
        '[B2B][PKG]: Verify payment history details in MMB',
        {
            tag: ['@be', '@nl', '@inhouse'],
            annotation: {
                type: 'test_key',
                description: 'B2B-3301',
            },
        },
        async ({ sharedBookingState }) => {
            const paymentHistoryPage = new BookingPaymentHistoryPage(sharedBookingState.page);
            await paymentHistoryPage.openBookingPaymentHistoryPage();
            const paymentHistoryHeaders = ['Datum', 'Betaalmiddel', 'Betaalreferentie', 'Betaalmethode', 'Bedrag', 'Naam van de betaler', 'Opmerking'];
            const countHeaders = (await paymentHistoryPage.allPaymentHistoryHeaders.count()) - 1;
            for (let i = 0; i < countHeaders; i++) {
                await expect(paymentHistoryPage.allPaymentHistoryHeaders.nth(i)).toHaveText(paymentHistoryHeaders[i], { ignoreCase: true });
            }
            await expect(paymentHistoryPage.bookingReferenceEntry).toHaveText(refernceNumber);
            await expect(paymentHistoryPage.paymentHistoryAmount).not.toBeEmpty();
            await paymentHistoryPage.remarkLink.click();
            await expect(paymentHistoryPage.agentInRemarkInformation).toContainText('Customer Service Center');

            await expect(paymentHistoryPage.makePaymendAdjustmentLink).toBeVisible();
            await paymentHistoryPage.makePaymendAdjustmentLink.click();
            await expect.soft(paymentHistoryPage.paymentAdjustmentAmountBlock).toBeVisible();
            await expect.soft(paymentHistoryPage.paymentAdjustmentPaymentBlock).toBeVisible();
            await expect.soft(paymentHistoryPage.paymentAdjustmentConfirmButton).toBeVisible();
            await expect.soft(paymentHistoryPage.paymentAdjustmentCancelButton).toBeVisible();
        },
    );
});
