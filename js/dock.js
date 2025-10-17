// ----- dock-clock -----
function getCurrentTIme() {
    const now = new Date();

    const month = now.getMonth() + 1;
    const date = now.getDate();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[now.getDay()];

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.querySelector('.dock-clock').innerText =
        `${month}월 ${date}일 (${day}) ${hours}:${minutes}:${seconds}`;
}

getCurrentTIme();
setInterval(getCurrentTIme, 900);

function openApp(app) {
    const targetWindow = document.querySelector(`.window.${app}`);
    if (!targetWindow) return;

    targetWindow.classList.remove('hidden');
    targetWindow.style.opacity = 0;
    targetWindow.style.transform = 'scale(0.9)';

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
                const img = icon.querySelector('img').getAttribute('src');
                let folderName = '';

                let path;
                if (img.includes('Profile')) {
                    path = ['Users', 'Seonjin', 'Desktop', 'Profile'];
                    folderName = 'Profile'
                }
                else if (img.includes('Design')) {
                    path = ['Users', 'Seonjin', 'Desktop', 'Design']
                    folderName = 'Design';
                }
                else if (img.includes('Projects')) {
                    path = ['Users', 'Seonjin', 'Desktop', 'Projects}'];
                    folderName = 'Projects';
                }
                else if (img.includes('Tools')) {
                    path = ['Users', 'Seonjin', 'Desktop', 'Tools']
                    folderName = 'Tools';
                }
                else {
                    path = ['Users', 'Seonjin', 'Desktop'];
                    folderName = 'Desktop'
                };

                const finderWindow = document.querySelector('.window.finder');
                if (!finderWindow || finderWindow.classList.contains('hidden')) {
                    if (typeof openApp === 'function') openApp('finder');
                }

                const openWhenReady = () => {
                    if (window.Finder && typeof window.Finder.openFinderWindow === 'function') {
                        const finderApp = document.querySelector('.app[data-app="finder"]');
                        if (finderApp) {
                            window.Finder.openFinderWindow(finderApp);
                            window.Finder.openPath(path);

                            const windowName = finderWindow.querySelector('.folder-name');
                            const windowImg = finderWindow.querySelector('.folder-icon');
                            if (windowName) windowName.textContent = folderName;
                            if (windowImg) windowImg.style.backgroundImage = `url(${img})`;
                        }
                    } else {
                        setTimeout(openWhenReady(), 100);
                    }
                };
                openWhenReady();
            }

            else if (app === 'calculator') {
                // TODO: Calculator window open
                openApp('calculator');
            }
            else if (app === 'Resume') {
                // TODO: Notion Resume link
            }
            else if (app === 'Weather') {
                // TODO: Weather window open
                openApp('weather');
            }
            else if (app === 'Snippets') {
                // TODO: Notion Snippets link
            }

        });
    });
}

// if (window.Finder) {
initDockAfterFinder();
// } else {
//     window.addEventListener('FinderReady', initDockAfterFinder, { once: true });
// }