import { BaseApi } from './BaseApi';

export class DepartureAirportApi extends BaseApi {
    /**
     * @return {Promise<[{ id, name, available }]>}
     */
    async getAvailable() {
        const { airportOptions } = this.apiOptions;
        const url = this.baseUrl + this.API_TYPE.DEPARTURE_AIRPORT + this.baseParams.toString();
        const resp = await this._fetchApiResponse(url);
        const available = resp.airports.filter(airport => airport.available === true);
        if (airportOptions === undefined || airportOptions.includes('all')) {
            return available.map(airport => airport.id);
        } else {
            return available.filter(airport => airportOptions.includes(airport.name)).map(airport => airport.id);
        }
    }
}
