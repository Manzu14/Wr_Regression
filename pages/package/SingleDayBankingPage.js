import { expect } from '@playwright/test';

export class SingleDayBankingPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.warningMessagePopup = page.locator('.info-content.p-xs');
        this.warningMessageCloseIcon = page.locator('button[id="recon-reminder-dialog-close-btn"]');
        this.seodbPageHeaderText = page.locator('.d-flex.align-center.justify-between.mb-xs.mt-sm');
        this.agentDetails = page.locator('.agent-info-detail');
        this.expandToggelButton = page.locator('.toggle-content-button.icon-button span');
        this.paymentTypeTableDetails = page.locator('.table.table-rounded.full-width.payment-type-table');
        this.voucherRowExpand = page.locator('tr[data-testid="voucher-row"]').getByRole('button').locator('span');
        this.integratedCardRowExpand = page.locator('tr[data-testid="integrated-card-row"]').getByRole('button').locator('span');
        this.voucherTableDetails = page.locator('tr[data-testid="voucher-table-row"]');
        this.integratedCardTableDetails = page.locator('tr[data-testid="integrated-card-credit-card-row"]');
        this.expensesText = page.locator('span[data-testid="expenses"]');
        this.voucherText = page.locator('span[data-testid="voucher"]');
        this.integratedCardText = page.locator('span[data-testid="integrated-card"]');
        this.cashText = page.locator('span[data-testid="cash"]');
        this.previousProcessing = page.locator('#previous-recon-link');
        this.differenceValue = page.locator('table[data-testid="reconcile-payment-table"]>tbody>tr:nth-child(1)>td:nth-child(4)');
        this.confirmButton = page.locator('#confirm-btn');
        this.selectReasonError = page.locator('.text-red');
    }

    async closeWrningPopupIfDisplayed() {
        await this.warningMessagePopup.waitFor({ state: 'visible', timeout: 40_000 });
        const isCloseWarningPopupVisible = await this.warningMessagePopup.isVisible();
        if (isCloseWarningPopupVisible) {
            await this.warningMessageCloseIcon.click();
        }
    }

    async validateDifferenceInValue() {
        const getdifferenceValue = await this.differenceValue.textContent();
        const actualDifferenceValue = getdifferenceValue.replace('€', '');
        if (actualDifferenceValue !== '0.00') {
            await this.confirmButton.click();
            await expect(this.selectReasonError).toBeVisible({ timeout: 40_000 });
        }
    }
}
