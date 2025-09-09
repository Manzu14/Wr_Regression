const { SimpleLoginPage } = require('../pages/SimpleLoginPage');
import { expect, test } from './fixures/test';

test.describe('Simple Login Tests', () => {
    test('Login with valid credentials', async ({ page }) => {
        const loginPage = new SimpleLoginPage(page);
        
        await page.goto('https://example.com/login');
        await loginPage.login('testuser@example.com', 'password123');
        
        expect(page.url()).toContain('/dashboard');
    });
});