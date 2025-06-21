export class YourBookingComponents {
    constructor(page) {
        this.page = page;
        this.changeholidaylink = page.locator('(//*[contains(@class,"ChangeBooking__whiteButton")])[1]');
        // this.passengerListWrapper = page.locator('#PassengerList__component');
        this.passengerListWrapper = page.locator('//*[@id="PassengerList__component"]');
        this.customScrollWrapper = this.page.locator('#customScrollWraper');
        this.updatePassengerDetailsLink = this.passengerListWrapper.locator(`//span[text()='Wijzig contactgegevens']`);
        this.cancellink = page.locator('(//*[contains(@class,"ChangeBooking__whiteButton")])[2]');
        this.editContactdetailsWrapper = page.locator('.components__headerContanerWrapper');
        //this.adultFirstname = this.editContactdetailsWrapper.locator(`//input[@name='FIRSTNAMEADULT']`);
        this.adultFirstname = this.editContactdetailsWrapper.locator(`//*[@id='FIRSTNAMEADULT1']`);
        this.saveContactDetailsButton = page.locator('//button[text()="Bewaar"]');
        this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");

    }
    async passengerFill() {
        const firstNameLocator = this.page.locator(`//*[@id='FIRSTNAMEADULT1']`);
        const surnameLocator = this.page.locator(`//*[@id='SURNAMEADULT1']`);
      
        const existingFirst = await firstNameLocator.inputValue();
        const existingLast = await surnameLocator.inputValue();
      
        // Logic: only update one field (random or always first)
        const modifyFirstName = true; // or false if you want to flip per run
      
        if (modifyFirstName) {
          // Change first name only (append 3 letters if not already modified)
          if (!existingFirst.endsWith('XYZ')) {
            const updatedFirst = existingFirst + 'XYZ';
            await firstNameLocator.fill(updatedFirst);
            console.log(`Updated first name: ${existingFirst} → ${updatedFirst}`);
          }
        } else {
          // Change surname only
          if (!existingLast.endsWith('ABC')) {
            const updatedLast = existingLast + 'ABC';
            await surnameLocator.fill(updatedLast);
            console.log(`Updated last name: ${existingLast} → ${updatedLast}`);
          }
        }
      
        await this.page.waitForTimeout(1000);
      
        // Save details
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
