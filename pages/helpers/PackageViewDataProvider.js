import { logger } from '../../utils/reporters/logger';

export class PackageViewDataProvider {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * @typedef {Object} PaxViewData
     * @property {number} noOfAdults
     * @property {number} noOfChildren
     * @property {number} noOfInfants
     * @property {number} noOfSeniors
     * @property {number[]} childAges
     * @property {string} paxComposition
     * @property {boolean} isInfantPresent
     * @property {null|Array} passengers
     * @property {string} paxCompositionInsurancePopUp
     */

    /**
     * @typedef RoomViewData
     * @property {string} description
     * @property {number} price
     * @property {string} currencyAppendedPrice
     */

    /**
     * @typedef AccomViewData
     * @property {string} accomCode
     * @property {RoomViewData[]} roomViewData
     * @property {string} accomName
     */

    /**
     * @typedef {Object} PackageViewData
     * @property {PaxViewData} paxViewData
     * @property {AccomViewData[]} accomViewData
     */

    /**
     * @typedef {Object} FullInfo
     * @property {PackageViewData} packageViewData
     */

    /**
     * @return {Promise<FullInfo|{}>}
     */
    async extract() {
        await this.page.waitForLoadState('load');
        // eslint-disable-next-line playwright/no-eval
        const scripts = await this.page.$$eval('script', scripts => scripts.map(script => script.innerHTML));
        for (const script of scripts) {
            if (script.includes('jsonData')) {
                const match = /jsonData\s*=\s*({.*?});/.exec(script);
                if (match) {
                    try {
                        return JSON.parse(match[1]);
                    } catch (e) {
                        logger.error(`Failed to parse Package Information from jsonData:\n${JSON.stringify(e, null, 4)}`);
                    }
                }
            }
        }
        return {};
    }

    /**
     * @returns {Promise<PaxViewData>}
     */
    async getPaxViewData() {
        const fullInfo = await this.extract();
        return fullInfo?.packageViewData?.paxViewData;
    }

    /**
     * @return {Promise<AccomViewData[]>}
     */
    async getAccomViewData() {
        const fullInfo = await this.extract();
        return fullInfo?.packageViewData?.accomViewData;
    }
}
