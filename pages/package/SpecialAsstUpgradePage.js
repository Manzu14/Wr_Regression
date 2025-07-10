export class SpecialAsstUpgradePage {
  constructor(page) {
    this.page = page;
  }

  async specialAsstComponent() {
    await this.page.waitForLoadState('domcontentloaded');
    return await this.page.locator('#SpecialAssistance__component').isVisible();
  }

  async upgradeSpecialAsst() {
    // Click "Amend" button on MMB home
    await this.page.waitForSelector('.upgradeSection #SpecialAssistance__component button', { timeout: 10000 });
    await this.page.click('.upgradeSection #SpecialAssistance__component button');

    // Navigate to special assistance amendment page
    await this.page.goto(
      'https://tuiretail-be-sit.tuiad.net/retail/travel/nl/your-account/managemybooking/managespecialassistance',
      { waitUntil: 'networkidle' }
    );

    // Expand first passenger accordion
    const accordions = await this.page.$$('div[aria-label^="collapsible icon"]');
    if (accordions.length === 0) throw new Error('No passenger accordions found.');
    await accordions[0].click();
    await this.page.waitForTimeout(1000); // wait for animation

    // Click a checkbox via label/span
    const labelCheckboxes = await this.page.$$('label:has(input[type="checkbox"])');

    let clicked = false;
    for (const label of labelCheckboxes) {
      if (await label.isVisible()) {
        await label.click({ force: true });
        clicked = true;
        console.log('✅ Checkbox label clicked');
        break;
      }
    }

    if (!clicked) {
      throw new Error('❌ No visible checkbox label found to click.');
    }

    // Click Save button
    const saveBtn = this.page.locator('.SpecialAssistance__buttonContainer button:nth-child(2)');
    await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    console.log('✅ Save button clicked');

    await this.page.waitForLoadState('networkidle');
  }
}
