import Logo from './Logo.js';
import MainTextMobile from './mainText_Mobile.js';
import MainTextDesktop from './mainText_Desktop.js';
import InputCity from './inputCity.js';
import LatitudeLongitude from './Latitude&Longitude.js';
import ToggleColorTheme from './ToggleColorTheme.js';

export default class Pom_Manager {
    constructor(page) {
        this.page = page;
        this.logo = new Logo(page);
        this.mainTextMobile = new MainTextMobile(page);
        this.mainTextDesktop = new MainTextDesktop(page);
        this.InputCity = new InputCity(page);
        this.LatitudeLongitude = new LatitudeLongitude(page);
        this.ToggleColorTheme = new ToggleColorTheme(page);
    }
}