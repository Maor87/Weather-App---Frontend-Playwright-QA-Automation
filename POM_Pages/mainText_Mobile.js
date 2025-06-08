import { expect } from '@playwright/test';
import commonActionsRoot from './CommonActions.js';

export default class MainTextMobile {
    constructor(page) {
        this.actions = new commonActionsRoot(page);
    }

    async navigate(){
        await this.actions.navigate('https://weather-app-6iqa.onrender.com/');
    }

    async isVisible() {
        await expect(this.actions.getText('.search-title')).toBeVisible();
    }
}

