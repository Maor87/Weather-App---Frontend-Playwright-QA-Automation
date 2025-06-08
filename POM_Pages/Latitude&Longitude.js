import { expect } from '@playwright/test';
import commonActionsRoot from './CommonActions.js';

export default class LatitudeLongitude {
    constructor(page) {
        this.page = page;
        this.commonActions = new commonActionsRoot(page);
    }

    async navigate() {
        await this.commonActions.navigate('https://weather-app-6iqa.onrender.com/');
    }

    async isVisible() {
        await expect(this.actions.getText('.geo-location')).toBeVisible();
    }
}