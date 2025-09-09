class InsuranceUpgrade{
    constructor(page){
        this.page=page
    }
    
    async viewInsurance() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        return await this.page.locator('.Commons__ItemCardInfoWesternRegion').last().isVisible();
    }
    
    async addInsurance() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('a[href*="manageinsurance"]').click();
    }
    
    getCurrentUrl() {
        return this.page.url();
    }
    
    async selectAllPax() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.GetQuoteV2__selectAll').click();
        await this.page.locator('.GetQuoteV2__getQuote').click();
    }
    
    async verifyInsuranceOptions() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('.InsuranceType__multiSelect').last().isVisible();
    }
    
    async expandInsurance() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.Multiselect__collapsibleIcon').first().click();
        await this.page.waitForTimeout(2000);
    }
    
    async selectPassengers() {
        await this.page.waitForLoadState('domcontentloaded');
        const checkboxes = this.page.locator('.PerPersonSelectList__passengers .PerPersonSelectList__checkbox');
        const count = await checkboxes.count();
        for (let i = 0; i < count; i++) {
            await checkboxes.nth(i).click();
        }
    }
    
    async confirmInsurancePrice(){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.Multiselect__buttons button').first().click();
        await this.page.waitForTimeout(2000);      
    }
    
    async totalInsurancePriceIsVisible(){
        await this.page.waitForLoadState('domcontentloaded');
        try {
            await this.page.locator('.Multiselect__totalInsurancePrice').waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (e) {
            return await this.page.locator('.Multiselect__totalPrice').isVisible();
        }
    }
    
    async getTotalInsurancePrice(){
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('.Multiselect__totalPrice').innerText();
    }
    
    async saveInsurance(){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        
        try {
            await this.page.locator('.Multiselect__fullWidthButton').click({ timeout: 5000 });
            await this.page.waitForTimeout(1000);
            await this.page.locator('.Multiselect__saveButton').click({ timeout: 5000 });
        } catch (e) {
            try {
                await this.page.locator('button:has-text("Opslaan")').click({ timeout: 5000 });
            } catch (e2) {
                await this.page.locator('.Multiselect__buttons button').first().click();
            }
        }
    }
    
    async confirmAndSaveInsurance(){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.page.locator('.Multiselect__buttons .Multiselect__saveButton').click();
    }
    
    async getInsuranceOptionPrice(optionIndex = 0) {
        await this.page.waitForLoadState('domcontentloaded');
        const priceElement = this.page.locator('.Multiselect__price').nth(optionIndex);
        await priceElement.waitFor({ state: 'visible' });
        const priceText = await priceElement.innerText();
        return priceText.replace(/\s+/g, '');
    }
    
    async validatePriceFormat(price) {
        const priceRegex = /^€\d+\.\d{2}$/;
        return priceRegex.test(price);
    }
    
    async getPerPassengerPrice(passengerIndex = 0) {
        await this.page.waitForLoadState('domcontentloaded');
        const passengerPrice = this.page.locator('.Multiselect__passengerSection').nth(passengerIndex).locator('span').last();
        return await passengerPrice.innerText();
    }
    
    async getModificationCosts() {
        await this.page.waitForLoadState('domcontentloaded');
        const modificationRow = this.page.locator('.BookingDetails__table_row:has-text("MODIFICATION COSTS")');
        const costs = modificationRow.locator('.BookingDetails__description span[text*="€"]');
        return await costs.last().innerText();
    }
    
   async validatePriceAgainstSummary(expectedPrice) {
        const priceSelector = ".Multiselect__totalPrice";
        const priceText = await this.page.locator(priceSelector).textContent();
        const actualPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
        console.log(`💰 Summary shows total: €${actualPrice}`);
        return actualPrice;
    }
}

module.exports = { InsuranceUpgrade };