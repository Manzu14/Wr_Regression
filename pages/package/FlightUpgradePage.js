export class FlightUpgradePage {
    constructor(page) {
        this.page = page;
    }

    async flightComponent() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('#CabinClassUpgrades__component').isVisible();
    }

    async upgradeFlight() {
        await this.page.waitForSelector('.upgradeSection #CabinClassUpgrades__component');
        await this.page.waitForTimeout(10000); // replaced old 'pr' line
        const flightamendbutton = await this.page.$('.upgradeSection #CabinClassUpgrades__component button');
        await flightamendbutton.click();
    }

    async selectFlightOptions() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(5000); // Ensure UI is fully loaded

    const allRadios = await this.page.$$('input[type="radio"]');

    if (allRadios.length === 0) {
        throw new Error('No radio buttons found.');
    }

    const uncheckedRadios = [];
    for (const radio of allRadios) {
        if (!(await radio.isChecked())) {
            uncheckedRadios.push(radio);
        }
    }

    if (uncheckedRadios.length === 0) {
        console.log('All radio buttons are already selected.');
        return false;
    }

    const randomIndex = Math.floor(Math.random() * uncheckedRadios.length);
    const selectedRadio = uncheckedRadios[randomIndex];
    console.log('Selected radio index:', randomIndex);

    try {
        await selectedRadio.scrollIntoViewIfNeeded();
        await selectedRadio.check({ force: true });
        console.log('Radio button selected.');
    } catch (error) {
        console.warn('Direct check failed, trying label fallback...');
        const label = await selectedRadio.evaluateHandle(el => el.closest('label'));
        if (label) {
            await label.scrollIntoViewIfNeeded();
            await label.click();
            console.log('Radio button selected via label.');
        } else {
            throw new Error('Unable to click radio or its label.');
        }
    }

    return true;
}

    async saveButton() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.Commons__buttonContainer button:nth-child(2)').focus();
        await this.page.locator('.Commons__buttonContainer button:nth-child(2)').click();
    }
}
