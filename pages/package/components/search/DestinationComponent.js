import { logger } from '../../../../utils/reporters/logger';
import { expect } from '@playwright/test';
import { getLanguage } from '../../../../config/test_config';

/**
 * Component for handling destination selection in the search panel
 */
export class DestinationComponent {
    /**
     * @param {import("playwright").Page} page
     */
    constructor(page) {
        this.page = page;
        this.suggestions = page.getByTestId('suggestion-options-button');
        this.destinationInput = page.getByTestId('destination-placeholder');
        this.resetButton = page.getByTestId('undefinedInput').getByRole('button', { name: 'Reset' });
        this.hotelSuggestionResults = page.locator('div.suggestionWrapper').locator('div.header').filter({ hasText: 'HOTELS' });
        this.namedCountryCheckbox = countryName => page.locator('label').filter({ hasText: countryName }).getByLabel('default checkbox');
        this.confirmBtn = page.getByRole('button', { name: 'Opslaan' });
    }

    /**
     * Selects a specific destination by name
     * @param {object} destination - The name of the destination to select
     */
    async selectDestination(destination) {
        if (destination?.hotelName) {
            return this._selectRandomSuggestedHotel(destination.hotelName);
        } else if (destination?.countryEngNames) {
            return this._selectCountries(destination?.countryEngNames);
        } else if (!destination) {
            logger.info(`No destination was set as search parameter`);
        } else {
            logger.warn(`Destination '${JSON.stringify(destination, null, 4)}' is not supported`);
        }
    }

    async _selectRandomSuggestedHotel(hotelName) {
        await this.destinationInput.click();
        await this.destinationInput.fill(hotelName);
        await expect(this.hotelSuggestionResults).toBeVisible();
        const randomIndex = Math.floor(Math.random() * (await this.suggestions.count()));
        await this.suggestions.nth(randomIndex).click();
    }

    async _selectCountries(countryEngNames) {
        await this.resetButton.click();
        for await (const countryEngName of countryEngNames) {
            const countryTranslations = countryEngName?.translation;
            const countryLocalizedName = countryTranslations[getLanguage()];
            logger.info(`Selecting '${countryLocalizedName}' from the list of destination search criterias:\n'${JSON.stringify(countryEngNames, null, 4)}'`);
            await this.namedCountryCheckbox(countryLocalizedName)
                .click()
                .catch(e => {
                    logger.error(`Unable to click on ${countryLocalizedName} in the list due to the following error:`);
                    throw new Error(e);
                });
        }
        await this.confirmBtn.click();
    }
}
