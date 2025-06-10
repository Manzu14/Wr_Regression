// const pr = require('promise');

// export class SeatUpgradePage {
//     constructor(page) {
//         this.page = page;
//     }

//     async seatComponent() {
//         await this.page.waitForLoadState('domcontentloaded');
//         return await this.page.locator('#SeatType__component').isVisible();
//     }

//     async upgradeSeat() {
//         // eslint-disable-next-line playwright/no-wait-for-selector
//         const visible = await this.page.waitForSelector('.upgradeSection #SeatType__component button');
//         await visible.isVisible();
//         // eslint-disable-next-line playwright/no-wait-for-selector
//         const seatamendbutton = await this.page.waitForSelector('.upgradeSection #SeatType__component button');
//         await new pr(resolve => setTimeout(resolve, 10000));
//         await seatamendbutton.click();
//     }

//     async selectBaggageOptions() {
//         await this.page.waitForLoadState('domcontentloaded');
//         await new pr(resolve => setTimeout(resolve, 10000));
//         const luggageOptions = await this.page.$$('.Luggage__luggageOptions button');
//         if (luggageOptions.length> 0) {           
//         const randomIndex = Math.floor(Math.random() * luggageOptions.length);
//         console.log('randomIndex---'+ randomIndex);
//         const selectedOption = luggageOptions[randomIndex];
//         console.log('selectedOption---'+ selectedOption);
//         await selectedOption.click();
//         return await this.page.locator('//div[contains(text(),"Bagage")]').isVisible();
//         } else {
//             throw new Error("Language options are not available to add");
//         }
//     }

//     async saveButton() {
//         await this.page.waitForLoadState('domcontentloaded');
//         await this.page.locator('.Luggage__buttonContainer button:nth-child(2)').focus();
//         await this.page.locator('.Luggage__buttonContainer button:nth-child(2)').click();
//     }
// } 
