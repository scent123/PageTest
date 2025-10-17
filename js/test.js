document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.window'); // every window select

    // ----- window move -----
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
            if (win.classList.contains('is-zoomed')) isDragging = false;
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

    const closeBtn = document.querySelectorAll('.close'); // close 버튼
    const miniBtn = document.querySelectorAll('.minimize'); // minimize 버튼
    const zoomBtn = document.querySelectorAll('.zoom'); // zoom 버튼

    // ----- window close button -----
    closeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            win.classList.add('is-closing');

            setTimeout(() => {
                win.classList.remove('is-closing', 'is-zoomed', 'animating');
                win.classList.add('hidden');

                win.style.width = '42.75rem';
                win.style.height = '30.25rem';
                win.style.top = '';
                win.style.left = '';
            }, 250);
        });
    });

    miniBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            win.style.transform = 'translateY(80vh) scale(0.25)';
            win.classList.add('animating')

            setTimeout(() => {
                win.classList.add('hidden');
                win.style.transform = '';
                win.style.opacity = '';
                win.classList.remove('animating');
            }, 400);
        });
    })

    zoomBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            if (!win.classList.add('is-zoomed')) {
                win.dataset.pervTop = win.style.top || win.offsetTop + 'px';
                win.dataset.prevLeft = win.style.left || win.offsetLeft + 'px';
                win.dataset.pervWidth = win.style.offsetWidth + 'px';
                win.dataset.pervHeight = win.style.offsetHeight + 'px';

                win.style.top = 0;
                win.style.left = 0;
                win.style.width = '100vw';
                win.style.height = 'calc(100vh - 5rem)';
                win.classList.add('is-zoomed');
            } else {
                win.style.top = win.dataset.prevTop;
                win.style.left = win.dataset.prevLeft;
                win.style.width = win.dataset.prevWidth;
                win.style.height = win.dataset.prevHeight;
                win.classList.remove('is-zoomed');
            }
            win.classList.add('animating');
            setTimeout(() => win.classList.remove('animating'), 400);
        })
    })


    const apps = document.querySelectorAll('.app'); // app 클래스를 가진 모든 요소

    // ----- app click open window -----
    apps.forEach(app => {
        app.addEventListener('click', () => {
            const targetApp = app.dataset.app; // 선택한 앱이 가지고 있는 data-app을 저장
            const targetWindow = document.querySelector(`.window.${targetApp}`); // 클래스가 targetApp과 동일한 윈도우를 저장
            const folderName = app.querySelector('.app-name').textContent.trim(); //선택한 앱의 app-name 클래스를 가진 요소의 내용을 저장
            const windowName = targetWindow.querySelector('.folder-name'); // 선택된 윈도우의 folder-name 클래스를 가진 요소를 저장
            const folderImg = app.querySelector('img').getAttribute('src'); // 선택한 앱이 가지고 있는 img 태그의 src 속성을 저장
            const windowImg = targetWindow.querySelector('.folder-icon'); // 선택된 윈도우의 folder-icon 클래스를 가진 요소를 저장

            // 선택된 윈도우가 없으면 이벤트 종료 (오류 방지)
            if (!targetWindow) return;

            // 윈도우 애니메이션
            targetWindow.classList.remove('hidden');
            targetWindow.style.opacity = 0;
            targetWindow.style.transform = 'scale(0.9)';
            setTimeout(() => {
                targetWindow.style.opacity = 1;
                targetWindow.style.transform = 'scale(1)';
            }, 20);

            // 선택된 윈도우의 제목을 선택한 앱의 이름으로 변경
            if (windowName) windowName.textContent = folderName;
            // 선택된 윈도우의 folder-icon의 bg-img를 선택한 앱이 가지고 있는 img태그의 src로 변경
            if (windowImg) {
                windowImg.style.backgroundImage = `url(${folderImg})`;
            }

            let initialPath = ['Users', 'Seonjin', 'Desktop'];

            switch (folderName.toLowerCase()) {
                case 'profile':
                case 'design':
                case 'projects':
                case 'tools':
                    initialPath.push(folderName.charAt(0).toUpperCase() + folderName.slice(1));
                    break;
                default:
                    break;
            }

            const finderWindow = document.querySelector('.window.finder');
            finderWindow.classList.remove('hidden');

            if (targetApp === 'finder') {
                const targetName = folderName.toLowerCase();
                const initialPath = ['Users', 'Seonjin', 'Desktop', capitalize(targetName)];
                renderColumn(initialPath, finderData);
            }
        });
    });

    const finderData = {
        Users: {
            Seonjin: {
                Apps: {},
                Desktop: {
                    Profile: {
                        preview: {
                            title: 'profile',
                            desc: 'hello world',
                            img: './images/background_1.jpg'
                        }
                    },
                    Design: {
                        component1: {},
                        component2: {},
                        component3: {}
                    },
                    Projects: {
                        componenta: {},
                        componentb: {},
                        componentc: {}
                    },
                    Tools: {
                        componentA: {},
                        componentB: {},
                        componentC: {}
                    }
                }
            }
        }
    };


    renderColumn([], finderData);


    function capitalize(s) {
        if (!s) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function renderColumn(path, data) {
        const content = document.querySelector('.content');
        
        const current = path.reduce((acc, key) => acc[key], data);

        while (content.children.length > path.length) {
            content.removeChild(content.lastChild);
        }

        if (current.preview) {
            const preview = document.createElement('div');
            preview.classList.add('finder-preview');
            preview.innerHTML = `
            <div class="preview">
            <img src="${current.preview.img}" alt="${current.preview.title}">
            <div class="property-container">
            <div class="property">
            <div class="key">Name</div>
            <div class="value">${current.preview.title}</div>
            </div>
            <div class="property">
            <div class="key">testDay</div>
            <div class="value">testText2</div>
            </div>
            <div class="property">
            <div class="key">testDetail</div>
            <div class="value">testText3</div>
            </div>
            </div>
            </div>
            `;

            const content = document.querySelector('.content');
            while (content.lastChild && content.lastChild.classList.contains('finder-preview')) {
                content.removeChild(content.lastChild);
            }

            content.appendChild(preview);
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('finder-columns');

        for (const key in current) {
            const li = document.createElement('li');
            li.classList.add('folder');
            li.innerHTML = `
            <img src="./images/folder.png" alt="folder" class="list-picture">
            <span>${key}</span>
            `;

            li.addEventListener('click', () => {
                ul.querySelectorAll('.folder').forEach(f => f.classList.remove('selected'));
                li.classList.add('selected');

                renderColumn([...path, key], data);
            });
            ul.appendChild(li);
        }

        content.appendChild(ul);
    }

    document.querySelectorAll('.app[data-app="finder"]').forEach(app => {
        app.addEventListener('click', () => {
            const targetWindow = document.querySelector('.window.finder');
            const folderName = app.querySelector('.app-name').textContent.trim();

            targetWindow.classList.remove('hidden');
            targetWindow.style.opacity = 0;
            targetWindow.style.transform = 'scale(0.9)';
            setTimeout(() => {
                targetWindow.style.opacity = 1;
                targetWindow.style.transform = 'scale(1)';
            }, 20);

            let path = ['Users', 'Seonjin', 'Desktop'];

            const name = folderName.charAt(0).toUpperCase() + folderName.slice(1);
            if (finderData.Users.Seonjin.Desktop[name]) {
                path.push(name);
            }

            const content = document.querySelector('.content');
            content.innerHTML = '';
            renderColumn(['Users', 'Seonjin', 'Desktop'], finderData);

            setTimeout(() => {
                const lastColumn = content.lastElementChild;
                if (lastColumn) {
                    const targetFolder = Array.from(lastColumn.querySelectorAll('.folder')).find(f => f.querySelector('span').textContent === name);
                    if (targetFolder) {
                        targetFolder.classList.add('selected');
                        renderColumn(path, finderData);
                    }
                }
            }, 50);
        })
    });
}); // -----------------------------------------finish---------------------------------------