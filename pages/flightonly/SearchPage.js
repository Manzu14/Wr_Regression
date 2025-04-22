import { expect } from '@playwright/test';
import { FlightOnlySearchResultPage } from './SearchResultPage';
import { isBE, isNL, isMA } from '../../config/test_config';
export class FlightOnlySearchPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.flightSearchPanel = page.locator('#flightSearchBar');
        this.allAirportList = page.locator('#all_nearby_airports');
        this.departureAirportTextBox = page.locator('#searchbar > div > div:nth-child(2) > label > div');
        this.destinationAirportTextBox = page.locator('#searchbar > div> div:nth-child(3) > label > div');
        this.departingInputBox = page.locator('#searchbar > div > div:nth-child(4) > label > div');
        this.returnDateBox = page.locator('#searchbar > div > div:nth-child(5) > label > div');
        this.returndatedisable = page.locator('#searchbar > div> div:nth-child(5) > label.input__82ff5 inputText__82ff5 inputText__2ab3e disabled__82ff5');
        this.selectAvailableDateFromCalender = page.locator('div[class="day__7cc2e entry__7cc2e available__7cc2e"]');
        this.travellerInputBox = page.locator('#searchbar > div > div:nth-child(6) > label > div');
        this.searchButton = page.locator('#searchButton');
        this.noOfAdultsDropdownBySelect = page.locator('#travelPartySelectAdults');
        this.noOfChildrenDropDownBySelect = page.locator('#travelPartySelectChildren');
        this.selectAirport = page.locator('#airportList > div > label');
        this.nextDateSelectionArrow = page.locator('#selectBox-next');
    }

    async selectFirstDepartureAirport() {
        await this.departureAirportTextBox.click();
        await this.allAirportList.click();
    }

    /**  This function is to used to enter the destination wrt to country
     Because mostly flights are available to continue.
     * @param destArptBE - name of destination airport for Belgium market
     * @param destArptNL - code of destination airport for Netherlands market
     * @param destArptMA - code of destination airport for Marocco market
     */
    async selectFirstDestinationAirport(destArptBE = 'Alicante', destArptNL = 'CUN', destArptMA = 'Bruxelles') {
        await this.destinationAirportTextBox.click();
        if (isNL()) {
            await this.destinationAirportTextBox.fill(destArptNL);
        }
        if (isBE()) {
            await this.destinationAirportTextBox.fill(destArptBE);
        }
        if (isMA()) {
            await this.destinationAirportTextBox.fill(destArptMA);
        }
        await this.selectAirport.last().click();
    }

    async selectDepartingDate() {
        await this.departingInputBox.click();
        await this.nextDateSelectionArrow.click();
        await expect(this.selectAvailableDateFromCalender.first()).toBeVisible();
        const availabelDepartingDate = this.selectAvailableDateFromCalender;
        await availabelDepartingDate.first().click();
    }

    async selectReturningDate() {
        if ((await this.returndatedisable.count()) === 0) {
            await this.returnDateBox.click();
            await expect(this.selectAvailableDateFromCalender.first()).toBeVisible();
            await this.selectAvailableDateFromCalender.last().click();
        }
    }

    async selectTravellers(noOfAdults, noOfChilds) {
        await this.travellerInputBox.click();
        await this.noOfAdultsDropdownBySelect.selectOption(noOfAdults);
        await this.noOfChildrenDropDownBySelect.selectOption(noOfChilds);
    }

    async clickOnSearchButton() {
        await this.searchButton.click();
        return new FlightOnlySearchResultPage(this.page);
    }
}
