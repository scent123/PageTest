import { initAppLauncher, initWindowControls } from "./windowControls.js";
import { initFinder } from "./finder.js";
import { initCalculator } from "./calculator.js";
import { initDock } from "./dock.js";
import { initWeather } from "./weather.js"

// random background images
function initRandomBackground() {
    const bgImage = document.querySelector(".background-image");
    if (!bgImage) return;

    const images = [
        "./images/background_1.jpg",
        "./images/background_2.jpg",
        "./images/background_3.jpg",
        "./images/background_4.jpg",
    ];

    const random = Math.floor(Math.random() * images.length);
    const selected = images[random];

    bgImage.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${selected}')`;
}

window.addEventListener('DOMContentLoaded', () => {
    // console.log('%c[App] portfolio desktop initializing...', 'color:$60a5fa; font-weight:bold;');

    try {
        initRandomBackground();

        initWindowControls();

        initAppLauncher();

        initFinder();

        initCalculator();

        initDock();

        initWeather();

        // console.log('%c[App] All modules initialized successfully.', 'color:#22c55e; font-weight:bold;');
    }
    catch (err) {
        console.error('[App Init Error]', err);
    }
});