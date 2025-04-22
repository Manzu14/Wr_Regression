const { expect } = require('@playwright/test');
const pr = require('promise');
import { MmbPriceDetailSection } from './components/price_breakdown_section/MmbPriceDetailSection';
import { ExternalMemoPage } from './components/memos/ExternalMemoPage';
export class ManageBookingPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.requestReservationHyperlink = page.locator('//span[@class="LinkItem__utilityNavLink"]//a');
        this.bookingRefernceIdTextBox = page.locator('//input[@name="bookingRefereneceId"]');
        this.loginToReservationButton = page.locator('//div[@class="UI__buttonWrapper"]//button[@class="buttons__button buttons__primary buttons__fill"]');
        this.reservationReferenceNumberText = page.locator('(//div[@class="UI__Bookingref"])[2]');
        this.getReservationNumber = page.locator('(//div[@class="UI__Bookingref"])[2]//span//a');
        this.backendErrorMessage = page.locator('div.UI__backendErrorMessage').locator('div.AlertDescription__alertDescription').locator('p');
        this.travelWithAssistanceText = page.locator('//div[@class="UI__salesOrderFlagSelectorHeader"]//span//font//font');
        this.reservationWithAssistanceCheckBox = page.locator('.inputs__box');
        this.updateButton = page.locator('//section[@class="UpdateButtonSection"]//button');
        this.checkAndConfirmButton = page.locator('.UI__summaryButton button');
        this.travelWithAssistanceTextInReviewPage = page.locator(
            '//tr[@id="Compare_And_Review_Assisted_Travel"]//td[@class="BookingDetails__rowSecondaryHeading"]//font//font',
        );
        this.reservationWithAssistanceText = page.locator(
            '//tr[@id="Compare_And_Review_Assisted_Travel"]//td[@class="BookingDetails__table_cells_bg"]//font//font',
        );
        this.confirmChangesButton = page.locator('.UI__navWrapper .buttons__button.buttons__primary.buttons__fill.UI__reviewAndConfirmValidation');
        this.reservationBackendErrorMessage = page.locator('.UI__backendErrorMessage');
        this.reservationCheckAndConfirmButton = page.locator('.buttons__button.buttons__primary.buttons__fill.ActionBtns__getSearchButtonConfirm');
        this.successBookingRetrievalIcon = page.locator('.inputs__successIcon');
        this.bookingReferenceTab = page.locator('#retrieve-by-ref-tab');
        this.priceDetailsIcon = page.locator('.UI__PriceBreakDownChevronSection svg');
        this.mmbPriceDetailSection = new MmbPriceDetailSection(this.page);
        this.memosLink = page.locator('.MemosTab__tabTitle');
        this.viewInternalMemoButton = page.locator('.InternalMemoLanding__centerBtn');
        this.mainBookerName = page.locator('.UI__passengerName');
        this.internalMemoReservingDetails = page.locator('.BookingDetails__attribute p');
        this.selectOptionTOAddInternalMemo = page.locator('//div[@class="inputs__select AddNewMemo__selectList"]//select');
        this.sendMemoButton = page.locator('.buttons__button.buttons__primary.buttons__fill.AddMemoForm__submitMemo');
        this.internalMemoRemarksTextArea = page.locator('.TextArea__textArea  div textarea');
        this.internalMemoDashBoard = page.locator('ul.MemosDashBoard__memoList');
        this.externalMemoPage = new ExternalMemoPage(this.page);
    }

    /**
     * This Method is used to click on the hyperlink Request reservation
     */
    async clickRequestReservation() {
        await this.requestReservationHyperlink.click();
    }

    /**
     * This Method is used to enter the booking referncenumber in reservation number textbox
     */
    async enterBookingReferenceNumber(bookingReferenceNo) {
        await this.bookingRefernceIdTextBox.waitFor({ state: 'visible' });
        await this.bookingRefernceIdTextBox.fill(bookingReferenceNo);
    }

    /**
     * This Method is used to click on Login reservation button
     */
    async clickLoginReservationButton() {
        await this.loginToReservationButton.waitFor({ timeout: 60_000 });
        await new pr(resolve => setTimeout(resolve, 10000));
        await this.loginToReservationButton.click();
    }

    async validateBackendErrorDisplayed(bookingReferenceNo) {
        const errorMessageIsVisible = await this.reservationBackendErrorMessage.isVisible();
        if (errorMessageIsVisible) {
            await this.enterBookingReferenceNumber(bookingReferenceNo);
            await this.clickLoginReservationButton();
        }
    }

    async validateBookingRetreivalInMmb(bookingReferenceNo) {
        await this.clickRequestReservation();
        await new pr(resolve => setTimeout(resolve, 60_000));
        await this.enterBookingReferenceNumber(bookingReferenceNo);
        await this.bookingReferenceTab.click();
        await expect(this.successBookingRetrievalIcon).toBeVisible();
        await this.clickLoginReservationButton();
        await this.page.waitForLoadState('load');
        await this.getReservationNumber.isVisible({ timeout: 60_0000 });
        await expect(this.getReservationNumber).toHaveText(bookingReferenceNo);
    }

    async selectTravelWithAssistanceCheckBox() {
        await this.travelWithAssistanceText.scrollIntoViewIfNeeded();
        await this.reservationWithAssistanceCheckBox.click();
    }

    async getMainBookerName() {
        return this.mainBookerName.nth(1).textContent();
    }

    async addInternalMemo(note = 'testing remarks') {
        await this.selectOptionTOAddInternalMemo.selectOption({ index: 1 });
        await expect(this.sendMemoButton).toBeVisible({ timeout: 40_000 });
        await this.internalMemoRemarksTextArea.fill(note);
        await this.sendMemoButton.click();
        await expect(this.internalMemoDashBoard).toBeVisible({ timeout: 40_000 });
    }
}
