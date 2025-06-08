import { test, expect } from '@playwright/test';
import Pom_Manager from '../POM_Manager.js'; 

let pom; 

// Test Suite 1: Logo
test.describe('Logo test', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); // Initialize pom for each test's fresh page context
        await pom.logo.navigate();   
    });

    test('should display the company logo on the homepage', async ({ page }) => {
        const logoLocator = page.locator('.logo');
        await expect(logoLocator).toBeVisible();
        //await page.pause();
    });

    test('logo must have alt text', async ({ page }) => {
        const logoLocator = page.locator('.logo');
        expect(await logoLocator.getAttribute('alt')).toBe('Weather app logo');
        //await page.pause(); 
    });
});

// Test Suite 2: main homepage text looks good for desktop, laptops
test.describe('mainText test', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await pom.mainTextDesktop.navigate(); 
        //await page.pause(); 
    });

    test('Main homepage text looks good and is visible', async ({ page }) => {
        const mainTextLocate = page.locator('.search-title');
        await expect(mainTextLocate).toBeVisible();
        await expect(page).toHaveScreenshot('homepage-main-text-area.png', {
            maxDiffPixelRatio: 0.01,
        });
        //await page.pause();
    });
  });

// Test Suite 3: inputCity - input field, finding weather info for a city
test.describe('inputCity test', () => {
  test.beforeEach(async ({ page }) => {
      pom = new Pom_Manager(page);
      await pom.InputCity.navigate();
      //await page.pause();
  });

  test('input city field accepts valid city names', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('Ramat Gan');// change New York to Ramat Gan for Regression testing
      await searchInputLocator.press('Enter');

      const weatherInfoDisplay = page.locator('.weather-widget');
      await expect(weatherInfoDisplay).toBeVisible();
      await expect(weatherInfoDisplay).toContainText('Ramat Gan');// changed city from New York to Ramat Gan for full Regression testing
     // await page.pause();
  });

  test('submit empty input field and verify that an error message is displayed', async ({ page }) => {
      const searchInputLocator = page.locator('.search');

      await searchInputLocator.fill('');
      await searchInputLocator.press('Enter');
      //await page.pause();
  });

  test('Verify invalid numbers & special characters in input field' , async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('!@#$%');// I also did this with a numbers 123
      await searchInputLocator.press('Enter');
      //await page.pause();
  })

  test('When inputting a city name that does not exist and verify that it does not yield any results' , async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('Nowhere');
      await searchInputLocator.press('Enter');
  })

  // input label - above input city search field
  test('Validate that the label text is correctly spelled and grammatically accurate.', async ({ page }) => {
      const inputLabelLocator = page.locator('label[for="search"]');
      await expect(inputLabelLocator).toBeVisible();
     // await page.pause();
  })

  test('The placeholder text "Ramat Gan" is displayed when the input field is empty.', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await expect(searchInputLocator).toHaveAttribute('placeholder', 'Ramat Gan');
     // await page.pause();
  })

  test('Check that "Ramat Gan" is the default input city result', async ({ page }) => {
    const searchInputLocator = page.locator('.search');
    await expect(searchInputLocator).toHaveAttribute('placeholder', 'Ramat Gan');

    const currentCityDisplayLocator = page.locator('.search');
    await expect(currentCityDisplayLocator).toBeVisible();
    //await expect(currentCityDisplayLocator).toContainText('Ramat Gan');

    const temperatureLocator = page.locator('.weather-widget .temperature');
    const conditionLocator = page.locator('.weather-widget .weather-details');
    const forecastLocator = page.locator('.weather-widget .weather-forecast');

    await expect(temperatureLocator).toBeVisible();
    await expect(temperatureLocator).toHaveText('28');

    await expect(conditionLocator).toBeVisible();
    await expect(conditionLocator).not.toBeEmpty();

    await expect(forecastLocator).toBeVisible();
    await expect(forecastLocator).toContainText(':'); // Check if it contains an expected time
    await expect(forecastLocator.locator('li')).toHaveCount(5);//Check if it has 5 list items 

    const geoLocationSection = page.locator('.geo-location');
    const latitudeLocator = geoLocationSection.locator('span:has-text("latitude:")');
    const longitudeLocator = geoLocationSection.locator('span:has-text("longitude:")');
    const accuracyLocator = geoLocationSection.locator('span:has-text("accurate to:")');

    await expect(geoLocationSection).toBeVisible();
    await expect(latitudeLocator).toBeVisible();
    await expect(latitudeLocator).toHaveText(/latitude:\s*\d{1,3}\.\d+/);

    await expect(longitudeLocator).toBeVisible();
    await expect(longitudeLocator).toHaveText(/longitude:\s*\d{1,3}\.\d+/);

    await expect(accuracyLocator).toBeVisible();
    await expect(accuracyLocator).toHaveText(/accurate to:\s*\d{2}\/\d{2}\/\d{4}\s*at\s*\d{2}:\d{2}/);
    //await page.pause();
  })

  // input label is in place when changing responsive layout for desktop
  test('label is in place when changing responsive layout for desktop', async ({ page }) => {
      await pom.mainTextDesktop.navigate();
      await page.setViewportSize({ width: 861, height: 692 }); // Example common laptop resolution
      const inputLabelLocator = page.locator('label[for="search"]');
      await expect(inputLabelLocator).toBeVisible();
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Check that the weather widget displays the correct city name after entering input', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const currentCityDisplayLocator = page.locator('.weather-widget .weather-location');
      await expect(currentCityDisplayLocator).toBeVisible();
      await expect(currentCityDisplayLocator).toContainText('Ramat Gan');// changing city for full Regression testing
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Check that the country name United States of America is displayed correctly under the city name in weather widget', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const countryLocator = page.locator('.weather-widget .weather-location span');
      await expect(countryLocator).toBeVisible();
      await expect(countryLocator).toContainText('United States of America');
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Confirm that the date and time are displayed correctly under country name in weather widget', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const dateAndTimeLocator = page.locator('.weather-widget .weather-location');
      await expect(dateAndTimeLocator).toBeVisible();
      await expect(dateAndTimeLocator).toContainText('6/8/2025 at');
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Validate that the current temperature is shown clearly and is accompanied by the degree icon in weather widget', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const temperatureLocator = page.locator('.weather-widget .temperature');
      await expect(temperatureLocator).toBeVisible();
      await expect(temperatureLocator).toContainText('28');
      const degreeSymbol = page.locator('h1.temperature .degree-sign');
      await expect(degreeSymbol).toBeVisible();
      //await page.pause();
  });

  // Weather widget (green form box)
  test('Verify weather description is visible and accurately reflects the current weather conditions.In weather widget', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const conditionLocator = page.locator('.weather-widget span.description');
      await expect(conditionLocator).toBeVisible();
      await expect(conditionLocator).toContainText('sunny');
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Verify that the precipitation value is displayed and indicates the current precipitation value.', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const precipitationLocator = page.locator('.weather-widget .precipitation');
      await expect(precipitationLocator).toBeVisible();
      await expect(precipitationLocator).toContainText('0 mm');
      //await page.pause();
  })

  // Weather widget (green form box)
  test('Verify that the humidity percentage is displayed for the current city weather results', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const humidityLocator = page.locator('.weather-widget .humidity');
      await expect(humidityLocator).toBeVisible();
      await expect(humidityLocator).toContainText('%');
      //await page.pause();
  })


  // Weather widget (green form box)
  test('Verify that the wind speed is displayed for the current city weather results', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const windSpeedLocator = page.locator('.weather-widget div.wind');
      await expect(windSpeedLocator).toBeVisible();
      await expect(windSpeedLocator).toContainText('km/h');
      //await page.pause();
  });

  // Weather widget (green form box)
  test('Verify that the hourly forecast displays the correct time and temperature for each hour listed.', async ({ page }) => {
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      const forecastLocator = page.locator('.weather-widget .weather-forecast');
      await expect(forecastLocator).toBeVisible();
      await expect(forecastLocator).toContainText(':'); 
      await expect(forecastLocator.locator('li')).toHaveCount(5);//Check if it has 5 list items 
      //await page.pause();
  });

  // Weather widget (green form box)
  test('Verify desktop responsiveness of weather widget by resizing browser window so all elements remain visible.', async ({ page }) => {
      await pom.InputCity.navigate();
      const searchInputLocator = page.locator('.search');
      await searchInputLocator.fill('New York');
      await searchInputLocator.press('Enter');
      await page.setViewportSize({ width: 648, height: 708 }); // Example common laptop resolution
      await page.setViewportSize({ width: 455, height: 703 });
      await page.setViewportSize({ width: 1048, height: 700 });
      await page.setViewportSize({ width: 1220, height: 701 });
      //await page.pause();
  })
});


