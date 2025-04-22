import { getCountryType } from '../../../config/test_config';
import { request } from '@playwright/test';
import { logger } from '../../../utils/reporters/logger';

export class BaseApi {
    API_TYPE = Object.freeze({
        ALL_DESTINATIONS: 'all-destinations?',
        SUGGESTED_DESTINATIONS: 'suggestions?',
        CALENDAR: 'calendar?',
        DEPARTURE_AIRPORT: 'departureairport?',
    });

    constructor(apiOptions) {
        this.apiOptions = apiOptions;
        this.baseUrl = 'https://mwa-nonprod.tui.com/search/mwa/package-searchpanel-mfe/api/v1.0/';
        this.baseParams = new URLSearchParams();
        const market = getCountryType().toLowerCase();
        this.baseParams.append('market', this._getMarketParam(market));
        this.baseParams.append('language', this._getLanguageParam(market));
        this.baseParams.append('duration', apiOptions.durationOptions || '7');
        this.baseParams.append('flexibleDays', apiOptions.flexOptions || '3');
    }

    /**
     * @protected
     * @return {Promise<object>}
     */
    async _fetchApiResponse(url) {
        logger.info(`Fetching API response from: ${url}`);
        const apiContext = await request.newContext();
        const response = await apiContext.get(url);
        return response.json();
    }

    /**
     * @private
     * @param market
     * @return {string}
     */
    _getMarketParam(market) {
        return market === 'nl' ? 'nl' : 'be';
    }
    /**
     * @private
     * @param market
     * @return {string}
     */

    _getLanguageParam(market) {
        return market === 'nl' ? 'nl-NL' : 'nl-BE';
    }
}
