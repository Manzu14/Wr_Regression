import { FlightOnlySearchPage } from './SearchPage';
const { expect } = require('@playwright/test');
export class FlightOnlyManageBookingPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.requestReservationHyperlink = page.locator('//a[contains(@href,"travel/managebooking")]').nth(0);
        this.getReservationNumber = page.locator('(//div[@class="UI__Bookingref"])[2]//span//a');
        this.loginToReservationButton = page.locator('//div[@class="UI__buttonWrapper"]//button[@class="buttons__button buttons__primary buttons__fill"]');
        this.bookingRefernceIdTextBox = page.locator('//input[@name="bookingRefereneceId"]');
        this.nextCustomerlink = page.locator('span[aria-label="next customer link"]');
        this.nextCustomerPopup = page.locator('div> div.RetailHeader__nextCustomerText').nth(0);
        this.resetNextCustomerbtn = page.locator('(//div[@class="RetailHeader__actionButtons"]//button)[2]');
        this.manageReservationlink = page.locator('//a[contains(@href,"managemybooking/bookinghistory")]');
        this.paymentHistoryTab = page.locator('//a[contains(@href,"managemybooking/paymenthistory?")]');
        this.paymentHistoryContainer = page.locator('#paymentHistory__component');
        this.paymentHistoryTable = page.locator('//table[@class="table__table UI__paymentHistoryTable"]');
        this.paymentHistoryRefNum = page.locator('//div[@id="paymentHistory__component"]/../..//div[@class="UI__BookingrefPad0"]//span');
        this.paymentBookingAgentName = page.locator('//div[@id="paymentHistory__component"]/../..//span[@class="UI__onBehalf"]');
        this.paymentPayerName = page.locator('td[arialabel="payment history payerName"]').nth(0);
        this.paymentHistoryPaymentReferenceNo = page.locator('td[arialabel="payment history payment reference"]').nth(0);
        this.remarkDropDown = page.locator('td.TableCell__tableCell  > svg').last();
        this.versionBookingHistoryDropdown = page.locator('select[name="bookingHistoryVersion"]');
        this.paymentAgentNameTable = page.locator('((//div[@id="paymentHistory__component"]//table//div)[2]//span)[2]');
        this.bookingHistoryTab = page.locator('//a[contains(@href,"managemybooking/bookinghistory?")]');
        this.bookingHistoryContainer = page.locator('#bookingHistory__component');
        this.bookingRefNumber = page.locator('//div[@id="bookingHistory__component"]/../..//div[@class="UI__BookingrefPad0"]//span');
        this.bookingAgentName = page.locator('//div[@id="bookingHistory__component"]/../..//span[@class="UI__onBehalf"]');
        this.bookingHistoryPaxTable = page.locator('//div[@aria-label="product and pax info"]');
        this.typeProduct = page.locator('div[aria-label="product and pax info"] > table > tbody > tr > td').nth(1);
        this.travellerName = page.locator('div[aria-label="product and pax info"] > table > tbody > tr > td').nth(6);
        this.duration = page.locator('table[class*="tableProductPax"] > tbody >tr:nth-child(3) >td:nth-child(2)');
        this.outboundFlight = page.locator('h4.UI__accordionHead').nth(0);
        this.returnFlight = page.locator('h4.UI__accordionHead').nth(1);
        this.priceOverviewFlight = page.locator('h4.UI__accordionHead').nth(2);
        this.memoComponent = page.locator('div.MemosTab__memosTabContainer');
        this.memosTab = page.getByLabel('Memo tab title').locator('div');
        this.externalMemoButton = page.locator('a[href*="externalmemo?"] > button');
        this.createMemoButton = page.locator('.MemoHeading__createMemoBtn > button');
        this.assitanceMemo = page.locator('(//label[contains(@class,"inputs__radioButton")])[3]');
        this.selectCatagoryStatus = page.getByLabel('Select');
        this.memoNote = page.locator('div[class="CreateMemo__memoNote"] > div> div > textarea');
        this.sendMemoButton = page.locator('div[class ="CreateMemo__memoButton"] > div');
        this.confirmedMemo = page.locator('div[class ="MemoCard__dataContent"]>div[class ="MemoCard__statusLabel MemoCard__confirmed"]').nth(0);
        this.requestReservationFont = page.locator('#tui-booking-search-cfe').nth(0);
        this.successorIcon = page.locator('span.inputs__icon.inputs__successIcon').nth(0);
        this.successorInputBox = page.locator('input.inputs__success').nth(0);
        this.internalMemoButton = page.locator('div[class="InternalMemoLanding__centerBtn"] > button');
        this.newMemoSelectionList = page.locator('div[class="AddNewMemo__selectlistWrapper"] >div>div>select');
        this.memoCatagoryList = page.locator('div[class="SelectMemoCategory__categorySelect"] > div >div>select');
        this.internalMemoNote = page.locator('div[class="TextArea__textArea "] > div>textarea');
        this.addInternalMemoButton = page.locator('button[class*="AddMemoForm__submitMemo"]');
        this.memoList = page.locator('li.MemosDashBoard__listItem');
        this.memoDashboard = page.locator('ul.MemosDashBoard__memoList');
        this.memoInfo = page.locator('li.MemosDashBoard__memoInfo');
        this.memoDetails = page.locator('span.MemosDashBoard__memoDetails > a');
        this.openActiveMemo = page.locator('li.ViewMemos__item');
        this.backToMemoIcon = page.locator('div.BackToDashBoard__backToDashboard > a');
        this.addMemoButton = page.locator('button.MemosDashBoard__addMemoButton');
        this.travelWithAssistanceRow = page.locator('#Compare_And_Review_Assisted_Travel');
        this.reservationConfirmationBox = page.locator('//div[@class="PaymentConfirmation__component"]//div[contains(@class,"PaymentConfirmation__box")]');
        this.reservationNumber = page.locator('//div[@class="PaymentConfirmation__component"]//div[contains(@class,"PaymentConfirmation__box")]//span');
        this.reservationReferenceNumberText = page.locator('(//div[@class="UI__Bookingref"])[2]');
        this.reservationWithAssistanceCheckbox = page.locator(
            '//div[@class="assistedTravelSection"]//label[@class="inputs__CheckboxTextAligned undefined undefined"]',
        );
        this.updateButton = page.locator('//section[@class="UpdateButtonSection"]//button');
        this.checkConfirmAlertButton = page.locator('//div[@class="UI__summaryButton"]//button');
        this.reviewConfirmButton = page.locator('button[class*="ActionBtns__getSearchButtonConfirm"]');
    }

    async clickRequestReservation() {
        await this.requestReservationHyperlink.waitFor({ state: 'visible' });
        await this.requestReservationHyperlink.click();
    }

    /**
     * This Method is used to enter the booking referncenumber in reservation number textbox
     * @param {string} bookingReferenceNo - The bookingReferenceNo to retrive booking.
     */
    async enterBookingReferenceNumber(bookingReferenceNo) {
        await this.bookingRefernceIdTextBox.waitFor({ state: 'visible' });
        await this.bookingRefernceIdTextBox.fill(bookingReferenceNo);
    }

    async clickLoginReservationButton() {
        await this.requestReservationFont.click();
        await this.successorIcon.waitFor({ state: 'visible', timeout: 60000 });
        await this.successorInputBox.waitFor({ state: 'visible' });
        await this.loginToReservationButton.click();
    }

    async verifyNextCustomer() {
        await this.nextCustomerlink.click();
        await expect(this.nextCustomerPopup).toBeVisible();
        await this.resetNextCustomerbtn.click();
        return new FlightOnlySearchPage(this.page);
    }

    async verifyPaymentHistoryContainers(paymentType = 'Cash') {
        await this.paymentHistoryTab.waitFor({ state: 'visible' });
        await this.paymentHistoryTab.click();
        await expect(this.paymentHistoryRefNum).toBeVisible();
        await expect(this.paymentBookingAgentName).toBeVisible();
        await this.paymentHistoryContainer.waitFor({ state: 'visible' });
        await expect(this.paymentPayerName).toContainText(paymentType);
        await expect(this.paymentHistoryPaymentReferenceNo).toBeVisible();
        await this.remarkDropDown.click();
        await expect(this.paymentAgentNameTable).toBeVisible();
    }

    async verifyBookingHistoryContainers() {
        await this.bookingHistoryTab.waitFor({ state: 'visible' });
        await this.outboundFlight.click();
        await this.returnFlight.click();
        await this.priceOverviewFlight.click();
    }

    async createExternalMemo(note = 'test') {
        await this.memoComponent.waitFor({ state: 'visible' });
        await this.memosTab.first().click();
        await this.externalMemoButton.click();
        await this.createMemoButton.waitFor({ state: 'visible' });
        await this.createMemoButton.click();
        await this.assitanceMemo.click();
        await this.selectCatagoryStatus.nth(0).selectOption({ index: 1 });
        await this.selectCatagoryStatus.nth(1).selectOption({ index: 2 });
        await this.memoNote.fill(note);
        await this.sendMemoButton.click();
        await this.confirmedMemo.waitFor({ state: 'visible', timeout: 4 * 60 * 1000 });
    }

    async createInternalMemo(note = 'test') {
        await this.memoComponent.waitFor({ state: 'visible' });
        await this.memosTab.first().click();
        await this.internalMemoButton.click();
        await this.newMemoSelectionList.selectOption({ index: 1 });
        await this.memoCatagoryList.nth(0).selectOption({ index: 1 });
        await this.memoCatagoryList.nth(1).selectOption({ index: 1 });
        await this.internalMemoNote.fill(note);
        await this.addInternalMemoButton.click();
        await this.memoDashboard.waitFor({ state: 'visible', timeout: 4 * 60 * 1000 });
    }

    async createInternalMemoReservering(note = 'test') {
        await this.backToMemoIcon.click();
        await this.addMemoButton.click();
        await this.memoCatagoryList.nth(1).selectOption({ index: 1 });
        await this.internalMemoNote.fill(note);
        await this.addInternalMemoButton.click();
        await this.memoDashboard.waitFor({ state: 'visible', timeout: 4 * 60 * 1000 });
    }

    async selectTravelWithAssistance() {
        await this.reservationReferenceNumberText.waitFor({ state: 'visible', timeout: 2 * 60 * 1000 });
        await this.reservationWithAssistanceCheckbox.waitFor({ state: 'visible', timeout: 2 * 60 * 1000 });
        await this.reservationWithAssistanceCheckbox.click();
        await this.updateButton.click();
        await this.checkConfirmAlertButton.click();
        await this.travelWithAssistanceRow.waitFor({ state: 'visible' });
    }
}