// Test Suite 4: Test toggle color theme
test.describe('Test toggle color theme', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await pom.ToggleColorTheme.navigate(); 
       // await page.pause();
    });

    // Moon icon & Sun icon
    test('Verify that toggling the checkbox changes the visual representation from the moon icon to the sun icon & theme color changes', async ({ page }) => {
        const themeToggleCheckBox = page.locator('.container');
        expect(themeToggleCheckBox).toBeVisible();
        const moonIcon = page.locator('.moon');
        const sunIcon = page.locator('.sun');
        await expect(moonIcon).toBeVisible();
        await themeToggleCheckBox.click();
        await expect(sunIcon).toBeVisible();
        await themeToggleCheckBox.click();
        await expect(sunIcon).toBeVisible();
        //await page.pause();
    })

    test('Verify that the toggle is visually distinguishable in both color theme modes', async ({ page }) => {
        const themeToggleCheckBox = page.locator('.container');
        expect(themeToggleCheckBox).toBeVisible();
        const moonIcon = page.locator('.moon');
        const sunIcon = page.locator('.sun');
        await expect(moonIcon).toBeVisible();
        await themeToggleCheckBox.click();
        await expect(sunIcon).toBeVisible();
        await themeToggleCheckBox.click();
        await expect(sunIcon).toBeVisible();
       // await page.pause();
    })

    test('Verify that the toggle color theme is positioned on the upper right side of webpage on desktop layout', async ({ page }) => {
        await page.setViewportSize({ width: 1284, height: 706 }); // Example laptop resolution
        const themeToggleCheckBox = page.locator('.container');
        await expect(themeToggleCheckBox).toBeVisible();
        //await page.pause();
    })
});


