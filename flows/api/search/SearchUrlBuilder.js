import { DepartureAirportApi } from './DepartureAirportApi';
import { CalendarApi } from './CalendarApi';
import { FlexibleDaysEnum, NightsEnum } from './defs/SearchApiEnumDef';
import { getBaseUrl } from '../../../config/test_config';
import { DestinatioApi } from './DestinatioApi';
import { logger } from '../../../utils/reporters/logger';

const SEPARATOR = '|';

/**
 * @typedef {Object} DepartureOptions
 * @property {number} [flexOptions]
 * @property {number} [dateOptions]
 */

/**
 * @typedef {Object} DepartureDate
 * @property {FlexibleDaysEnum} [flexibleDays]
 */

/**
 * @typedef {Object} DestinationOptions
 * @property {string} [hotelName]
 * @property {CountryEngNamesEnum[]} [countryEngNames]
 */

/**
 * @typedef {Object} SearchOptions
 * @property {DepartureOptions} [departureOptions]
 * @property {DestinationOptions} [destinationOptions]
 * @property {string[]} [airportsOptions]
 * @property {NightsEnum} [duration]
 * @property {DepartureDate} [departureDate]
 */

export class SearchUrlBuilder {
    /**
     *
     * @param {SearchOptions} options
     * @return {Promise<string>}
     */
    static async getSearchUrl(options = {}) {
        const flexOptions = options?.departureOptions?.flexOptions;
        const dateOptions = options?.departureOptions?.dateOptions;
        const airportOptions = options?.airportsOptions;
        const durationOptions =
            typeof options?.duration === 'number' || typeof options?.duration === 'string' ? options.duration.toString() : NightsEnum.SEVEN_NIGHTS;
        const destinationOptions = options?.destinationOptions;

        const apiOptions = { airportOptions, flexOptions, dateOptions, durationOptions, destinationOptions };
        const airports = await new DepartureAirportApi(apiOptions).getAvailable();
        const dates = await new CalendarApi(apiOptions).getAvailable({
            airports,
            dateOptions,
        });
        const destinations = await new DestinatioApi(apiOptions).getAvailable({ airports, dates });
        const { noOfAdults, noOfChildren, childrenAge, room } = getRoomAndPaxParams(options);
        const params = new URLSearchParams();
        params.append('duration', durationOptions);
        params.append('flexibility', String(flexOptions !== FlexibleDaysEnum.STRICT));
        params.append('flexibleDays', flexOptions !== undefined ? flexOptions.toString() : FlexibleDaysEnum.SEVEN.toString());
        params.append('when', dates);
        if (airports) params.append('airports[]', airports.join(SEPARATOR));
        if (destinations) params.append('units[]', destinations.join(SEPARATOR));
        params.append('noOfAdults', noOfAdults);
        params.append('noOfChildren', noOfChildren);
        params.append('childrenAge', childrenAge);
        params.append('room', room);
        params.append('searchRequestType', 'ins');
        params.append('searchType', 'search');
        const url = `${getBaseUrl()}/packages?${params.toString()}`;
        logger.info(`Search Result URL: ${url}`);
        return url;
    }
}

function getRoomAndPaxParams({ paxOptions, passengers = [] }) {
    const ROOM_JOIN = '-';
    const CHILD_AGE_JOIN = ',';

    const defaultPassengerParameters = [
        { roomNumber: 1, age: 30 },
        { roomNumber: 1, age: 30 },
    ];

    if (paxOptions) {
        if (paxOptions.passengersOptions && paxOptions.passengersOptions.length > 0) {
            paxOptions.passengersOptions.forEach(p =>
                passengers.push({
                    roomNumber: p.roomId,
                    age: 30,
                }),
            );
        } else {
            passengers = defaultPassengerParameters;
        }
        if (paxOptions.childsOptions && paxOptions.childsOptions.length > 0) {
            paxOptions.childsOptions.forEach(p => passengers.push({ roomNumber: p.roomId, age: p.age }));
        }
    }
    passengers = passengers && passengers?.length > 0 ? passengers : defaultPassengerParameters;

    const adults = passengers.filter(p => p.age >= 18);
    const children = passengers.filter(p => p.age < 18);

    const noOfAdults = adults.length.toString();
    const noOfChildren = children.length.toString();
    const childrenAge = children.map(c => c.age).join(CHILD_AGE_JOIN);

    // If no room numbers are defined (number of passengers <= 9 && "I don't mind" option ticked), return an empty room string
    const hasRoomNumbers = passengers.some(p => p.roomNumber !== undefined);
    if (!hasRoomNumbers) {
        return { noOfAdults, noOfChildren, childrenAge, room: '' };
    }

    const rooms = {};

    passengers.forEach(p => {
        if (!rooms[p.roomNumber]) {
            rooms[p.roomNumber] = { adults: 0, children: 0, childrenAges: [] };
        }
        if (p.age >= 18) {
            rooms[p.roomNumber].adults += 1;
        } else {
            rooms[p.roomNumber].children += 1;
            rooms[p.roomNumber].childrenAges.push(p.age);
        }
    });

    const room = Object.entries(rooms)
        .map(([roomNumber, { adults, children, childrenAges }]) => {
            return `${roomNumber}|${adults}|0|${children}|0|${childrenAges.join(CHILD_AGE_JOIN)}`;
        })
        .join(ROOM_JOIN);

    return {
        noOfAdults,
        noOfChildren,
        childrenAge,
        room,
    };
}
