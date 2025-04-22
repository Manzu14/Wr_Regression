import { BaseApi } from './BaseApi';
import './defs/SearchApiTypeDef';
import { logger } from '../../../utils/reporters/logger';
import jsonpath from 'jsonpath';

const TENERIFE_DESTINATION_ID = 'adfb7755-e65f-4ed1-b239-13393465afba';

export class DestinatioApi extends BaseApi {
    /**
     * @return {Promise<[]>}
     */
    async getAvailable({ airports, dates }) {
        this.baseParams.append('when', dates || '');
        airports?.forEach(id => {
            this.baseParams.append('from[]', id);
        });
        const { hotelName, countryEngNames } = this.apiOptions?.destinationOptions || {};
        if (hotelName) {
            logger.info(`Trying to find suggestions for '${hotelName}' destination keyword`);
            this.baseParams.append('searchKey', hotelName);
            const url = this.baseUrl + this.API_TYPE.SUGGESTED_DESTINATIONS + this.baseParams.toString();
            const allHotels = await this._fetchApiResponse(url).then(response => response.hotels);
            const randomSelection = Math.floor(Math.random() * allHotels.length);
            const destination = allHotels[randomSelection];
            logger.info(`Opening random ${hotelName} out of ${allHotels.length} results: '${destination.name}'`);
            return [`${destination.id}:${destination.type}`];
        } else if (countryEngNames && countryEngNames.length > 0) {
            const includeDestinations = jsonpath.query(countryEngNames, '$[*].id');
            const url = this.baseUrl + this.API_TYPE.ALL_DESTINATIONS + this.baseParams.toString();
            let allCountries = await this._fetchApiResponse(url).then(response => response.countries);
            if (includeDestinations && includeDestinations.length > 0) {
                allCountries = allCountries.filter(country => {
                    return includeDestinations.includes(country.id) && country.available;
                });
            }
            const destinations = [];
            const excludeDestinations = [TENERIFE_DESTINATION_ID];
            function checkAndAdd(item) {
                if (!excludeDestinations.includes(item.id)) {
                    if (!item.children || item.children.length === 0) {
                        destinations.push(item);
                    } else {
                        item.children.forEach(child => checkAndAdd(child));
                    }
                } else {
                    logger.info(`Excluding ${item.name} destination, it's available: ${item.available}`);
                }
            }
            allCountries.forEach(country => checkAndAdd(country));
            return destinations.filter(item => item.available === true).map(destination => `${destination.id}:${destination.type}`);
        }
        return [];
    }
}
