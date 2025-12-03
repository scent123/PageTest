/**
 * dock.js (A안 + Finder 특수 로직 반영)
 */

export function initDock() {

    /* -----------------------------------------
     *  1) 시계 기능 (그대로 유지)
     * ----------------------------------------- */

    function getCurrentTime() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const day = days[now.getDay()];
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        const clockEl = document.querySelector('.dock-clock');
        if (clockEl) {
            clockEl.innerText =
                `${month}월 ${date}일 (${day}) ${hours}:${minutes}:${seconds}`;
        }
    }

    function startClock() {
        getCurrentTime();
        return setInterval(getCurrentTime, 1000);
    }

    let clockInterval = null;

    function handleClockResponsive() {
        if (window.innerWidth >= 768) {
            if (!clockInterval) clockInterval = startClock();
        } else {
            if (clockInterval) {
                clearInterval(clockInterval);
                clockInterval = null;
            }
        }
    }

    window.addEventListener('resize', handleClockResponsive);
    handleClockResponsive();



    /* -----------------------------------------
     *  2) Dock 클릭 → Finder 특수 로직 + 나머지는 AppCore
     * ----------------------------------------- */

    function initDockClickHandlers() {
        const dockIcons = document.querySelectorAll('.dock-icon');

        dockIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();

                const app = icon.dataset.app;
                if (!app) return;

                /* ★ Finder 전용 처리 */
                if (app === "finder") {

                    const finderWin = document.querySelector(".window.finder");

                    if (!finderWin) return;

                    const isOpen = finderWin.classList.contains("active");
                    const minimized = finderWin.classList.contains("is-minimizing");

                    if (isOpen || minimized) {
                        // ★ 이미 열려 있으면 경로 변경 없이 그대로 포커스(restore)
                        window.WindowControls.openApp("finder");
                        return;
                    }

                    // ★ 아니면 Desktop 기본 경로로 열기
                    const defaultPath = ["Users", "Seonjin", "Desktop"];
                    window.WindowControls.openApp("finder", { path: defaultPath });
                    return;
                }


                /* ★ 일반 앱은 그냥 openApp */
                if (window.WindowControls?.openApp) {
                    window.WindowControls.openApp(app);
                }
            });
        });
    }



    /* -----------------------------------------
     *  3) FinderReady 이후 Dock 초기화
     * ----------------------------------------- */

    if (window.Finder) {
        initDockClickHandlers();
    } else {
        window.addEventListener('FinderReady', initDockClickHandlers, { once: true });
    }
}