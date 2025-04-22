import { TestDataProvider } from '../test-data/TestDataProvider';
import { isInhouse, isThirdParty, getEnv } from '../config/test_config';

export class LoginPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.abtaIdTextbox = page.locator('#username');
        this.passwordTextbox = page.locator('#password');
        this.loginbutton = page.locator('.buttons__button.buttons__primary.buttons__fill.ThirdPartyLogin__loginButton');
        this.inhouseUserNameTextBox = page.locator('//input[@id="userNameInput"]');
        this.inhousePasswordTextBox = page.locator('//input[@id="passwordInput"]');
        this.inhouseSubmitButton = page.locator('//span[@id="submitButton"]');
        this.abtaRefTextbox = page.locator('//input[@id="agentref"]');
        this.testDataProvider = new TestDataProvider();
    }

    async doLogin() {
        const { username, password, agentRef } = await this.testDataProvider.getAuthData();
        if (isThirdParty()) {
            await this.thirdPartyLogin({ username, password, agentRef });
        } else if (isInhouse()) {
            await this.inHouseLogin({ username, password });
        }
    }

    /**
     * This Method is used to Login the thirdparty page
     * @returns {Promise<void>}
     */
    async thirdPartyLogin({ username, password, agentRef }) {
        await this.abtaIdTextbox.fill(username);
        await this.passwordTextbox.fill(password);
        if (['stng', 'sit'].includes(getEnv())) {
            await this.abtaRefTextbox.fill(agentRef);
        }
        await this.loginbutton.click();
    }

    /**
     * This Method is used to Login the inhouse page
     * @returns {Promise<void>}
     */
    async inHouseLogin({ username, password }) {
        if (await this.inhouseUserNameTextBox.isVisible({ timeout: 10_000 })) {
            await this.inhouseUserNameTextBox.fill(username);
            await this.inhousePasswordTextBox.fill(password);
            await this.inhouseSubmitButton.click();
        }
        const url = this.page.url();
        await this.page.goto(url);
    }
}
