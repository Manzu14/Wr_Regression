import { logger } from '../../utils/reporters/logger';

export class I18nMessages {
    /**
     * @param {import('@playwright/test').Page} page
     */
    async extractI18nMessages(page) {
        await page.waitForLoadState('load');
        // eslint-disable-next-line playwright/no-eval
        const scripts = await page.$$eval('script', scripts => scripts.map(script => script.innerHTML));
        for (const script of scripts) {
            const match = /i18nMessages\s*=\s*'([^']+)'/.exec(script);
            if (match) {
                try {
                    return JSON.parse(match[1]);
                } catch (e) {
                    logger.error(`Failed to parse i18nMessages JSON: \n${JSON.stringify(e, null, 4)}`);
                }
            }
        }
        return {};
    }

    async getPageLanguage(page) {
        return page.evaluate(() => {
            return document.documentElement.getAttribute('lang');
        });
    }
}
