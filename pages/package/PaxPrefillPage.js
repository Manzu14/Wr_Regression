import { isNL } from '../../config/test_config';
const { expect } = require('@playwright/test');

export class PaxPrefillPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.myTUIButton = page.getByTestId('crm-button');
        this.inputEmail = page.getByTestId('input-crm-email');
        this.submitEmail = page.getByTestId('link-companions-btn');
        this.checkboxMainTraveler = page.getByTestId('tui-checkbox-input').nth(0);
        this.showMoreLink = page.locator('#customer-account-dialog fieldset:nth-child(1) .passenger-card .passenger-card__content button');
        this.addressDetails = page.getByTestId('expandable-content');
        this.confirmButton = page.getByTestId('customer-account-dialog-confirm-btn');
        this.cancelButton = page.getByTestId('customer-account-dialog-cancel-btn');
        this.customerAccountDialog = page.locator('#customer-account-dialog');
        this.leadPassengerName = page.locator('#customer-account-dialog fieldset:nth-child(1) .passenger-card .passenger-card__content > div:nth-child(1)');
        this.leadPassengerDOB = page.locator('#customer-account-dialog fieldset:nth-child(1) .passenger-card .passenger-card__content > time');
        this.leadPassengerGender = page.locator('#customer-account-dialog fieldset:nth-child(1) .passenger-card .passenger-card__content > div:nth-child(3)');
        this.travelerCompanionTotal = page.locator('#customer-account-dialog fieldset:nth-child(2) .passenger-card .passenger-card__content');
        this.travelerCompanionName = page.locator('#customer-account-dialog fieldset:nth-child(2) .passenger-card .passenger-card__content > div:nth-child(1)');
        this.totalCount = page.locator('#customer-account-dialog fieldset:nth-child(2) > legend > span:nth-child(2)');
        this.selectFirstCompanion = page.locator(
            '#customer-account-dialog > section > div > form > fieldset:nth-child(2) > div > div:nth-child(1) > div > label > span > span',
        );
        this.dialogHeader = page.locator('.dialog__header');
        this.errorMessageText = page.locator('#message');
        this.closeButton = page.getByTestId('customer-account-dialog-close-btn');
        this.nextCustomerLink = page.locator('a[class$=" StandardLink__underlined RetailHeader__utilityNavLinkItem"]').nth(0);
        this.continueButtonInPopUp = page.getByRole('button', { name: 'action close' });
        this.logoutLink = page.locator('a[class$=" StandardLink__underlined RetailHeader__utilityNavLinkItem"]').nth(1);
        this.addressDetailsLeadPassenger = page.locator('[data-testid="lead-passenger-address"] address');
        this.phoneNumber = page.locator('[data-testid="lead-passenger-phone-number"] div:nth-child(2)');
    }

    async provideCustomerEmail(email = this.defaultEmail) {
        await this.myTUIButton.click();
        await this.inputEmail.fill(email);
        await this.submitEmail.click();
    }

    async getAllCompanionTravelerNames(index) {
        const fullName = await this.page
            .locator(`#customer-account-dialog fieldset:nth-child(2) div:nth-child(${index}).passenger-card .passenger-card__content > div:nth-child(1)`)
            .textContent();

        return { firstName: fullName.substring(0, fullName.indexOf(' ')), lastName: fullName.substring(fullName.indexOf(' ') + 1) };
    }

    getAllCompanionTravelerGenders(index) {
        return this.page.locator(`#customer-account-dialog  fieldset:nth-child(2) > div > div:nth-child(${index}) > div > div > div:nth-child(3)`);
    }

    async getAllCompanionTravelerDOB(index) {
        const companionDOB = (
            await this.page.locator(`#customer-account-dialog fieldset:nth-child(2) > div > div:nth-child(${index}) > div > div > time`).textContent()
        ).split('/');
        return { day: companionDOB[0], month: companionDOB[1], year: companionDOB[2] };
    }

    getAllTravelersCheckboxes(index) {
        return this.page.locator(
            `#customer-account-dialog > section > div > form > fieldset:nth-child(2) > div > div:nth-child(${index}) > div > label > span > span`,
        );
    }

    getSelectedCompanions(index) {
        return this.page.locator('div.passenger-card').nth(index).locator('div.flex.align-start').locator('label.input.input-checkbox[data-checked="true"]');
    }

    getUnselectedCompanions(index) {
        return this.page.locator('div.passenger-card').nth(index).locator('div.flex.align-start').locator('label.input.input-checkbox[data-checked="false"]');
    }

    async getLeadPassengerFirstAndLastName() {
        const fullName = await this.leadPassengerName.textContent();
        return { firstNameLead: fullName.substring(0, fullName.indexOf(' ')), lastNameLead: fullName.substring(fullName.indexOf(' ') + 1) };
    }

    async getLeadPassengerDOBData() {
        const fullDOB = (await this.leadPassengerDOB.textContent()).split('/');
        return { day: `${fullDOB[0].padStart(2, '0')}`, month: `${fullDOB[1].padStart(2, '0')}`, year: fullDOB[2] };
    }

    async getLeadPassengerPhoneNumber() {
        const fullNumber = await this.phoneNumber.textContent();
        return { countryCode: fullNumber.substring(0, fullNumber.indexOf(' ')), phoneNumber: fullNumber.substring(fullNumber.indexOf(' ') + 1) };
    }

    async getAddressDetails() {
        const fullAddress = (await this.addressDetailsLeadPassenger.textContent()).split(/\r?\n|\r|\n/g);
        let code, city;
        if (isNL()) {
            const codeAndCity = fullAddress[1].split(' ');
            code = codeAndCity[0] + ' ' + codeAndCity[1];
            city = codeAndCity[2];
        } else {
            code = fullAddress[1].substring(0, fullAddress[1].indexOf(' '));
            city = fullAddress[1].substring(fullAddress[1].indexOf(' ') + 1);
        }
        const regex = /(\d)/;
        const result = fullAddress[0].split(regex);
        return {
            street: result[0].trim(),
            house: result[1].trim(),
            code,
            city,
        };
    }

    async getLeadPassengerInfoMyTUI() {
        return {
            firstNameMainPassenger: (await this.getLeadPassengerFirstAndLastName()).firstNameLead,
            lastNameMainPassenger: (await this.getLeadPassengerFirstAndLastName()).lastNameLead,
            genderMainPassenger: await this.leadPassengerGender.textContent(),
            dayLeadDOB: (await this.getLeadPassengerDOBData()).day,
            monthLeadDOB: (await this.getLeadPassengerDOBData()).month,
            yearLeadDOB: (await this.getLeadPassengerDOBData()).year,
            houseNumber: (await this.getAddressDetails()).house,
            streetName: (await this.getAddressDetails()).street,
            postalCode: (await this.getAddressDetails()).code,
            cityName: (await this.getAddressDetails()).city,
            phoneCountryCode: (await this.getLeadPassengerPhoneNumber()).countryCode,
            mobileNumber: (await this.getLeadPassengerPhoneNumber()).phoneNumber,
        };
    }

    async getCompanionInfoMyTUI(index) {
        return {
            firstNameCompanion: (await this.getAllCompanionTravelerNames(index)).firstName,
            lastNameCompanion: (await this.getAllCompanionTravelerNames(index)).lastName,
            genderCompanion: await this.getAllCompanionTravelerGenders(1).textContent(),
            dayCompanionDOB: (await this.getAllCompanionTravelerDOB(index)).day,
            monthCompanionDOB: (await this.getAllCompanionTravelerDOB(index)).month,
            yearCompanionDOB: (await this.getAllCompanionTravelerDOB(index)).year,
        };
    }

    async selectAllAvailableCompanionsAndCheckTotal(countCompanions) {
        for (let i = 0; i < countCompanions; i++) {
            const checkTraveler = this.getAllTravelersCheckboxes(i + 1);
            await checkTraveler.click();
            await expect(this.totalCount).toContainText(`Totale reisgezelschap: ${i + 2}`);
        }
    }

    async validateAllCompanionsAreAdded(countCompanions) {
        await this.myTUIButton.click();
        for (let i = 0; i < countCompanions; i++) {
            const checkboxStateCompanion = this.getSelectedCompanions(i + 1);
            await expect(checkboxStateCompanion).toBeVisible();
        }
        await this.closeButton.click();
    }

    async validateCustomerInvalidEmail(invalidFormatEmail) {
        await this.provideCustomerEmail(invalidFormatEmail);
        await expect(this.errorMessageText).toBeVisible({ timeout: 5000 });
    }

    async goToNextCustomer() {
        await this.nextCustomerLink.click();
        await this.continueButtonInPopUp.click();
        await this.page.waitForLoadState('load');
        await this.myTUIButton.click();
    }

    async inputCustomerEmailAndCloseModal(email = this.defaultEmail) {
        await this.provideCustomerEmail(email);
        await expect(this.customerAccountDialog).toBeVisible({ timeout: 40000 });
        await this.closeButton.click();
    }

    async myTUISearchAccountAndAddCompanions() {
        await this.provideCustomerEmail();
        await expect(this.customerAccountDialog).toBeVisible({ timeout: 40000 });
        await expect(this.totalCount).toContainText('Totale reisgezelschap: 1');
        const totalCompanions = await this.travelerCompanionTotal.count();
        await this.selectAllAvailableCompanionsAndCheckTotal(totalCompanions);
        await this.confirmButton.click();
        await expect(this.dialogHeader).toBeHidden();
        await this.page.reload();
        await this.validateAllCompanionsAreAdded(totalCompanions);
        await this.myTUIButton.click();
        await expect(this.customerAccountDialog).toBeVisible({ timeout: 40000 });
        await this.showMoreLink.click();
    }

    get defaultEmail() {
        if (isNL()) {
            return 'heather.rison@tui.nl';
        } else {
            return 'automationtuitest@gmail.com';
        }
    }
}
