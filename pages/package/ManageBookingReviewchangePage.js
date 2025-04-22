export class ManageBookingReviewchangePage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.reviewConfirmPageTableHeader = page.locator('#ReviewConfirmInfoTabular__component');
        this.agentFees = page.locator('//span[contains(text(),"TOESLAGEN")]//following::td[2]//div//span//span//span');
        this.newCost = page.locator('.BookingDetails__totalPriceDetails.new_total');
    }

    async getAgentFees() {
        const getagentFees = await this.agentFees.textContent();
        const actualAgentFees = getagentFees.replace('€', '');
        return actualAgentFees;
    }

    async getnewCost() {
        const newCost = await this.newCost.textContent();
        const actualNewCost = newCost.replace('€', '');
        return actualNewCost;
    }
}
