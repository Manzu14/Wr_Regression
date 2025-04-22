import { isBE, isInhouse, isNL, isThirdParty } from '../../config/test_config';
const { TestDataProvider } = require('../../test-data/TestDataProvider');
const { expect } = require('@playwright/test');

export class BookingHistoryPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.testDataProvider = new TestDataProvider();
        this.manageReservation = page.locator('#DirectDebit__component a[href*="/retail/travel/"]');
        this.bookingHistoryLink = page.getByLabel('booking_history');
        this.bookingVersionList = page.getByLabel('Select');
        this.agentDetailsVersion = page.locator('.UI__createdBy');
        this.agentDetailsBookedBy = page.locator('.UI__onBehalf');
        this.bookingDate = page.locator('.UI__dateAndTime');
        this.productType = page.locator('.UI__tableProductPax tr:nth-of-type(1)').filter({ has: page.locator('td').nth(2) });
        this.allTabHeader = page.locator('.UI__accordionHead');
    }

    async openBookingHistoryPage() {
        await this.manageReservation.click();
        await expect(this.bookingHistoryLink).toBeVisible();
        await this.bookingHistoryLink.click();
    }

    /**
     * this method is used to check if all tab headers for a basic reservation are displayed
     */
    async validateTabHeadersForBasicPackageBooking() {
        const headerTabs = ['HEENVLUCHT', 'ACCOMMODATIE', 'RETOURVLUCHT', 'Prijsoverzicht'];
        const countSections = await this.allTabHeader.count();
        for (let i = 0; i < countSections; i++) {
            const tabText = this.allTabHeader.nth(i);
            await expect(tabText).toHaveText(headerTabs[i], { ignoreCase: true });
        }
    }

    /**
     * this method is used to validate if the agent who performed the booking is either inhouse or third party
     * the agent information is checked in the version section and also in the general info displayed on the page
     */
    async validateAgentDetails() {
        const { username } = await new TestDataProvider().getAuthData();
        if (isThirdParty()) {
            await expect(this.agentDetailsBookedBy).toContainText(` booked by Third Party Agent ${username}`);
            if (isBE()) {
                await expect(this.agentDetailsVersion).toContainText(`Aangemaakt door: 3PA, HERK DE STAD, TUI EXPERT (${username})`);
            } else {
                await expect(this.agentDetailsVersion).toContainText(`3PA, Gouda, d-reizen Gouda Goverwelle (${username})`);
            }
        }
        if (isInhouse()) {
            const userId = await new TestDataProvider().getUserIdDetails();
            const customerservicecenterid = await new TestDataProvider().getCustomerServiceCenterId();
            await expect(this.agentDetailsBookedBy).toContainText('booked by Customer Service Center');
            if (isNL()) {
                await expect(this.agentDetailsVersion).toContainText(
                    `Aangemaakt door: ${userId} (1), CSC, Rijswijk ZH, TUI Customer Services Center (${customerservicecenterid})`,
                );
            } else {
                await expect(this.agentDetailsVersion).toContainText(
                    `Aangemaakt door: ${userId} (8), CSC, Oostende, TUI Customer Services Center (${customerservicecenterid})`,
                );
            }
        }
    }
}
