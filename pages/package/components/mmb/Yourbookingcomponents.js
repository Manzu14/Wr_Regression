export class YourBookingComponents {
  constructor(page) {
    this.page = page;
    this.reviewButton = page.locator("//div[@class='UI__summaryButton']//button[1]");
  }

  async summaryButton() {
    // Scroll to "Hotel-details" section to make sure Review button comes into view
    const scrollTarget = await this.page.waitForSelector('[aria-label="Hotel-details"] h2', { timeout: 15000 });
    await scrollTarget.scrollIntoViewIfNeeded();

    // Wait for Review button to appear and be clickable
    await this.reviewButton.waitFor({ timeout: 25000 });
    await this.reviewButton.click();
  }
}
