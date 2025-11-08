/** -------------------------
 *  Bring window to front (focus)
 *  ------------------------- */
export function focusOrRestoreWindow(app) {
    const win = document.querySelector(`.window.${app}`);
    if (!win) return;

    if (win.classList.contains('is-minimizing')) {
        win.classList.remove('is-minimizing');
        win.classList.add('active');
    }

    const maxZ = Math.max(
        ...Array.from(document.querySelectorAll('.window'))
            .map(w => parseInt(w.style.zIndex) || 0), 1000);

    win.style.zIndex = maxZ + 1;
}

export function initWindowControls() {
    const windows = document.querySelectorAll('.window');
    let topZ = 1000;

    function showWindow(win) {
        if (!win) return;
        win.classList.add("active");
        win.style.opacity = '';
        win.style.transform = '';
        win.style.zIndex = 999;
    }

    function hideWindowElement(win) {
        if (!win) return;
        win.classList.remove('active');
        win.style.width = '';
        win.style.height = '';
        win.style.top = '';
        win.style.left = '';
        win.style.opacity = '';
        win.style.transform = '';

        const overlay = win.querySelector('.weather-overlay');
        if (overlay) {
            overlay.style.opacity = '';
            overlay.style.background = '';
        }
    }

    /** -------------------------
     *  window move and resize
     *  ------------------------- */
    windows.forEach(win => {
        const header = win.querySelector('.header');
        const handles = win.querySelectorAll('.resize-handle');
        let isDragging = false, isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop, currentHandle;

        // move
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.remote')) return;
            isDragging = true;
            startX = e.clientX - win.offsetLeft;
            startY = e.clientY - win.offsetTop;

            const maxZ = Math.max(
                ...Array.from(document.querySelectorAll('.window'))
                    .map(w => parseInt(w.style.zIndex) || 0), 1000);

            win.style.zIndex = maxZ + 1;
        });

        // resize
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (!win || win.classList.contains('is-zoomed')) return;
                isResizing = true;
                currentHandle = [...handle.classList].find(cls => cls !== 'resize-handle');
                startX = e.clientX;
                startY = e.clientY;
                startWidth = win.offsetWidth;
                startHeight = win.offsetHeight;
                startLeft = win.offsetLeft;
                startTop = win.offsetTop;
            });
        });

        // moving
        document.addEventListener('mousemove', (e) => {
            if (win.classList.contains('is-zoomed')) isDragging = false;

            if (isDragging) {
                win.style.left = (e.clientX - startX) / 16 + 'rem';
                win.style.top = (e.clientY - startY) / 16 + 'rem';
            }

            // resizing
            if (isResizing) {
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                switch (currentHandle) {
                    case "right": newWidth = startWidth + dx; break;
                    case "left": newWidth = startWidth - dx; newLeft = startLeft + dx; break;
                    case "bottom": newHeight = startHeight + dy; break;
                    case "top": newHeight = startHeight - dy; newTop = startTop + dy; break;
                    case "top-left":
                        newWidth = startWidth - dx; newLeft = startLeft + dx;
                        newHeight = startHeight - dy; newTop = startTop + dy;
                        break;
                    case "top-right":
                        newWidth = startWidth + dx;
                        newHeight = startHeight - dy; newTop = startTop + dy;
                        break;
                    case "bottom-left":
                        newWidth = startWidth - dx; newLeft = startLeft + dx;
                        newHeight = startHeight + dy;
                        break;
                    case "bottom-right":
                        newWidth = startWidth + dx;
                        newHeight = startHeight + dy;
                        break;
                }

                if (newWidth > 300) {
                    win.style.width = newWidth / 16 + 'rem';
                    win.style.left = newLeft / 16 + 'rem';
                }
                if (newHeight > 200) {
                    win.style.height = newHeight / 16 + 'rem';
                    win.style.top = newTop / 16 + 'rem';
                }
            }
        });

        // mouseup-cancel
        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });
    });

    const closeBtn = document.querySelectorAll('.close');
    const miniBtn = document.querySelectorAll('.minimize');
    const zoomBtn = document.querySelectorAll('.zoom');

    // if (window.innerWidth <= 768) {
    //     windows.forEach(win => {

    //         if (closeBtn) {
    //             closeBtn.addEventListener('click', () => {
    //                 win.classList.add('is-closing');
    //                 setTimeout(() => {
    //                     win.classList.remove('active', 'is-closing');
    //                 }, 300);
    //             });
    //         }

    //         [miniBtn, zoomBtn].forEach(btn => {
    //             if (btn) btn.style.pointerEvents = 'none';
    //         });
    //     });

    //     return;
    // }

    // close
    closeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            if (!win) return;

            if (window.innerWidth <= 768) {
                const remote = document.querySelector('.remote');

                if (remote) {
                    remote.addEventListener('click', () => {
                        win.classList.remove('active');
                    })
                }
            }

            const appType = win.dataset.app || win.classList[1];
            if (appType) {
                const dockIcon = document.querySelector(`.dock-icon[data-app="${appType}"]`);
                if (dockIcon) {
                    dockIcon.classList.remove('active');

                    if (window.innerWidth <= 768) dockIcon.style.display = "none";
                }
            }

            if (win.classList.contains('calculator')) {
                const formulaDisplay = win.querySelector('.formula');
                const currentDisplay = win.querySelector('.current');
                if (formulaDisplay && currentDisplay) {
                    formulaDisplay.textContent = '';
                    currentDisplay.textContent = '0';
                }
                if (window.Calculator && typeof window.Calculator.reset === 'function') {
                    window.Calculator.reset();
                }
            }
            win.classList.add('is-closing');
            setTimeout(() => {
                win.classList.remove('is-closing', 'is-zoomed', 'animating');
                hideWindowElement(win);
            }, 0);
        });
    });

    // minimize
    miniBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            if (!win || window.innerWidth <= 768) return;
            win.style.transform = 'translateY(80vh) scale(0.25)';
            win.classList.add('is-minimizing', 'animating');

            setTimeout(() => {
                hideWindowElement(win);
                // win.style.transform = '';
                win.classList.remove('animating');
            }, 400);
        });
    });

    // zoom
    zoomBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            if (!win || window.innerWidth <= 768) return;

            if (win.classList.contains('calculator') || win.classList.contains('weather')) return;

            const isZoomed = win.classList.contains('is-zoomed');

            if (!isZoomed) {
                win.dataset.prevTop = win.style.top || win.offsetTop + 'px';
                win.dataset.prevLeft = win.style.left || win.offsetLeft + 'px';
                win.dataset.prevwidth = win.style.width || win.offsetWidth + 'px';
                win.dataset.prevHeight = win.style.height || win.offsetHeight + 'px';
                win.style.top = '0';
                win.style.left = '0';
                win.style.width = '100vw';
                win.style.height
                    = 'calc(100vh - 5rem)';
                win.classList.add('is-zoomed');
            }
            else {
                win.style.top = win.dataset.prevTop;
                win.style.left = win.dataset.prevLeft;
                win.style.width = win.dataset.prevwidth;
                win.style.height = win.dataset.prevHeight;
                win.classList.remove('is-zoomed');
            }

            win.classList.add('animating');
            setTimeout(() => win.classList.remove('animating'), 400);
        });
    });

    window.WindowControls = { showWindow, hideWindowElement, focusOrRestoreWindow };
}

