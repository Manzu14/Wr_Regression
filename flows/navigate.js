import { HomePage } from '../pages/HomePage';
import { SearchUrlBuilder } from './api/search/SearchUrlBuilder';
import { FlexibleDaysEnum, NightsEnum } from './api/search/defs/SearchApiEnumDef';

const { AccomadationDetailsPage } = require('../pages/package/AccomadationDetailsPage');
const { SearchResultPage } = require('../pages/package/SearchResultPage');
const { expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').Page} page
 * @return {Promise<AccomadationDetailsPage>}
 */

export async function toAccommodationDetails(page) {
    const url = await SearchUrlBuilder.getSearchUrl({
        airportsOptions: ['all'],
        departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
        paxOptions: {
            passengersOptions: [],
        },
    });
    await page.goto(url);
    const searchResultPage = new SearchResultPage(page);
    await expect(searchResultPage.searchResult).toBeVisible({ timeout: 40000 });
    return searchResultPage.openRandomPackage();
}

export async function toAccommodationDetailsWithFutureDates(page) {
    const url = await SearchUrlBuilder.getSearchUrl({
        airportsOptions: ['all'],
        departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
        duration: NightsEnum.FOUR_NIGHTS,
        paxOptions: {
            passengersOptions: [],
        },
    });
    await page.goto(url);
    const searchResultPage = new SearchResultPage(page);
    await expect(searchResultPage.searchResult).toBeVisible({ timeout: 40000 });
    return searchResultPage.openRandomPackage();
}

export async function toSummaryDetailsPage(page) {
    const accomadationDetailsPage = await toAccommodationDetails(page);
    return await accomadationDetailsPage.clickFurtherButton();
}
export async function toPassengerDetailsPage(page) {
    const accomadationDetailsPage = await toAccommodationDetails(page);
    const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
    const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
    await passengerDetailsPage.fillAllPassangersDetails();
    await passengerDetailsPage.agreeToAllConditions();
    return passengerDetailsPage;
}
/**
 * This flow Mainly selects the single accomdation
 * @param {*} page
 * @returns
 */
export async function toPaymentOptionPage(page) {
    const url = await SearchUrlBuilder.getSearchUrl({
        airportsOptions: ['all'],
        departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
        destinationOptions: { hotelName: 'hotel' },
        duration: NightsEnum.FOUR_NIGHTS,
        paxOptions: {
            passengersOptions: [],
        },
    });
    await page.goto(url);
    const searchResultPage = new SearchResultPage(page);
    const accomadationDetailsPage = await searchResultPage.selectDatesFromSingleAccomdation();
    const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
    const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
    await passengerDetailsPage.fillAllPassangersDetails();
    await passengerDetailsPage.agreeToAllConditions();
    return await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
}

export async function toConfirmationPage(page) {
    const accomadationDetailsPage = await toAccommodationDetails(page);
    const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
    const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
    await passengerDetailsPage.fillAllPassangersDetails();
    await passengerDetailsPage.agreeToAllConditions();
    const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
    await paymentOptionsPage.enterPaymentDetails();
    const { bookingRefernceNumber } = await confirmBookingPage.getBookingReferenceId();
    return { bookingRefernceNumber, confirmBookingPage };
}

export async function createBookingWithFutureDates(page) {
    const accomadationDetailsPage = await toAccommodationDetailsWithFutureDates(page);
    const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
    const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
    await passengerDetailsPage.fillAllPassangersDetails();
    await passengerDetailsPage.agreeToAllConditions();
    const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
    await paymentOptionsPage.enterPayInFullDetails();
    const { bookingRefernceNumber } = await confirmBookingPage.getBookingReferenceId();
    return { bookingRefernceNumber, confirmBookingPage };
}
