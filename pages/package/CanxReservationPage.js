import { expect } from '@playwright/test';

export class CanxReservationPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.cancelReservationLink = page.locator("button").filter({
            hasText: /Cancel reservation|Reservering annuleren/i
        });
        this.cancelBookingPopup = page.locator('.CancellationModal__cancellationModal');
        this.cancelConfirmButton = page.locator('button.CancellationModal__actions__confirm');
        
    }

    async cancelReservation() {
        // Step 1: Click "Cancel Reservation" button
        await expect(this.cancelReservationLink).toBeVisible({ timeout: 20000 });
        await this.cancelReservationLink.scrollIntoViewIfNeeded();
        await this.cancelReservationLink.click();

        // Step 2: Wait for confirmation popup
        await expect(this.cancelBookingPopup).toBeVisible({ timeout: 10000 });

        // Step 3: Click "JA, ANNULEER" or "YES, CANCEL" button
        await expect(this.cancelConfirmButton).toBeVisible();
        await this.cancelConfirmButton.click();

        // Optional: wait for confirmation or success message here
        
    }
}
