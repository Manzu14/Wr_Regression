import { expect } from '@playwright/test';

export class HotelUpgradePage {
    constructor(page) {
        this.page = page;

        // ✅ Locators
        this.changeHotelLink = page.locator('a[aria-label="Change Hotel Link"] span:first-of-type');
        this.changeHotelPopup = page.locator('.ChangeHotelModal__cancellationModal');
        this.continuePopupButton = page.locator('button.ChangeHotelModal__actions__confirm');
        this.searchResultsList = page.locator('.SearchResults__searchResultsLists');
       
        this.availableHotelButton = page.locator('.SearchResults__searchResultsLists .buttons__button.buttons__primary.buttons__fill');
        this.bookNowButton = page.locator('.ProgressbarNavigation__summaryButton button');
    }

    async changeHotel() {
        // Step 1: Click "Change Hotel"
        await expect(this.changeHotelLink).toBeVisible({ timeout: 20000 });
        await this.changeHotelLink.scrollIntoViewIfNeeded();
        await this.changeHotelLink.click();

        // Step 2: Wait for modal and click "Continue"
        await expect(this.changeHotelPopup).toBeVisible({ timeout: 10000 });
        await this.continuePopupButton.click();

        // Step 3: Wait for hotel search results
        await this.page.waitForURL(/changehotel\/results/, { timeout: 30000 });
        await expect(this.searchResultsList).toBeVisible({ timeout: 10000 });

        // Step 4: Click first visible and enabled hotel "CONTINUE" button
        const hotelButtons = this.availableHotelButton;
        const count = await hotelButtons.count();
        let clicked = false;

        for (let i = 0; i < count; i++) {
            const button = hotelButtons.nth(i);
            if (await button.isVisible() && await button.isEnabled()) {
                await button.scrollIntoViewIfNeeded();
                await button.click();
                console.log(`✅ Clicked hotel button at index ${i}`);
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            throw new Error('❌ No clickable hotel "CONTINUE" button found.');
        }

        // Step 5: Click "Book Now"
        await this.page.waitForURL(/bookaccommodation/, { timeout: 30000 });
        await expect(this.bookNowButton).toBeVisible({ timeout: 10000 });
        await this.bookNowButton.click();

        // Step 6: Wait for "reviewChanges" page
        await this.page.waitForURL(/reviewChanges/, { timeout: 15000 });
    }
}