export function initAppLauncher() {
    function openOrFocusApp(appElement) {
        const app = appElement.dataset.app;
        const win = document.querySelector(`.window.${app}`);
        if (!app) return;
        if (!win) return;
        function showDockIconForApp(appName) {
            const icon = document.querySelectorAll(`.dock-icon[data-app="${appName}"]`);
            if (!icon) return;
            if (window.innerWidth <= 768) {
                icon.style.display = 'flex';
            }

            icon.classList.add('active');
        }


        const isActive = win.classList.contains('active');
        const isMinimized = win.classList.contains('is-minimizing');

        if (app === 'finder') {
            if (isActive || isMinimized) {
                focusOrRestoreWindow(app);
                return;
            }
            else {
                win.classList.add('active');
                focusOrRestoreWindow(app);
                if (window.Finder && typeof window.Finder.openPath === 'function') {
                    window.Finder.openPath(['Users', 'Seonjin', 'Desktop']);
                }
                return;
            }
        }

        if (isActive || isMinimized) {
            focusOrRestoreWindow(app);
        }
        else {
            win.classList.add('active');
            focusOrRestoreWindow(app);
        }
    }

    document.querySelectorAll('.dock-icon, .app').forEach(icon => {
        icon.addEventListener('click', () => openOrFocusApp(icon));
    });
}