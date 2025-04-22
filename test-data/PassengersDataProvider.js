import { getCountryType } from '../config/test_config';
// eslint-disable-next-line import/no-unresolved
import { faker as be } from '@faker-js/faker/locale/nl_BE';
// eslint-disable-next-line import/no-unresolved
import { faker as nl } from '@faker-js/faker/locale/nl';
// eslint-disable-next-line import/no-unresolved
import { faker as fr } from '@faker-js/faker/locale/fr';

const fakerMap = {
    nl,
    be,
    vip: be,
    fr,
    ma: fr,
};

const countryPhoneCodeMap = {
    be: '+32',
    vip: '+32',
    nl: '+31',
    fr: '+33',
    ma: '+212',
};

export class PassengersDataProvider {
    constructor() {
        this.marketType = getCountryType();
        this.countryFaker = fakerMap[this.marketType];
    }

    get postalCode() {
        return this.countryFaker.location.zipCode();
    }

    get phoneNumber() {
        const number = this.countryFaker.string.numeric({ allowLeadingZeros: false, length: 9 });
        const code = countryPhoneCodeMap[this.marketType];
        return { code, number };
    }

    /**
     * @typedef {Object} PhoneNumber
     * @property {string} code - The country code for the phone number.
     * @property {string} number - The phone number.
     */

    /**
     * @typedef {Object} Birthdate
     * @property {string} day - The day of birth.
     * @property {string} month - The month of birth.
     * @property {string} year - The year of birth.
     */

    /**
     * @typedef {Object} Address
     * @property {string} streetName - The street name.
     * @property {string} buildingNumber - The building number.
     * @property {string} city - The city.
     * @property {string} state - The state or province.
     * @property {string} country - The country code (e.g., "BE" for Belgium).
     * @property {string} postalCode - The postal code.
     */

    /**
     * @typedef {Object} User
     * @property {string} email - The email address of the user.
     * @property {PhoneNumber} phoneNumber - The phone number details.
     * @property {string} sex - The gender of the person.
     * @property {string} name - The first name of the person.
     * @property {string} surname - The surname of the person.
     * @property {Birthdate} birthdate - The birthdate of the person.
     * @property {Address} address - The address details.
     */

    /**
     * Function that returns a user object.
     * @param {import('dayjs').Dayjs} birthDate - birthdate of the user. If null, a random birthdate will be generated.
     * @returns {User} The user object.
     */
    getPassanger(birthDate) {
        const sex = this.countryFaker.person.sexType();
        return {
            email: this.countryFaker.internet.email(),
            phoneNumber: this.phoneNumber,
            sex: sex.toString().toUpperCase(),
            name: this.countryFaker.person.firstName(sex),
            surname: this.countryFaker.person.lastName(sex),
            birthdate: {
                day: birthDate.date().toString(),
                month: (birthDate.month() + 1).toString(),
                year: birthDate.year().toString(),
            },
            address: {
                streetName: this.countryFaker.location.street(),
                buildingNumber: this.countryFaker.location.buildingNumber(),
                city: this.countryFaker.location.city(),
                state: this.countryFaker.location.state(),
                country: this.marketType === 'vip' ? 'BE' : this.marketType.toUpperCase(),
                postalCode: this.postalCode,
            },
        };
    }

    /**
     * Function that returns a user object without date of birth.
     * @returns {User} The user object.
     */
    getPassengerWithoutDOB() {
        const sex = this.countryFaker.person.sexType();
        return {
            email: this.countryFaker.internet.email(),
            phoneNumber: this.phoneNumber,
            sex: sex.toString().toUpperCase(),
            name: this.countryFaker.person.firstName(sex),
            surname: this.countryFaker.person.lastName(sex),
            address: {
                streetName: this.countryFaker.location.street(),
                buildingNumber: this.countryFaker.location.buildingNumber(),
                city: this.countryFaker.location.city(),
                state: this.countryFaker.location.state(),
                country: this.marketType === 'vip' ? 'BE' : this.marketType.toUpperCase(),
                postalCode: this.postalCode,
            },
        };
    }
}
