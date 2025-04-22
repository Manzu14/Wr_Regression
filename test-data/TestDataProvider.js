import { getAgentType, getCountryType } from '../config/test_config';
import { promises as fs } from 'fs';
import { logger } from '../utils/reporters/logger';

export class TestDataProvider {
    constructor() {
        this.country = getCountryType();
        this.agent = getAgentType();
    }

    /**
     * @typedef {Object} Countries
     * @property {string} be
     * @property {string} nl
     * @property {string} ma
     * @property {string} vip
     */

    /**
     * @typedef {Object} AgentAuthData
     * @property {string|Countries} username
     * @property {string} password
     * @property {string} [agentRef]
     * @property {string} [userid]
     * @property {Countries} [switchagentdata]
     * @property {Countries} [customerservicecenterid]
     * @property {Countries} [seodbswitchagentdata]
     */

    /**
     * @private
     * @return {Promise<AgentAuthData|{}>}
     */
    async _getAgentJson() {
        const data = await fs.readFile('test-data/json/authentication.json', 'utf8');
        const testData = JSON.parse(data);
        if (testData) {
            return testData[this.agent];
        } else {
            logger.trace(`Authentication data is not avaliable for ${getAgentType().toUpperCase()} agents.`);
            return {};
        }
    }

    /**
     *
     * @returns {Promise<{ username: string, password: string,[agentRef]:string}>}
     */
    async getAuthData() {
        const { username, password, agentRef } = await this._getAgentJson();
        return { password, agentRef, username: username[this.country] ?? username };
    }

    async getUserIdDetails() {
        const agentData = await this._getAgentJson();
        return agentData?.userid;
    }

    /**
     * @return {Promise<string|null>}
     * @private
     */
    async _getCountryData(key) {
        const data = await this._getAgentJson();
        return data[key]?.[this.country] ?? null;
    }

    async getSwitchAgentData() {
        return this._getCountryData('switchagentdata');
    }

    async getCustomerServiceCenterId() {
        return this._getCountryData('customerservicecenterid');
    }

    async getSeodbSwitchAgentData() {
        return this._getCountryData('seodbswitchagentdata');
    }

    /**
     * @param {"visa", "mastercard"}type
     * @returns {Promise<{cardNumber: string, cardHolderName: string, cardExpiryMonth: string, cardExpirYear: string, cvcCode: string, email: string}>}
     */
    async getPaymentData(type) {
        const data = await fs.readFile('test-data/json/payments.json', 'utf8');
        const testData = JSON.parse(data);
        return testData[type];
    }
}
