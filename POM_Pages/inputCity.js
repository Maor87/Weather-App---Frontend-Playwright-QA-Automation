import { expect } from '@playwright/test';
import commonActionsRoot from './CommonActions.js';

export default class InputCity {
    constructor(page) {
        this.page = page;
        this.actions = new commonActionsRoot(this.page);
    }

    async navigate(){
        await this.actions.navigate('https://weather-app-6iqa.onrender.com/');

        //  input city field accepts valid city names,  This helps ensure most page resources (JS, CSS, images) have loaded.
        // await this.page.waitForLoadState('networkidle', { timeout: 30000 }); // Wait up to 30 seconds
        // await this.page.waitForSelector('.search', { state: 'visible', timeout: 20000 }); // Wait for the search input
        // await this.page.waitForSelector('button[type="submit"][aria-label="Check weather"]', { state: 'visible', timeout: 20000 }); // Wait specifically for the button
    }

    async isVisible() {
        await expect(this.page.locator('.search')).toBeVisible();
    }
}