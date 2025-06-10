export class YourBookingComponents {
    constructor(page) {
        this.page = page;
        this.changeholidaylink = page.locator('(//*[contains(@class,"ChangeBooking__whiteButton")])[1]');
        // this.passengerListWrapper = page.locator('#PassengerList__component');
        this.passengerListWrapper = page.locator('//*[@id="PassengerList__component"]');
        this.updatePassengerDetailsLink = this.passengerListWrapper.locator(`//span[text()='Wijzig contactgegevens']`);
        this.cancellink = page.locator('(//*[contains(@class,"ChangeBooking__whiteButton")])[2]');
        this.editContactdetailsWrapper = page.locator('.components__headerContanerWrapper');
        //this.adultFirstname = this.editContactdetailsWrapper.locator(`//input[@name='FIRSTNAMEADULT']`);
        this.adultFirstname = this.editContactdetailsWrapper.locator(`//*[@id='FIRSTNAMEADULT1']`);
        this.saveContactDetailsButton = this.editContactdetailsWrapper.locator('//button[text()="Bewaar"]');
        this.reviewButton = this.page.locator('.UI__summaryButton');
    }
    async passengerFill() {
        await this.page.locator(`//*[@id='FIRSTNAMEADULT1']`).fill(`adultoneabc`);
        await this.page.waitForTimeout(2000);
        // await (yourBookingComponents.saveContactDetailsButton).click();
        await this.page.locator(`.buttons__button.buttons__secondary.buttons__fill.UI__addButton`).click();
    }

    async summaryButton() {
        // eslint-disable-next-line playwright/no-wait-for-selector
        const scroll = await this.page.waitForSelector('[aria-label="Hotel-details"] h2');
        await scroll.scrollIntoViewIfNeeded();

        await this.reviewButton.isVisible();
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(25000);
        await this.reviewButton.click();
    }
}
