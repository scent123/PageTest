document.addEventListener('DOMContentLoaded', () => {

    // dock-clock
    function getCurrentTIme() {
        const now = new Date();

        const month = now.getMonth() + 1;
        const date = now.getDay() + 1;
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

    // window move
    const windows = document.querySelectorAll('.window');

    windows.forEach(win => {
        const header = win.querySelector('.header');
        const handles = win.querySelectorAll('.resize-handle');

        let isDragging = false, isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop, currentHandle;

        // window move drag
        header.addEventListener("mousedown", (e) => {
            if (e.target.closest('.remote')) return;

            isDragging = true;
            startX = e.clientX - win.offsetLeft;
            startY = e.clientY - win.offsetTop;

            win.style.zIndex = 999;
        });

        // window resize drag
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
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

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                win.style.left = (e.clientX - startX) / 16 + 'rem';
                win.style.top = (e.clientY - startY) / 16 + 'rem';
            }

            if (isResizing) {
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                switch (currentHandle) {
                    case "right": newWidth = startWidth + dx; break;
                    case 'left': newWidth = startWidth - dx; newLeft = startLeft + dx; break;
                    case 'bottom': newHeight = startHeight + dy; break;
                    case 'top': newHeight = startHeight - dy; newTop = startTop + dy; break;

                    case 'top-left':
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

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });
    });

    // window resize

});

// https://design-zia.vercel.app/mac-os-dock

// https://www.danielprior.dev/
// https://www.reddit.com/r/developersIndia/comments/1k4kyg4/i_built_a_macosstyle_developer_portfolio_in_the/?tl=ko
// https://github.com/daprior/danielprior-macos