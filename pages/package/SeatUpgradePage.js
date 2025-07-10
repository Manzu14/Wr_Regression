// export class SeatUpgradePage {
//     constructor(page) {
//         this.page = page;
//     }

//     async seatComponent() {
//         await this.page.waitForLoadState('domcontentloaded');
//         return await this.page.locator('#SpecialLuggage__component').isVisible();
//     }

//     async upgradeSpecialBaggage() {
//         await this.page.waitForSelector('.upgradeSection #SpecialLuggage__component button');
//         await this.page.waitForTimeout(10000); // replaced old 'pr' line
//         const specialbaggageamendbutton = await this.page.$('.upgradeSection #SpecialLuggage__component button');
//         await specialbaggageamendbutton.click();
//     }

//     async selectSpecialBaggageOptions() {
//         await this.page.waitForLoadState('domcontentloaded');
//         await this.page.waitForTimeout(5000); // Wait for luggage UI to fully render

//         const allCheckboxes = await this.page.$$('.SSRSpecialLuggage__luggageOptions input[type="checkbox"]');

//         if (allCheckboxes.length === 0) {
//             throw new Error('No luggage option checkboxes found.');
//         }

//         const unchecked = [];
//         for (const checkbox of allCheckboxes) {
//             if (!(await checkbox.isChecked())) {
//                 unchecked.push(checkbox);
//             }
//         }

//         if (unchecked.length === 0) {
//             console.log('All checkboxes are already selected.');
//             return false;
//         }

//         const randomIndex = Math.floor(Math.random() * unchecked.length);
//         const selectedOption = unchecked[randomIndex];
//         console.log('Selected unchecked checkbox index:', randomIndex);

//         try {
//             const elementHandle = await selectedOption.elementHandle();
//             if (elementHandle) {
//                 await elementHandle.scrollIntoViewIfNeeded();
//                 await selectedOption.check({ force: true });
//             } else {
//                 throw new Error('Element handle not found for selected checkbox');
//             }
//         } catch (err) {
//             console.warn('Direct check failed, using label fallback...');
//             const label = await selectedOption.evaluateHandle(el => el.closest('label'));
//             if (label) {
//                 await label.scrollIntoViewIfNeeded();
//                 await label.click();
//             } else {
//                 throw new Error('Checkbox label not found or clickable.');
//             }
//         }

//         return true; // success
//     }

//     async saveButton() {
//         await this.page.waitForLoadState('domcontentloaded');
//         await this.page.locator('.SSRSpecialLuggage__buttonContainer button:nth-child(2)').focus();
//         await this.page.locator('.SSRSpecialLuggage__buttonContainer button:nth-child(2)').click();
//     }
// }
