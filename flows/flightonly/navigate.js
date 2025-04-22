import { HomePage } from '../../pages/HomePage';
const { expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').Page} page
 * @return {toSearchResultPage}
 */
export async function toSearchPage(page) {
    const homePage = new HomePage(page);
    const searchPage = homePage.flightOnlySearchPage;
    await expect(searchPage.flightSearchPanel, 'search panel not displayed').toBeVisible();
    await searchPage.selectFirstDepartureAirport();
    await searchPage.selectFirstDestinationAirport();
    await searchPage.selectDepartingDate();
    await searchPage.selectReturningDate();
    await searchPage.selectTravellers('1', '0');
    return searchPage.clickOnSearchButton();
}
/**
 * @param {import('@playwright/test').Page} page
 * @return {toSelectFlightPage}
 */
export async function toSearchResultPage(page) {
    const flightSearchResult = await toSearchPage(page);
    return flightSearchResult.checkFlightSearchResult();
}
/**
 * @param {import('@playwright/test').Page} page
 * @return {toflightOnlyFlightOptionsPage}
 */
export async function toSelectFlightPage(page) {
    const selectFlightPage = await toSearchResultPage(page);
    return selectFlightPage.selectFlightOptions();
}
/**
 * @param {import('@playwright/test').Page} page
 * @return {toExtraOptionsPage}
 */
export async function toflightOnlyFlightOptionsPage(page) {
    const flightOptionsPage = await toSelectFlightPage(page);
    return await flightOptionsPage.flightOptionPageClickContinue();
}
/**
 * @param {import('@playwright/test').Page} page
 * @return {PassengerDetailsPage}
 */
export async function toExtraOptionsPage(page) {
    const extraOptionsPage = await toflightOnlyFlightOptionsPage(page);
    return await extraOptionsPage.flightServiceClickContinue();
}
/**
 * @param {import('@playwright/test').Page} page
 * @return {Promise<{bookingRefernceNumber: string, flightOnlyManageBookingPage: FlightOnlyManageBookingPage}>}
 */
export async function toConfirmBookingPage(page) {
    const passengerDetailsPage = await toExtraOptionsPage(page);
    await passengerDetailsPage.fillAllPassangersDetails();
    const paymentPage = await passengerDetailsPage.foClickAgreeContinue();
    const confirmBookingPage = await paymentPage.skipPayment();
    await confirmBookingPage.bookingReferenceId.waitFor({ state: 'visible' });
    return confirmBookingPage.getBookingReferenceId();
}
