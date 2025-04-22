import { isPackage } from '../../config/test_config';

const { getLoginUrl, getEnv, getCountryType, getAgentType, isInhouse, isVip } = require('../../config/test_config');
const { CI_JOB_ID, TAG } = process.env;
import { TestDataProvider } from '../../test-data/TestDataProvider';
import path from 'path';
import fs from 'fs';
import { toConfirmationPage, createBookingWithFutureDates } from '../../flows/navigate';
import { LoginPage } from '../../pages/LoginPage';
const base = require('@playwright/test');

/**
 * @type {base.TestType<base.PlaywrightTestArgs & base.PlaywrightTestOptions, base.PlaywrightWorkerArgs & base.PlaywrightWorkerOptions>}
 */
export const test = base.test.extend({
    page: async ({ browser }, use) => {
        const context = await getContext(browser);
        const basePage = await context.newPage();
        const url = getLoginUrl();
        await disableCookiesMsg(context, url);
        await basePage.goto(url);
        await new LoginPage(basePage).doLogin();
        await basePage.waitForLoadState('domcontentloaded');
        let newUrl = basePage.url();
        if (isPackage() && newUrl.includes('flight')) {
            newUrl = newUrl.replaceAll('/flight', '');
        } else if (!isPackage() && isInhouse() && !newUrl.includes('flight')) {
            newUrl = newUrl + '/flight';
        } else if (!isPackage() && !isInhouse() && newUrl.includes('fr')) {
            newUrl = newUrl.replaceAll('/fr', '/flight');
        }
        await basePage.goto(newUrl);
        await use(basePage);
        await basePage.close();
    },
    beforeEachTest: [
        async ({}, use, testInfo) => {
            const countryType = getCountryType();
            const agentType = getAgentType();

            testInfo.annotations.push({ type: 'agent', description: agentType });
            testInfo.annotations.push({ type: 'country', description: countryType });
            testInfo.annotations.push({ type: 'env', description: getEnv() });
            testInfo.annotations.push({ type: 'jobId', description: CI_JOB_ID });
            testInfo.annotations.push({ type: 'tag', description: TAG });

            base.test.skip(isVip() && isInhouse(), `VIP market is not available for InHouse agent type`);
            await use();
        },
        { auto: true, scope: 'test' },
    ],
    sharedBookingState: async ({ page, browser }, use, testInfo) => {
        await handleBookingState(page, browser, use, testInfo, toConfirmationPage);
    },

    reusedFutureBooking: async ({ page, browser }, use, testInfo) => {
        await handleBookingState(page, browser, use, testInfo, createBookingWithFutureDates);
    },
});

export async function handleBookingState(page, browser, use, testInfo, bookingFunction) {
    const sharedFilePath = path.join('storage', `${path.basename(testInfo.file)}${process.ppid.toString()}.json`);
    if (!fs.existsSync(sharedFilePath)) {
        const { bookingRefernceNumber } = await bookingFunction(page);
        await page.context().storageState({ path: sharedFilePath });
        const data = fs.readFileSync(sharedFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.testData = { bookingRefernceNumber, url: page.url() };
        fs.writeFileSync(sharedFilePath, JSON.stringify(jsonData, null, 4), 'utf-8');
        await page.close();
    }
    const data = fs.readFileSync(sharedFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const { url, bookingRefernceNumber } = jsonData.testData;
    const newContext = await getContext(browser, sharedFilePath);
    const newPage = await newContext.newPage();
    await newPage.goto(url);
    await use({ page: newPage, bookingRefernceNumber });
    await newPage.close();
}

/** @type {base.Expect<{}>} */
exports.expect = base.expect;

/**
 * Checks if any of the strings in the array match the skip pattern.
 *
 * @param {string[]} strings - The array of tag strings.
 * @returns {boolean} - `true` if any tag matches the skip pattern, otherwise `false`.
 */
function hasSkipTag(strings) {
    const pattern = /^@skip_.*$/;
    return strings.some(str => pattern.test(str));
}

/**
 * Creates a new browser context with authentication if necessary based on the environment settings.
 *
 * @param {import('@playwright/test').Browser} browser - The Playwright browser instance.
 * @param state
 * @returns {Promise<import('@playwright/test').BrowserContext>} - The new browser context.
 */
export async function getContext(browser, state = null) {
    if (isInhouse()) {
        const { username, password } = await new TestDataProvider().getAuthData();
        const options = {
            httpCredentials: {
                username,
                password,
            },
            ...(state !== null && { storageState: state }),
        };
        if (isPackage()) options.userAgent = 'incognito';
        return browser.newContext(options);
    }
    return browser.newContext(state !== null ? { storageState: state } : {});
}

/**
 * Adds a cookie to disable the cookies consent message.
 *
 * @param {import('@playwright/test').BrowserContext} context - The browser context to add the cookie to.
 * @param {string} url - The base URL of the application.
 * @returns {Promise<void>}
 */
export async function disableCookiesMsg(context, url) {
    const domain = new URL(url).hostname;
    await context.addCookies([
        {
            name: 'CONSENTMGR',
            value: 'consent:true%7Cts' + Date.now(),
            path: '/',
            expires: -1,
            domain,
        },
    ]);
}
