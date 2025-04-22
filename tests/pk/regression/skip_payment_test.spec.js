const { toPaymentOptionPage } = require('../../../flows/navigate');
const { ConfirmBookingPage } = require('../../../pages/package/ConfirmBookingPage');
const { PaymentOptionsPage } = require('../../../pages/package/PaymentOptionsPage');
const { test, expect } = require('../../fixures/test');

test.describe.configure({ retries: 3 });
test.describe(
    '[PKG]-[paymentOptionPage]: complete the booking with skip payment',
    { tag: ['@regression', '@be', '@nl', '@vip', '@inhouse', '@stable'] },
    () => {
        test(
            'Verify ability to complete booking with skip Payments in bookflow.',
            {
                annotation: { type: 'test_key', description: 'B2B-3315' },
            },
            async ({ page }) => {
                test.setTimeout(300000);
                await toPaymentOptionPage(page);
                const paymentTypes = new PaymentOptionsPage(page);
                await paymentTypes.clickSkipPaymentLink();
                const confirmBookingPage = new ConfirmBookingPage(page);
                expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
            },
        );
    },
);
