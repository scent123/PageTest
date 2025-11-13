import { initAppLauncher, initWindowControls } from "./windowControls.js";
import { initFinder } from "./finder.js";
import { initCalculator } from "./calculator.js";
import { initDock } from "./dock.js";
import { initWeather } from "./weather.js"
import { initDockMenu } from "./dockMenu.js";

// function setViewportHeight() {
//     const vh = window.innerHeight * 0.01;
//     document.documentElement.style.setProperty("--vh", `${vh}px`);
// }
// window.addEventListener('resize', setViewportHeight);
// window.addEventListener('orientationchange', setViewportHeight);
// setViewportHeight();

// random background images
function initRandomBackground() {
    const images = [
        "./images/background_1.jpg",
        "./images/background_2.jpg",
        "./images/background_3.jpg",
        "./images/background_4.jpg",
    ];

    const random = Math.floor(Math.random() * images.length);
    const selected = images[random];

    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${selected}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgorundPosiiton = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}

window.addEventListener('DOMContentLoaded', () => {
    // console.log('%c[App] portfolio desktop initializing...', 'color:$60a5fa; font-weight:bold;');

    try {
        initRandomBackground();
        initWindowControls();
        initAppLauncher();
        initFinder();
        initDockMenu();
        initDock();
        initCalculator();
        initWeather();

        // console.log('%c[App] All modules initialized successfully.', 'color:#22c55e; font-weight:bold;');
    }
    catch (err) {
        console.error('[App Init Error]', err);
    }
});

document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - (window.lastTouchEnd || 0) <= 300) event.preventDefault();
    window.lastTouchEnd = now;
}, false);