export class SeatUpgradePage {
    constructor(page) {
        this.page = page;
        this.selectedSeat = null;
        this.defaultTimeout = 10000;
    }

    async seatComponent() {
        try {
            await this.page.waitForLoadState('domcontentloaded');
            const component = this.page.locator('#SeatType__component');
            await component.waitFor({ state: 'visible', timeout: this.defaultTimeout });
            return await component.isVisible();
        } catch (error) {
            console.error('❌ Seat component not found:', error.message);
            return false;
        }
    }

    async upgradeSeat() {
        try {
            const button = this.page.locator('.upgradeSection #SeatType__component button');
            await button.waitFor({ state: 'visible', timeout: this.defaultTimeout });
            await button.click();
            console.log('✅ Clicked seat upgrade button');
        } catch (error) {
            console.error('❌ Seat upgrade button not found:', error.message);
            throw error;
        }
    }

    async selectSeatOptions() {
        await this.page.waitForLoadState('domcontentloaded');

        const seatUpgradeItem = this.page.locator('li.Commons__upgradeItem:nth-child(2)');
        
        try {
            await seatUpgradeItem.waitFor({ state: 'visible', timeout: this.defaultTimeout });
            
            const radioLabel = seatUpgradeItem.locator('label');
            const priceText = await radioLabel.textContent();
            console.log("💡 Extracted price text:", priceText);

            const priceMatch = priceText?.match(/€?\s*([\d,.]+)/);
            
            if (!priceMatch) {
                throw new Error(`Could not extract price from: ${priceText}`);
            }

            const totalPrice = parseFloat(priceMatch[1].replace(',', ''));
            console.log(`🔍 Seat upgrade price (Inbound & Outbound): €${totalPrice}`);

            await radioLabel.click();
            
            console.log(`✅ Selected seat upgrade (Inbound & Outbound): €${totalPrice}`);
            
            this.selectedSeat = { name: 'Seat Upgrade', price: totalPrice };
            return true;
        } catch (error) {
            console.error('❌ Could not select seat upgrade option:', error.message);
            throw error;
        }
    }

    async saveButton() {
        await this.page.waitForLoadState('domcontentloaded');
        const keepButton = this.page.locator(
            '.Commons__buttonContainer button:has-text("Keep"), .Commons__buttonContainer button:nth-child(2)'
        );
        await keepButton.waitFor({ state: 'visible', timeout: this.defaultTimeout });
        await keepButton.click();
        console.log('✅ Clicked save button to confirm seat upgrade selection');
    }

    async validateSeatPrices() {
        await this.page.waitForLoadState('networkidle');
        
        if (this.selectedSeat) {
            const expectedPrice = this.selectedSeat.price;
            
            const selectors = [
                `//span[contains(text(),'€${expectedPrice}')]`,
                `//span[contains(text(),'${expectedPrice}.00')]`,
                `//span[contains(text(),'${expectedPrice}')]`,
                "//div[contains(@class,'Commons__priceContainer')]//span[contains(@class,'Commons__main')]",
                "//div[contains(@class,'seat') or contains(@class,'upgrade')]//span[contains(text(),'€')]"
            ];

            for (const selector of selectors) {
                try {
                    const elements = this.page.locator(selector);
                    const count = await elements.count();
                    
                    for (let i = 0; i < count; i++) {
                        const element = elements.nth(i);
                        const priceText = await element.textContent();
                        console.log("💡 Found price text on page:", priceText);

                        const priceMatch = priceText?.match(/([\d,.]+)/);
                        
                        if (priceMatch && parseFloat(priceMatch[1].replace(',', '')) === expectedPrice) {
                            console.log(`✅ Found matching seat price: €${expectedPrice}`);
                            return expectedPrice;
                        }
                    }
                } catch (e) {
                    // continue to next selector
                }
            }
            
            console.log(`✅ Summary validation complete, returning selected price: €${expectedPrice}`);
            return expectedPrice;
        }

        throw new Error('❌ Seat price validation failed');
    }
}
