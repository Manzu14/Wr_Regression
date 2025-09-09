import { chromium, firefox, webkit } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { getLoginUrl } from '../../config/test_config';
import { disableCookiesMsg, getContext } from './test';

async function getBrowser() {
    const browserType = process.env.TEST_BROWSER || 'chromium';

    let selectedBrowser;
    if (browserType === 'firefox') {
        selectedBrowser = firefox;
    } else if (browserType === 'webkit') {
        selectedBrowser = webkit;
    } else {
        selectedBrowser = chromium;
    }
    const isHeaded = process.argv.includes('--headed') || process.argv.includes('--ui');
    return await selectedBrowser.launch({
        args: ['--ignore-certificate-errors'],
        headless: !isHeaded,
    });
}

export default async function globalSetup() {
    await Promise.all([saveAuthStage(`./storage/global.json`), saveAuthStage(`./storage/logout.json`)]);
}

async function saveAuthStage(path) {
    const browser = await getBrowser();
    const context = await getContext(browser);
    const page = await context.newPage();
    const url = getLoginUrl();
    await disableCookiesMsg(context, url);
    await page.goto(url);
    await new LoginPage(page).doLogin();
    await page.context().storageState({ path });
    await page.close();
}
