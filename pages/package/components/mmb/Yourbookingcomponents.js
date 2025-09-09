export class YourBookingComponents {
    constructor(page) {
        this.page = page;
        this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");
        this.hotelDetailsHeader = page.locator('[aria-label="Hotel-details"] h2');
    }

    async summaryButton() {
        await this.hotelDetailsHeader.waitFor({ state: 'visible', timeout: 40000 });
        await this.hotelDetailsHeader.scrollIntoViewIfNeeded();

        const summarySelectors = [
            "//div[@class='UI__summaryButton']//button[1]",
            ".UI__summaryButton button",
            "button:has-text('Summary')",
            "button:has-text('Samenvatting')",
            ".summary-button",
            "[class*='summary'] button",
            "button[class*='summary']"
        ];

        for (const selector of summarySelectors) {
            try {
                const button = this.page.locator(selector).first();
                await button.waitFor({ state: 'visible', timeout: 5000 });
                await button.scrollIntoViewIfNeeded();
                await button.click();
                return;
            } catch (e) {
                continue;
            }
        }

        // If no summary button found, continue without clicking
        process.stdout.write('⚠️ Summary button not found, continuing...\n');
    }
}
 