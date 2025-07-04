const pr = require('promise');
 
export class BaggageUpgradePage {
    constructor(page) {
        this.page = page;
    }
 
    async baggageComponent() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('#PerLegLuggageUpgrade__component').isVisible();
    }
 
    async upgradeBaggage() {
    const selector = '.upgradeSection #PerLegLuggageUpgrade__component button';
    const baggageAmendButton = this.page.locator(selector);

    try {
        await baggageAmendButton.waitFor({ state: 'visible', timeout: 60000 }); // increase timeout
        await baggageAmendButton.scrollIntoViewIfNeeded(); // ensure it's in view
        await baggageAmendButton.click();
    } catch (error) {
        console.error(`❌ Baggage amend button not found for selector: ${selector}`);
        const snapshot = await this.page.content();
        console.log('🔍 Page snapshot (trimmed):', snapshot.slice(0, 1000)); // optional: capture first 1k HTML chars
        throw new Error(`Timeout: '${selector}' was not visible on the page`);
    }


    }
 
    async selectBaggageOptions() {
        await this.page.waitForLoadState('domcontentloaded');
        await new pr(resolve => setTimeout(resolve, 10000));
        const luggageOptions = await this.page.$$('.Luggage__luggageOptions button');
        if (luggageOptions.length> 0) {          
        const randomIndex = Math.floor(Math.random() * luggageOptions.length);
        console.log('randomIndex---'+ randomIndex);
        const selectedOption = luggageOptions[randomIndex];
        console.log('selectedOption---'+ selectedOption);
        await selectedOption.click();
        return await this.page.locator('//div[contains(text(),"Bagage")]').isVisible();
        } else {
            throw new Error("Language options are not available to add");
        }
    }
 
    async saveButton() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.Luggage__buttonContainer button:nth-child(2)').focus();
        await this.page.locator('.Luggage__buttonContainer button:nth-child(2)').click();
    }
}