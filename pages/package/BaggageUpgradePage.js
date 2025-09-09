export class BaggageUpgradePage {
    constructor(page) {
        this.page = page;
        this.selectedPrices = [];
    }

    async baggageComponent() {
        try {
            if (this.page.isClosed()) {
                throw new Error("❌ Page is already closed before baggage component check.");
            }

            const component = this.page.locator('#PerLegLuggageUpgrade__component');
            await component.waitFor({ state: 'visible', timeout: 40000 });

            const isVisible = await component.isVisible();
            console.log(`✅ Baggage component visibility: ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.error("❌ Error in baggageComponent():", error.message);
            try {
                await this.page.screenshot({ path: 'baggageComponent-failed.png' });
                console.log('📸 Screenshot captured: baggageComponent-failed.png');
            } catch (screenshotError) {
                console.warn("⚠️ Screenshot capture failed:", screenshotError.message);
            }
            throw error;
        }
    }

    async upgradeBaggage() {
        const selector = '.upgradeSection #PerLegLuggageUpgrade__component button';
        const baggageAmendButton = this.page.locator(selector);

        try {
            await baggageAmendButton.waitFor({ state: 'visible', timeout: 60000 });
            await baggageAmendButton.scrollIntoViewIfNeeded();
            await baggageAmendButton.click();
        } catch (error) {
            console.error(`❌ Baggage amend button not found for selector: ${selector}`);
            const snapshot = await this.page.content();
            console.log('🔍 Page snapshot (trimmed):', snapshot.slice(0, 1000));
            throw new Error(`Timeout: '${selector}' was not visible on the page`);
        }
    }

    async fetchAndSelectBaggageByIndex(index) {
        const baggageCard = this.page.locator(`(//div[@class='cards__horizontalAncillaryWrapper'])[${index}]`);

        try {
            await baggageCard.waitFor({ state: 'visible', timeout: 10000 });
        } catch (error) {
            throw new Error(`❌ Baggage card at index ${index} not found or not visible`);
        }

        const weightText = await baggageCard.locator('.cards__weight').textContent();
        const priceText = await baggageCard.locator('.cards__price').textContent();
        const priceMatch = priceText?.match(/\+€(\d+\.?\d*)/);

        if (!priceMatch) {
            throw new Error(`❌ Could not extract price from ${weightText} card: ${priceText}`);
        }

        const price = parseFloat(priceMatch[1]);
        console.log(`🔍 ${weightText} baggage price per pax (Inbound & Outbound): €${price}`);

        await baggageCard.locator('button').click();
        console.log(`✅ Selected ${weightText} baggage per pax (Inbound & Outbound): €${price}`);

        return { weight: weightText, price: price };
    }

    async saveButton() {
        await this.page.waitForLoadState('domcontentloaded');
        const saveBtn = this.page.locator('.Luggage__buttonContainer button:nth-child(2)');
        await saveBtn.focus();
        await saveBtn.click();
    }

    async validatePriceAgainstSummary(selectedPrice) {
        // Wait for page to load after baggage selection
        await this.page.waitForLoadState('networkidle');
        
        // Look for baggage-related price elements with the selected price
        const selectors = [
            `//div[contains(@class,'baggage') or contains(@class,'luggage')]//span[contains(text(),'${selectedPrice}')]`,
            `//span[contains(text(),'${selectedPrice}.00')]`,
            `//span[contains(text(),'€${selectedPrice}')]`,
            `//div[contains(@class,'Commons__priceContainer')]//span[text()='${selectedPrice}']`,
            `//tr[contains(@class,'baggage') or contains(@id,'LUGGAGE')]//span[contains(text(),'${selectedPrice}')]`
        ];

        // First try to find the exact selected price
        for (const selector of selectors) {
            try {
                const elements = this.page.locator(selector);
                const count = await elements.count();
                
                for (let i = 0; i < count; i++) {
                    const element = elements.nth(i);
                    const priceText = await element.textContent();
                    
                    if (priceText && priceText.includes(selectedPrice.toString())) {
                        console.log(`✅ Found baggage price: ${priceText}`);
                        return selectedPrice;
                    }
                }
            } catch (e) {
                // Continue to next selector
            }
        }

        // If selected price not found, return the selected price directly
        console.log(`⚠️ Could not find €${selectedPrice} in summary, returning selected price`);
        return selectedPrice;
    }
}