import { LanguageSelectorModule } from './LanguageSelectorModule';
import { CustomerServiceCenterModule } from './CustomerServiceCenterModule';

export class HeaderComponent {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.wrapper = page.locator('//div[@id="globalHeader__component"]');
        this.customerServiceCenterLink = page.locator('//span[@class="RetailHeader__agencyDisplayFormat"]//div//a');
        this.customerServiceCenterModule = new CustomerServiceCenterModule(page);
        this.languageSelector = page.locator('div.LanguageCountrySelector__countrySwitcher').locator('span.LanguageCountrySelector__languageText');
        this.languageSelectionModule = new LanguageSelectorModule(page);
        this.adminMenuIndicator = page.locator('.MenuItem__megaMenuIndicator');
        this.adminSubMenuLink = page.locator('.MegaMenu__subMenuListLink');
    }

    async agentSwitch(agentNumber) {
        await this.customerServiceCenterLink.click({ timeout: 40_000 });
        await this.customerServiceCenterModule.searchAgent(agentNumber);
        await this.customerServiceCenterModule.selectAgent(agentNumber);
    }

    /**
     * This Method is manily used for Choosing the Language accepts any language which we pass in the parameter
     * @param {'Frans' | 'Néerlandais' } language
     */
    async languageSwitch(language) {
        await this.languageSelector.click();
        await this.languageSelectionModule.selectLanguage(language);
        await this.languageSelectionModule.applySelection();
    }
}
