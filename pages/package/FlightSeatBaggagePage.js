import { expect } from '@playwright/test';
import { logger } from '../../utils/reporters/logger';

export class FlightSeatBaggagePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.flightSeatRadioButtonDeLClass = page.locator('[aria-label="DTBP_DEL_CLASS"] div.View3__bottomContent > div > label > span');
        this.flightSeatRadioButtonComSeat = page.locator('[aria-label="COM_SEAT"] div.UI__radiowrapper.UI__alignElements.UI__leftContent > label > span');
        this.aternativeFlightBaggage = page.locator('.LuggageAncillary__passengerCounter');
        this.extraLuggageInfo = page.locator('div.LuggageAncillary__luggageSummary').nth(1);
        this.passengerLuggageSets = page.locator('div.LuggageAncillary__luggageContainer').locator('div.LuggageAncillary__luggageRow');
    }

    async selectSeatAndBaggage() {
        const seatSelected = await this.aternativeFlightSeatSelection();
        const baggageVisible = (await this.aternativeFlightBaggage.count()) > 0;
        if (seatSelected && baggageVisible) {
            await this.aternativeFlightSeatSelection();
            await this.aternativeFlightBaggageSelection();
        } else if (!seatSelected && baggageVisible) {
            await this.aternativeFlightBaggageSelection();
        }
    }

    async aternativeFlightSeatSelection() {
        if (await this.flightSeatRadioButtonComSeat.isVisible({ timeout: 40_000 })) {
            await this.flightSeatRadioButtonComSeat.click();
            return true;
        } else if (await this.flightSeatRadioButtonDeLClass.isVisible({ timeout: 40_000 })) {
            await this.flightSeatRadioButtonDeLClass.click();
            return true;
        }
        return false;
    }

    async aternativeFlightBaggageSelection() {
        await this.passengerLuggageSets.first().waitFor({ state: 'visible', timeout: 5_000 });
        for await (const passengerLuggageSet of await this.passengerLuggageSets.all()) {
            const informationBeforeLuggageChange = await this.extraLuggageInfo
                .textContent({ timeout: 1_000 })
                .catch(() => null)
                .then(text => text?.trim() ?? '');
            await passengerLuggageSet.locator('div.cards__horizontalAncillaryWrapper').locator('div.cards__priceButton').first().getByRole('button').click();
            await expect(this.extraLuggageInfo).not.toHaveText(informationBeforeLuggageChange);
            logger.info({ before: informationBeforeLuggageChange, after: await this.extraLuggageInfo.textContent() });
        }
    }
}
