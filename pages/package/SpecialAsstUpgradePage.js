export class SpecialAsstUpgradePage {
  constructor(page) {
    this.page = page;
  }

  async specialAsstComponent() {
    await this.page.waitForLoadState('domcontentloaded');
    return await this.page.locator('#SpecialAssistance__component').isVisible();
  }

  async upgradeSpecialAsst() {
    // Step 1: Click the Amend button
    await this.page.waitForSelector('.upgradeSection #SpecialAssistance__component button', { timeout: 10000 });
    await this.page.click('.upgradeSection #SpecialAssistance__component button');

    // Step 2: Go to amendment page
    await this.page.goto(
      'https://tuiretail-be-sit.tuiad.net/retail/travel/nl/your-account/managemybooking/managespecialassistance',
      { waitUntil: 'networkidle' }
    );

    // Step 3: Expand only ONE passenger accordion (e.g., the first one)
    await this.page.waitForSelector('div[aria-label^="collapsible icon"]', { timeout: 10000 });
    const accordions = await this.page.$$('div[aria-label^="collapsible icon"]');
    if (accordions.length === 0) throw new Error('No passenger accordions found.');

    const firstAccordion = accordions[0];
    await firstAccordion.scrollIntoViewIfNeeded();
    await firstAccordion.click();
    await this.page.waitForTimeout(1000); // Allow drop-down to open

    // Step 4: Wait for checkboxes under that pax section
    // Step 4: Wait for checkboxes to be attached (not necessarily visible)
    await this.page.waitForSelector('input[type="checkbox"]', { state: 'attached', timeout: 10000 });

    const checkboxes = await this.page.$$('input[type="checkbox"]:not(:checked)');
    let selected = false;

    for (const checkbox of checkboxes) {
      if (await checkbox.isVisible()) {
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.check({ force: true });
        selected = true;
        break;
      }
    }

  

    // Step 5: Click Save ("Bewaar")
    const saveBtn = this.page.locator('.SpecialAssistance__buttonContainer button:nth-child(2)');
    await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
  }
}
