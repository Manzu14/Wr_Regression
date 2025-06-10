export class InsuranceUpgrade{
    constructor(page){
        this.page=page
    }
    async viewInsurance() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.waitForTimeout(3000);
        return await this.page.locator('(//*[contains(@class,"Commons__ItemCardInfoWesternRegion")])[last()]').isVisible();
    }
    async addInsurance() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.locator('//*[contains(@href,"managemybooking/manageinsurance")]').click();
    }
    getCurrentUrl() {
        return this.page.url();
    }
    async selectAllPax() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.locator('//*[@class="GetQuoteV2__selectAll"]').click();
        //return await this.page.locator(' //*[@class="GetQuoteV2__getQuote"]').isVisible();
        await this.page.locator(' //*[@class="GetQuoteV2__getQuote"]').click();
    }
    async verifyInsuranceOptions() {
        await this.page.waitForLoadState('domcontentloaded')
        return await this.page.locator('(//*[contains(@class,"InsuranceType__multiSelect")])[last()]').isVisible();
    }
    async expandInsurance() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.locator('(//*[@class="Multiselect__collapsibleIcon"])[1]').click();
        await this.page.waitForTimeout(3000);
        await this.page.locator('(//*[@class="PerPersonSelectList__checkbox"])[1]').click();
    }
    async confirmInsurancePrice(){
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.locator('//*[@class="Multiselect__buttons"]').click();
        await this.page.waitForTimeout(3000);      
    }
    async totalInsurancePriceIsVisible(){
        return await this.page.locator('//*[@class="Multiselect__totalInsurancePrice"]').isVisible();
    }
    async saveInsurance(){
        await this.page.locator('.Multiselect__buttons .Multiselect__saveButton').click();
    }
}