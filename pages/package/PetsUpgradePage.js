export class PetsUpgradePage {
    constructor(page) {
        this.page = page;
    }

    async petsComponent() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.locator('#PetsInfo__component').isVisible();
    }

    async upgradePets() {
        await this.page.waitForSelector('.upgradeSection #PetsInfo__component button');
        await this.page.waitForTimeout(10000); // replaced old 'pr' line
        const petsamendbutton = await this.page.$('.upgradeSection #PetsInfo__component button');
        await petsamendbutton.click();
    }

   async selectPetsOptions() {
  // Wait for the pets modal to be visible
  await this.page.waitForSelector('.SSRPets__actualContent', { timeout: 10000 });

  // Wait for checkboxes rendered as role="checkbox" (not <input>)
  await this.page.waitForSelector('.SSRPets__petOptions [role="checkbox"]', {
    timeout: 10000,
    state: 'attached',
  });

  const allCheckboxes = await this.page.$$('.SSRPets__petOptions [role="checkbox"]');

  if (allCheckboxes.length === 0) {
    const html = await this.page.content();
    console.log('⚠️ DOM Snapshot:', html.slice(0, 2000));
    throw new Error('❌ No pets option checkboxes found (role="checkbox").');
  }

  // Select the first unchecked checkbox
  for (const checkbox of allCheckboxes) {
    const isChecked = await checkbox.getAttribute('aria-checked');
    if (isChecked === 'false') {
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click({ force: true });
      console.log('✅ Clicked a pet option checkbox (role)');
      return true;
    }
  }

  console.log('ℹ️ All role="checkbox" options are already selected.');
  return false;
}



    async saveButton() {
  const keepButton = this.page.locator('.SSRPets__buttonContainer button:nth-child(2)');
  await keepButton.waitFor({ state: 'visible', timeout: 10000 });
  await keepButton.focus();
  await keepButton.click();
  console.log('✅ Keep button clicked');
}

}