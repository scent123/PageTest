import { initWindowControls } from "./windowControls.js";
import { initFinder } from "./finder.js";
import { initCalculator } from "./calculator.js";
import { initDock } from "./dock.js";
import { initWeather } from "./weather.js"
import { initDockMenu } from "./dockMenu.js";

// 배경 이미지 랜덤 변경
function initRandomBackground() {
    const images = [
        "./images/backgrounds/background_1.jpg",
        "./images/backgrounds/background_2.jpg",
        "./images/backgrounds/background_3.jpg",
        "./images/backgrounds/background_4.jpg",
        "./images/backgrounds/background_5.jpg",
        "./images/backgrounds/background_6.jpg",
        "./images/backgrounds/background_7.jpg",
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