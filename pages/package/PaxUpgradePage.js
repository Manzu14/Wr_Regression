export class PaxUpgradePage {
  constructor(page) {
    this.page = page;
    this.passengerListWrapper = page.locator('//*[@id="PassengerList__component"]');
    this.customScrollWrapper = page.locator('#customScrollWraper');
    this.updatePassengerDetailsLink = this.passengerListWrapper.locator(`//span[text()='Wijzig contactgegevens']`);
    this.editContactdetailsWrapper = page.locator('.components__headerContanerWrapper');
    this.firstNameLocator = page.locator(`//*[@id='FIRSTNAMEADULT1']`);
    this.surnameLocator = page.locator(`//*[@id='SURNAMEADULT1']`);
    this.saveContactDetailsButton = page.locator('//button[text()="Bewaar"]');
    this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");
  }

  async updatePassengerDetails() {
    const existingFirst = await this.firstNameLocator.inputValue();
    const existingLast = await this.surnameLocator.inputValue();

    const modifyFirstName = true;

    if (modifyFirstName) {
      if (!existingFirst.endsWith('XYZ')) {
        const updatedFirst = existingFirst + 'XYZ';
        await this.firstNameLocator.fill(updatedFirst);
        console.log(`Updated first name: ${existingFirst} → ${updatedFirst}`);
      }
    } else {
      if (!existingLast.endsWith('ABC')) {
        const updatedLast = existingLast + 'ABC';
        await this.surnameLocator.fill(updatedLast);
        console.log(`Updated last name: ${existingLast} → ${updatedLast}`);
      }
    }

    await this.page.waitForTimeout(1000);
    await this.page.locator(`.buttons__button.buttons__secondary.buttons__fill.UI__addButton`).click();
  }

  async saveAndProceed() {
    await this.saveContactDetailsButton.waitFor({ timeout: 30_000 });
    await this.saveContactDetailsButton.click();

    // Ensure save is completed
    await this.customScrollWrapper.waitFor({ state: 'detached', timeout: 10000 });

    // Wait and scroll to summary button
    await this.page.waitForLoadState('networkidle');
    await this.reviewButton.scrollIntoViewIfNeeded();
    await this.reviewButton.waitFor({ timeout: 20000 });
    await this.reviewButton.click();
  }
}
