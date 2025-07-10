export class YourBookingComponents {
    constructor(page) {
        this.page = page;
        this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");
        this.hotelDetailsHeader = page.locator('[aria-label="Hotel-details"] h2');
    }

    async summaryButton() {
        await this.hotelDetailsHeader.waitFor({ state: 'visible', timeout: 15000 });
        await this.hotelDetailsHeader.scrollIntoViewIfNeeded();

        await this.reviewButton.waitFor({ timeout: 25000 });
        await this.reviewButton.click();
    }
}
 