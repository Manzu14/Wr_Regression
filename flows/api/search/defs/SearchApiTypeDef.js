/**
 * @typedef {Object} Child
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} parentCode
 * @property {boolean} available
 * @property {string} parentType
 * @property {Child[]} children
 */

/**
 * @typedef {Object} Country
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {Child[]} children
 * @property {boolean} available
 */

/**
 * @typedef {Object} CountriesData
 * @property {Country[]} countries
 */

/**
 * @typedef {Object} DateOptions
 * @property {string[]} [when]
 * @property {NightsEnum} [duration]
 * @property {0|3|7|14} [flexibleDays]
 */

/**
 * @typedef {Object} DestinationFilterOptions
 * @property {string[]} [includeAirports]
 * @property {string[]} [excludeAirports]
 * @property {string[]} [includeDestinations]
 * @property {string[]} [excludeDestinations]
 */

/**
 * @typedef {Object} DestinationOptions
 * @property {DateOptions} [dateOptions]
 * @property {string[]} [airportOptions]
 * @property {string[]} [destinationOptions]
 * @property {DestinationFilterOptions} [filter]
 */
