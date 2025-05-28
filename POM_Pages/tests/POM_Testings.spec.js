import { test, expect } from '@playwright/test';
import Pom_Manager from '../POM_Manager.js'; 

let pom; 

// Test Suite 1: Logo
test.describe('Logo test', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); // Initialize pom for each test's fresh page context
        await pom.logo.navigate();   
        await page.pause(); 
    });

    test('should display the company logo on the homepage', async ({ page }) => {
        const logoLocator = page.locator('.logo');
        await expect(logoLocator).toBeVisible();
    });

    test('logo must have alt text', async ({ page }) => {
        const logoLocator = page.locator('.logo');
        expect(await logoLocator.getAttribute('alt')).toBe('Weather app logo');
        await page.pause(); 
    });
});

// Test Suite 2: inputCity - input field, finding weather info for a city
test.describe.only('inputCity test', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await pom.InputCity.navigate(); 
        await page.pause(); 
    });

    test('input city field accepts valid city names', async ({ page }) => {
        // Use pom.InputCity.actions.fill for filling the input field
        await pom.InputCity.actions.fill('.search', 'New York');
        await page.waitForSelector('button:has-text("Check")', { state: 'visible' }); // Wait for the button to be DOM 
        await page.getByRole('button', { name: 'Check' }).click();
    });
});

// Test Suite 3: Mobile Device Responsive Layout
test.describe('Responsive layout test for mobile devices', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await page.setViewportSize({ width: 360, height: 740 }); // Samsung Galaxy S8+ viewport
        await pom.mainTextMobile.navigate(); 
        await page.pause();
    });

    test('Main homepage text on mobile devices looks good and is visible', async ({ page }) => {
        const mainTextLocator = page.locator('.search-title');
        await expect(mainTextLocator).toBeVisible();
        await expect(page).toHaveScreenshot('homepage-mobile-main-text-area.png', {
            maxDiffPixelRatio: 0.02,
            mask: [page.locator('.dynamic-timestamp-element')],
        });
    });

    test('Weather widget on mobile devices looks good and is visible', async ({ page }) => {
        const weatherWidgetLocator = page.locator('.weather-widget');
        await expect(weatherWidgetLocator).toBeVisible(); 
        await expect(weatherWidgetLocator).toHaveScreenshot('weather-widget-mobile.png', {
            maxDiffPixelRatio: 0.01 
        });
        await page.pause(); 
    });
});