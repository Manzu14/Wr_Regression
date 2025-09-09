export class NonLeadPaxUpgradePage {
  constructor(page) {
    this.page = page;
    this.passengerListWrapper = page.locator('//*[@id="PassengerList__component"]');
    this.customScrollWrapper = page.locator('#customScrollWraper');
    this.updatePassengerDetailsLink = this.passengerListWrapper.locator(`//span[text()='Wijzig contactgegevens']`);
    this.editContactdetailsWrapper = page.locator('.components__headerContanerWrapper');
    this.firstNameLocator = page.locator(`//*[@id='FIRSTNAMEADULT2']`);
    this.surnameLocator = page.locator(`//*[@id='SURNAMEADULT2']`);
    this.saveContactDetailsButton = page.locator('button.UI__addButton');
  }

  async updateNonLeadPassengerDetails() {
    await this.page.waitForLoadState('domcontentloaded');
    
    // Click on "Wijzig passagiersgegevens" link for non-lead passenger
    await this.page.waitForTimeout(2000);
    const passengerDetailsLink = this.page.locator(`//span[text()='Wijzig passagiersgegevens']`);
    await passengerDetailsLink.click();
    
    await this.firstNameLocator.waitFor({ state: 'visible', timeout: 10000 });
    
    const existingFirst = await this.firstNameLocator.inputValue();
    const existingLast = await this.surnameLocator.inputValue();

    // Non-lead passenger can change both first and last name
    if (!existingFirst.endsWith('yo')) {
      const updatedFirst = existingFirst + 'yo';
      await this.firstNameLocator.fill(updatedFirst);
      console.log(`Updated non-lead passenger first name: ${existingFirst} → ${updatedFirst}`);
    }
    
    if (!existingLast.endsWith('er')) {
      const updatedLast = existingLast + 'er';
      await this.surnameLocator.fill(updatedLast);
      console.log(`Updated non-lead passenger last name: ${existingLast} → ${updatedLast}`);
    }

    await this.page.waitForTimeout(1000);
    await this.page.locator('.buttons__button.buttons__secondary.buttons__fill.UI__addButton').click();
  }

  async saveAndProceed() {
    await this.saveContactDetailsButton.waitFor({ timeout: 30000 });
    await this.saveContactDetailsButton.click();

    await this.customScrollWrapper.waitFor({ state: 'detached', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async validatePriceAgainstSummary(expectedPrice) {
    const priceSelector = "//div[contains(@class,'Commons__priceContainer')]//span[contains(@class,'Commons__main')]";
    const actualPrice = parseFloat((await this.page.locator(priceSelector).textContent()).replace(/[^\d.]/g, ''));
    console.log(`💰 Summary shows total: €${actualPrice}`);
    return actualPrice;
  }
}