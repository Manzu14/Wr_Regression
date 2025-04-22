const { CountryEngNamesEnum, FlexibleDaysEnum, NightsEnum } = require('../../../flows/api/search/defs/SearchApiEnumDef');

const { toAccommodationDetails } = require('../../../flows/navigate');
const { HomePage } = require('../../../pages/HomePage');
const { test, expect } = require('../../fixures/test');

test.describe('Sample end to end test to create package bookings', { tag: ['@smoke', '@be', '@nl', '@vip', '@ma', '@inhouse', '@3rdparty'] }, () => {
    if (process.env.CI) test.describe.configure({ retries: 3 });
    test('validate user able to create a Package booking and search booking in MMB', async ({ page }, testInfo) => {
        test.setTimeout(300000);
        const accomadationDetailsPage = await toAccommodationDetails(page);
        const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
        const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
        await passengerDetailsPage.fillAllPassangersDetails();
        await passengerDetailsPage.agreeToAllConditions();
        const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
        await paymentOptionsPage.enterPaymentDetails();
        const { bookingRefernceNumber, manageBookingPage } = await confirmBookingPage.getBookingReferenceId();
        expect(bookingRefernceNumber).toBeTruthy();
        await test.step(`adding booking number to test info: ${bookingRefernceNumber}`, () => {
            testInfo.annotations.push({ type: 'bookingRefernceNumber', description: bookingRefernceNumber });
        });
        await manageBookingPage.validateBookingRetreivalInMmb(bookingRefernceNumber);
    });
    test.describe('Validate basic search functionality', () => {
        const searchParamVariants = [
            {
                parameters: {
                    airportsOptions: ['all'],
                    departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
                    paxOptions: {
                        passengersOptions: [],
                    },
                },
                testTitle: 'Validate basic search functionality',
            },
            {
                parameters: {
                    airportsOptions: ['all'],
                    departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
                    destinationOptions: { countryEngNames: [CountryEngNamesEnum.Spain] },
                    paxOptions: {
                        passengersOptions: [],
                    },
                },
                testTitle: 'Validate basic search functionality with specific Country',
            },
            {
                parameters: {
                    airportsOptions: ['all'],
                    departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
                    duration: NightsEnum.FOUR_NIGHTS,
                    paxOptions: {
                        passengersOptions: [],
                    },
                },
                testTitle: 'Validate basic search functionality with duration 14 nights',
            },
        ];
        for (const { parameters, testTitle } of searchParamVariants) {
            test(`${testTitle}`, async ({ page }) => {
                await new HomePage(page).searchPage.doSearch(parameters);
                await expect(page.getByLabel('holiday count')).toBeVisible();
                await expect(page.locator('section.ResultListItemV2__resultItem').first()).toBeVisible();
                await expect(page.locator('section.ResultListItemV2__resultItem')).not.toHaveCount(0);
            });
        }
        test('Validate basic search functionality with destination suggestion', async ({ page }) => {
            await new HomePage(page).searchPage.doSearch({
                airportsOptions: ['all'],
                departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
                destinationOptions: { hotelName: 'hotel' },
                duration: NightsEnum.FOUR_NIGHTS,
                paxOptions: {
                    passengersOptions: [],
                },
            });
            await expect(page.locator('div#accomDetails__component')).toBeVisible();
        });
    });
});
