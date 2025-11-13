// dock.js
// Dock 관련 기능 (아이콘 클릭, Finder/Calculator/Weather 실행, 시계 업데이트)
// export: initDock()

export function initDock() {
    // function shouldShowClock() {}

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
            clockEl.innerText = `${month}월 ${date}일 (${day}) ${hours}:${minutes}:${seconds}`;
        }
    }

    // 시계 작동
    function startClock() {
        getCurrentTime();
        return setInterval(getCurrentTime, 1000);
    }

    let clockInterval = null;

    // 창의 너비가 768이 넘으면 시계가 startClock 함수 작동
    function handleClockResponsive() {
        if (window.innerWidth >= 768) {
            if (!clockInterval) clockInterval = startClock();
        }
        else {
            if (clockInterval) {
                clearInterval(clockInterval);
                clockInterval = null;
            }
        }
    }

    // 창 크기가 변해도 함수를 읽을수 있도록
    window.addEventListener('resize', handleClockResponsive);
    handleClockResponsive();

    function openApp(app) {
        const targetWindow = document.querySelector(`.window.${app}`);
        if (!targetWindow) return;

        targetWindow.classList.add('active');
        targetWindow.style.opacity = 0;
        targetWindow.style.transform = 'scale(0.9)';

        const dockIcon = document.querySelector(`.dock-icon[data-app="${app}"]`);
        if (dockIcon) dockIcon.classList.add('active');

        setTimeout(() => {
            targetWindow.style.opacity = 1;
            targetWindow.style.transform = 'scale(1)';
        }, 20);
    }


    function initDockAfterFinder() {
        const dockIcons = document.querySelectorAll('.dock-icon');

        dockIcons.forEach(icon => {
            icon.addEventListener('click', e => {
                e.preventDefault();
                const app = icon.dataset.app;

                if (app === 'finder') {
                    const finderWindow = document.querySelector('.window.finder');

                    if (!finderWindow || !finderWindow.classList.contains('active')) {
                        openApp('finder');
                    }

                    const openWhenReady = () => {
                        if (window.Finder && typeof window.Finder.openFinderWindow === 'function') {
                            const finderApp = document.querySelector('.app[data-app="finder"]');
                            if (finderApp) {
                                window.Finder.openFinderWindow(finderApp);

                                const lastPath = window.Finder.currentPath || ['Users', 'Seonjin', 'Desktop'];
                                window.Finder.openPath(lastPath);
                            }
                        }
                        else {
                            setTimeout(() => openWhenReady, 100);
                        }
                    }
                }

                else if (app === 'calculator') {
                    openApp('calculator');
                }

                else if (app === 'weather') {
                    openApp('weather');
                }

                else if (app === 'resume') {
                    // TODO: Notion 링크 등 연결 가능
                }

                else if (app === 'snippets') {
                    // TODO: 링크 연결 가능
                    // window.open('https://pickled-butterkase-d37.notion.site/my_reference-11c76061cfcd8078b1aef43102c6b840?source=copy_link')
                }
            });
        });
    }

    if (window.Finder) {
        initDockAfterFinder();
    } else {
        window.addEventListener('FinderReady', initDockAfterFinder, { once: true });
    }
}