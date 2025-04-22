/**
 * Component for handling departure airport selection in the search panel
 */
export class DepartureAirportComponent {
    /**
     * @param {import("playwright").Page} page
     */
    constructor(page) {
        this.page = page;
        this.departureAirportInput = page.getByTestId('departureAirportInput');
        this.resetButton = this.departureAirportInput.getByRole('button', { name: 'Reset' });
        this.saveButton = page.getByRole('button', { name: 'Opslaan' });
        this.allAirportsCheckbox = page.getByRole('listitem').filter({ hasText: 'checkboxAlle luchthavens' }).getByLabel('default checkbox');
        this.getAirportCheckbox = airport =>
            page
                .getByRole('listitem')
                .filter({ hasText: `checkbox${airport}` })
                .getByLabel('default checkbox');
    }

    /**
     * @param  {string[]} airports - An array of airport names to select
     */
    async selectAirports(airports = ['all']) {
        await this.departureAirportInput.dblclick({ position: { x: 0, y: 0 } });
        if (airports.includes('all')) {
            return this.selectAllAirports();
        }
        return this.selectAirport(airports);
    }

    /**
     * Selects all airports
     */
    async selectAllAirports() {
        await this.resetButton.click();
        await this.allAirportsCheckbox.click();
        await this.saveButton.click();
    }

    /**
     * Selects a specific airport by name
     * @param {string[]} airportNames - The name of the airport to select
     */
    async selectAirport(airportNames) {
        await this.resetButton.click();
        for (const airport of airportNames) {
            await this.getAirportCheckbox(airport).click();
        }
        await this.saveButton.click();
    }
}
