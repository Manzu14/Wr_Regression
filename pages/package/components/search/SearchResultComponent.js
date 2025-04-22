/**
 * Component for handling search results
 */
export class SearchResultComponent {
    /**
     * @param {import("playwright").Page} page
     */
    constructor(page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Zoeken' });
    }

    /**
     * Clicks the search button
     */
    async clickSearch() {
        await this.searchButton.click();
    }
}
