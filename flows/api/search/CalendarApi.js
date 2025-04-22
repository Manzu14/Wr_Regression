import { BaseApi } from './BaseApi';
import crypto from 'crypto';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const DATE_TEMPLATE = 'DD-MM-YYYY';

export class CalendarApi extends BaseApi {
    /**
     * @param {Object} options
     * @param {string[]} options.airports
     * @param {number|dayjs|undefined} options.dateOptions
     * @return {Promise<string>}
     */
    async getAvailable({ airports, dateOptions }) {
        airports?.forEach(id => {
            this.baseParams.append('from[]', id);
        });
        const url = this.baseUrl + this.API_TYPE.CALENDAR + this.baseParams.toString();
        const availabileDates = await this._fetchApiResponse(url).then(result => result.availableDates);
        if (!dateOptions) {
            const randomIndex = crypto.randomInt(0, availabileDates.length);
            return availabileDates[randomIndex];
        }

        const targetDate = typeof dateOptions === 'number' ? dayjs().add(dateOptions, 'days').format(DATE_TEMPLATE) : dateOptions;
        if (availabileDates.includes(targetDate)) {
            return targetDate;
        } else {
            const strings = availabileDates.filter(date => dayjs(date, DATE_TEMPLATE).isSameOrAfter(dayjs(targetDate, DATE_TEMPLATE)));
            return strings[0];
        }
    }
}
