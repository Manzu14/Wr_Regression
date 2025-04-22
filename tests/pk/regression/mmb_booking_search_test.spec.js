const { HomePage } = require('../../../pages/HomePage');
import { expect, test } from '../../fixures/test';

test.describe('[B2B]-[mmb]: validation booking search with date', () => {
    test(
        '[B2B][mmb]: Verify booking search with date',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            await bookingSearchPage.retrieveWithoutBookingRefTab();
            await bookingSearchPage.searchWithDate();
            await bookingSearchPage.bookingReferenceLink.first().waitFor({ timeout: 280_000 });
            await bookingSearchPage.retrieveBooking();
            await bookingSearchPage.MmbBookingReference.waitFor({ timeout: 280_000 });
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
        },
    );
});