// Test Suite 5: Test latitude and longitude
test.describe('Test latitude and longitude', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await pom.LatitudeLongitude.navigate(); 
        //await page.pause();
    });

    // Latitude
    test('Verify that the displayed latitude is correct and matches the expected value.', async ({ page }) => {
        const searchInputLocator = page.locator('.search');
        await searchInputLocator.fill('New York');
        await searchInputLocator.press('Enter');
        const latitudeLocator = page.locator('.geo-location span:has-text("latitude:")');
        await expect(latitudeLocator).toBeVisible();
        const fullLatitudeText = await latitudeLocator.textContent();
        const latitudeMatch = fullLatitudeText.match(/latitude:\s*(\d+\.\d+)/);
        const extractedLatitude = parseFloat(latitudeMatch[1]);

        const expectedLatitudeForNewYork = 40.7128; // New York City's approximate latitude
        await expect(extractedLatitude).toBeCloseTo(expectedLatitudeForNewYork, 4); // Adjust tolerance for precision
        //await page.pause();
    });

    // Longitude
    test('Verify that the displayed longitude is correct and matches the expected value.', async ({ page }) => {
        const searchInputLocator = page.locator('.search');
        await searchInputLocator.fill('New York');
        await searchInputLocator.press('Enter');
        const longitudeLocator = page.locator('.geo-location span:has-text("longitude:")');
        await expect(longitudeLocator).toBeVisible();
        const fullLongitudeText = await longitudeLocator.textContent();
        const longitudeMatch = fullLongitudeText.match(/longitude:\s*(\d+\.\d+)/);
        const extractedLongitude = parseFloat(longitudeMatch[1]);

        const expectedLongitudeForNewYork = -74.0059; // New York City's approximate longitude
        await expect(extractedLongitude).toBeCloseTo(expectedLongitudeForNewYork, 4); // Adjust tolerance for precision
        //await page.pause();
    });

    // Date and Time
    test('Confirm that the accuracy timestamp is correctly formatted and represents a valid date and time.', async ({ page }) => {
        const searchInputLocator = page.locator('.search');
        await searchInputLocator.fill('New York');
        await searchInputLocator.press('Enter');
        const accuracyLocator = page.locator('.geo-location span:has-text("accurate to:")');
        await expect(accuracyLocator).toBeVisible();
        const fullAccuracyText = await accuracyLocator.textContent();
        const accuracyMatch = fullAccuracyText.match(/accurate to:\s*(\d{2}\/\d{2}\/\d{4}\s*at\s*\d{2}:\d{2})/);
        const extractedAccuracy = accuracyMatch[1];

        const expectedAccuracyForNewYork = '08/06/2025 at 17:45'; // New York City's approximate accuracy
        await expect(extractedAccuracy).toBe(expectedAccuracyForNewYork);
        //await page.pause();
    });
  });


// Test Suite 5: Mobile Device Responsive Layout
test.describe('Responsive layout test for mobile devices', () => {
    test.beforeEach(async ({ page }) => {
        pom = new Pom_Manager(page); 
        await page.setViewportSize({ width: 360, height: 740 }); // Samsung Galaxy S8+ viewport
        await pom.mainTextMobile.navigate(); 
        await pom.ToggleColorTheme.navigate();
        //await page.pause();
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
        // await expect(weatherWidgetLocator).toHaveScreenshot('weather-widget-mobile.png', {
        //     maxDiffPixelRatio: 0.01 
        // });
        //await page.pause();
    });

    test('label is in place when changing responsive layout for mobile', async ({ page }) => {
        await pom.mainTextMobile.navigate();
        const inputLabelLocator = page.locator('label[for="search"]');
        await expect(inputLabelLocator).toBeVisible();
        //await page.pause();
    });

    test('Check that the accuracy timestamp is displayed visible in correct position on mobile layout', async ({ page }) => {
        const searchInputLocator = page.locator('.search');
        await searchInputLocator.fill('New York');
        await searchInputLocator.press('Enter');
        const accuracyLocator = page.locator('.geo-location span:has-text("accurate to:")');
        await expect(accuracyLocator).toBeVisible();
        //await page.pause();
    });

    test('Verify that the toggle color theme is positioned on the upper right side of the webpage on mobile layout', async ({ page }) => {
        const themeToggleContainer = page.locator('.container');
        await expect(themeToggleContainer).toBeVisible();
        //await page.pause();
    })
});