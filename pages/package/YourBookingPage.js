export class YourBookingPage {
    constructor(page) {
        this.page = page;
        this.addBaggageButton = page.locator('#PerLegLuggageUpgrade__component button');
        this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");
        this.hotelDetailsHeader = page.locator('[aria-label="Hotel-details"] h2');
        this.specialBaggage = page.locator('#SpecialLuggage__component');
    }

    async clickAddBaggage() {
        const baggageAmendButton = this.addBaggageButton;
        await baggageAmendButton.waitFor({ state: 'attached', timeout: 40000 });
        await baggageAmendButton.waitFor({ state: 'visible', timeout: 15000 });
        await baggageAmendButton.scrollIntoViewIfNeeded();
        await baggageAmendButton.click();
    }

    async specialBaggageIsVisible() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.specialBaggage.isVisible();
    }

    async clickAddSpecialBaggage() {
        await this.page.waitForSelector('.upgradeSection #SpecialLuggage__component button');
        await this.page.waitForTimeout(10000);
        const specialbaggageamendbutton = await this.page.$('.upgradeSection #SpecialLuggage__component button');
        await specialbaggageamendbutton.click();
    }

    async petsComponentIsVisible() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('#PetsInfo__component').isVisible();
    }

    async clickAddPets() {
        const petsAmendButton = this.page.locator('.upgradeSection #PetsInfo__component button');
        await petsAmendButton.waitFor({ state: 'visible', timeout: 10000 });
        await petsAmendButton.click();
    }

    async summaryButton() {
        await this.hotelDetailsHeader.waitFor({ state: 'visible', timeout: 15000 });
        await this.hotelDetailsHeader.scrollIntoViewIfNeeded();
        await this.reviewButton.waitFor({ state: 'visible', timeout: 25000 });
        await this.reviewButton.scrollIntoViewIfNeeded();
        await this.reviewButton.click();
    }
}

 