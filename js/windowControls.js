/* ============================================================
 * windowControls.js
 * ============================================================ */
export function initWindowControls() {

    /* ============================================================
     * AppCore
     * ============================================================ */
    const AppCore = {

        setActiveDockIcon(appName) {
            if (!appName) return;
            const icon = document.querySelector(`.dock-icon[data-app="${appName}"]`);
            if (!icon) return;
            if (window.innerWidth <= 768) icon.style.display = "flex";
            icon.classList.add("active");
        },

        clearActiveDockIcon(appName) {
            if (!appName) return;
            const icon = document.querySelector(`.dock-icon[data-app="${appName}"]`);
            if (!icon) return;
            icon.classList.remove("active");
            if (window.innerWidth <= 768) icon.style.display = "none";
        },

        /* 윈도우 복원 + 포커스 강제 이동 */
        focusOrRestoreWindow(appName) {
            if (!appName) return;
            const win = document.querySelector(`.window.${appName}`);
            if (!win) return;

            // 최소화 상태 복원
            if (win.classList.contains("is-minimizing")) {
                if (win.dataset.restoreWidth) win.style.width = win.dataset.restoreWidth;
                if (win.dataset.restoreHeight) win.style.height = win.dataset.restoreHeight;
                if (win.dataset.restoreLeft) win.style.left = win.dataset.restoreLeft;
                if (win.dataset.restoreTop) win.style.top = win.dataset.restoreTop;
                if (appName !== "finder") win.style.transform = "translateY(0) scale(1)";
                win.classList.remove("is-minimizing");
                win.classList.add("active");
            }

            // z-index 최상위로
            const newZ = Math.max(
                ...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0),
                1000
            ) + 1;
            win.style.zIndex = newZ;

            // 모든 창 focus 제거 후 해당 창에 부여
            document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
            win.classList.add('focused');
        },

        openApp(appName, options = {}) {
            if (!appName) return;

            if (appName === "finder") {
                this.openFinder(options.path || null);
                return;
            }

            const win = document.querySelector(`.window.${appName}`);
            if (!win) return;

            const alreadyOpen = win.classList.contains("active") || win.classList.contains("is-minimizing");

            if (alreadyOpen) {
                this.focusOrRestoreWindow(appName);
                this.setActiveDockIcon(appName);
                return;
            }

            win.classList.add("active");
            win.style.opacity = 0;
            win.style.transform = "scale(0.95)";
            setTimeout(() => { win.style.opacity = 1; win.style.transform = "scale(1)"; }, 200);

            this.setActiveDockIcon(appName);
            this.focusOrRestoreWindow(appName);
        },

        openFinder(path = null) {
            const win = document.querySelector(".window.finder");
            if (!win) return;

            if (win.classList.contains("is-minimizing")) {
                win.classList.remove("is-minimizing");
                win.style.display = '';
                win.style.transform = 'translateY(0) scale(1)';
                win.style.opacity = 1;
                win.classList.add('active');
            } else {
                win.classList.add('active');
            }

            this.setActiveDockIcon("finder");
            this.focusOrRestoreWindow("finder");

            const applyPath = () => {
                if (!window.Finder?.openPath) return;
                const target = path && Array.isArray(path)
                    ? path
                    : (window.Finder.currentPath || ["Users", "Seonjin"]);
                window.Finder.openPath(target);
            };

            if (window.Finder?.openPath) applyPath();
            else window.addEventListener("FinderReady", () => applyPath(), { once: true });
        },

        closeApp(appName) {
            const win = document.querySelector(`.window.${appName}`);
            if (!win) return;
            win.classList.remove("active");
            this.clearActiveDockIcon(appName);
        }
    };

    /* ============================================================
     * 윈도우 이동 / 크기 조절 / 최소화 기능 유지
     * ============================================================ */

    const windows = document.querySelectorAll(".window");

    function hideWindowElement(win) {
        if (win.classList.contains("is-minimizing")) return;
        win.classList.remove("active");
        win.style.width = win.style.height = win.style.top = win.style.left = win.style.opacity = "";
    }

    windows.forEach(win => {
        const header = win.querySelector(".header");
        const handles = win.querySelectorAll(".resize-handle");

        let isDragging = false;
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop, currentHandle;

        if (header) {
            header.addEventListener("mousedown", e => {
                if (e.target.closest(".remote")) return;
                isDragging = true;
                startX = e.clientX - win.offsetLeft;
                startY = e.clientY - win.offsetTop;

                // 포커스 이동
                const z = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0)) + 1;
                win.style.zIndex = z;
                document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
                win.classList.add('focused');
            });
        }

        handles.forEach(handle => handle.addEventListener("mousedown", e => {
            e.preventDefault();
            if (win.classList.contains("is-zoomed")) return;
            isResizing = true;
            currentHandle = [...handle.classList].find(cls => cls !== 'resize-handle');
            startX = e.clientX; startY = e.clientY;
            startWidth = win.offsetWidth; startHeight = win.offsetHeight;
            startLeft = win.offsetLeft; startTop = win.offsetTop;
        }));

        document.addEventListener("mousemove", e => {
            if (win.classList.contains("is-zoomed")) isDragging = false;

            if (isDragging) {
                win.style.left = (e.clientX - startX) / 16 + "rem";
                win.style.top = (e.clientY - startY) / 16 + "rem";
            }

            if (isResizing) {
                let dx = e.clientX - startX,
                    dy = e.clientY - startY,
                    w = startWidth,
                    h = startHeight,
                    L = startLeft,
                    T = startTop;

                switch (currentHandle) {
                    case "right": w += dx; break;
                    case "left": w -= dx; L += dx; break;
                    case "bottom": h += dy; break;
                    case "top": h -= dy; T += dy; break;
                    case "top-left": w -= dx; L += dx; h -= dy; T += dy; break;
                    case "top-right": w += dx; h -= dy; T += dy; break;
                    case "bottom-left": w -= dx; L += dx; h += dy; break;
                    case "bottom-right": w += dx; h += dy; break;
                }

                if (w > 300) {
                    win.style.width = w / 16 + "rem";
                    win.style.left = L / 16 + "rem";
                }
                if (h > 200) {
                    win.style.height = h / 16 + "rem";
                    win.style.top = T / 16 + "rem";
                }
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            isResizing = false;
        });
    });

    /* ============================================================
    *  Remote Controls (Close / Minimize / Zoom) – 완전 복원
    * ============================================================ */

    const closeBtns = document.querySelectorAll(".remote .close");
    const minBtns = document.querySelectorAll(".remote .minimize");
    const zoomBtns = document.querySelectorAll(".remote .zoom");

    /* ---------------------------------------
     * Close
     * --------------------------------------- */
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const win = btn.closest(".window");
            if (!win) return;

            const appType = win.dataset.app || win.classList[1];
            if (appType) WindowControls.clearActiveDockIcon(appType);

            // Calculator 초기화
            if (appType === "calculator") {
                win.querySelector(".formula").textContent = "";
                win.querySelector(".current").textContent = "0";
                if (window.Calculator?.reset) window.Calculator.reset();
            }

            win.classList.add("is-closing");
            setTimeout(() => {
                win.classList.remove("is-closing", "is-zoomed");
                win.classList.remove("active");
                win.style.width = win.style.height = win.style.top = win.style.left = "";
            }, 200);
        });
    });

    /* ---------------------------------------
     * Minimize
     * --------------------------------------- */
    minBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const win = btn.closest(".window");
            if (!win) return;

            // 위치/크기 저장
            win.dataset.restoreWidth = win.style.width || win.offsetWidth + "px";
            win.dataset.restoreHeight = win.style.height || win.offsetHeight + "px";
            win.dataset.restoreLeft = win.style.left || win.offsetLeft + "px";
            win.dataset.restoreTop = win.style.top || win.offsetTop + "px";

            win.style.transform = "translateY(80vh) scale(0.25)";
            win.classList.add("is-minimizing");

            setTimeout(() => {
                win.style.display = "none";
            }, 350);
        });
    });

    /* ---------------------------------------
     * Zoom
     * --------------------------------------- */
    zoomBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const win = btn.closest(".window");
            if (!win) return;

            // Calculator / Weather 줌 비활성
            if (win.classList.contains("calculator") || win.classList.contains("weather")) return;

            const isZoomed = win.classList.contains("is-zoomed");

            if (!isZoomed) {
                win.dataset.prevTop = win.style.top || win.offsetTop + "px";
                win.dataset.prevLeft = win.style.left || win.offsetLeft + "px";
                win.dataset.prevWidth = win.style.width || win.offsetWidth + "px";
                win.dataset.prevHeight = win.style.height || win.offsetHeight + "px";

                win.style.top = "0";
                win.style.left = "0";
                win.style.width = "100vw";
                win.style.height = "calc(100vh - 5rem)";
                win.classList.add("is-zoomed");
            } else {
                win.style.top = win.dataset.prevTop;
                win.style.left = win.dataset.prevLeft;
                win.style.width = win.dataset.prevWidth;
                win.style.height = win.dataset.prevHeight;
                win.classList.remove("is-zoomed");
            }
        });
    });

    /* ============================================================
     * 새 포커스 시스템 (dockMenu + 외부 클릭 + 윈도우 클릭)
     * ============================================================ */

    /* 윈도우 내부 아무 곳이나 클릭 시 focus */
    windows.forEach(win => {
        win.addEventListener("mousedown", () => {
            document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));

            // dockMenu가 active이면 포커스 부여 금지
            if (document.querySelector('.dock-menu')?.classList.contains('active')) return;

            win.classList.add('focused');
            win.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0)) + 1;
        });
    });

    /* window 외부 클릭 시 focus 제거 */
    document.addEventListener("mousedown", e => {
        if (
            !e.target.closest('.window') &&
            !e.target.closest('.dock-menu') &&
            !e.target.closest('.dock-icon') &&
            !e.target.closest('.app')
        ) {
            document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
        }
    });

    /* dock-menu active 시 모든 focus 제거 (MutationObserver 사용) */
    const dockMenu = document.querySelector('.dock-menu');
    if (dockMenu) {
        const obs = new MutationObserver(() => {
            if (dockMenu.classList.contains('active')) {
                document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
            }
        });
        obs.observe(dockMenu, { attributes: true, attributeFilter: ['class'] });
    }

    /* dockMenu 검색 결과 클릭 → 해당 창 포커스 */
    document.querySelectorAll('.dock-menu .menu-item').forEach(el => {
        el.addEventListener('click', () => {
            const app = el.dataset.app;
            if (!app) return;

            const win = document.querySelector(`.window.${app}`);
            if (!win) return;

            dockMenu?.classList.remove('active');
            document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
            win.classList.add('focused');
            win.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0)) + 1;
        });
    });

    /* ============================================================
     * calculator 입력 제약 (완전한 차단 버전)
     * ============================================================ */

    document.addEventListener(
        'keydown',
        e => {
            const calcWin = document.querySelector('.window.calculator');
            if (!calcWin) return;

            const activeEl = document.activeElement;
            const isInput = activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName);

            const dockActive = dockMenu?.classList.contains('active');

            // dockMenu input에 입력되는 경우 허용
            if (dockActive && isInput) return;

            // calculator가 포커스가 아니면 키 입력 차단
            if (!calcWin.classList.contains('focused')) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        },
        true // capture 단계에서 먼저 실행
    );

    /* ============================================================
     * WindowControls 외부 노출
     * ============================================================ */
    window.WindowControls = {
        openApp: AppCore.openApp.bind(AppCore),
        openFinder: AppCore.openFinder.bind(AppCore),
        closeApp: AppCore.closeApp.bind(AppCore),
        focusOrRestoreWindow: AppCore.focusOrRestoreWindow.bind(AppCore),
        setActiveDockIcon: AppCore.setActiveDockIcon.bind(AppCore),
        clearActiveDockIcon: AppCore.clearActiveDockIcon.bind(AppCore),
    };
}