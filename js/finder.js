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

            // ----- move -----
            if (isDragging) {
                win.style.left = (e.clientX - startX) / 16 + 'rem';
                win.style.top = (e.clientY - startY) / 16 + 'rem';
            }

            // ----- resize -----
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

    // ----- window buttons -----
    const closeBtn = document.querySelectorAll('.close');
    const miniBtn = document.querySelectorAll('.minimize');
    const zoomBtn = document.querySelectorAll('.zoom');

    // Close
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

    // Minimize
    miniBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            win.style.transform = 'translateY(80vh) scale(0.25)';
            win.classList.add('animating');

            setTimeout(() => {
                win.classList.add('hidden');
                win.style.transform = '';
                win.classList.remove('animating');
            }, 400);
        });
    });

    // Zoom
    zoomBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            const isZoomed = win.classList.contains('is-zoomed');

            if (!isZoomed) {
                win.dataset.prevTop = win.style.top || win.offsetTop + 'px';
                win.dataset.prevLeft = win.style.left || win.offsetLeft + 'px';
                win.dataset.prevWidth = win.offsetWidth + 'px';
                win.dataset.prevHeight = win.offsetHeight + 'px';

                win.style.top = '0';
                win.style.left = '0';
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
        });
    });

    // ----- Finder 데이터 구조 -----
    const finderData = {
        name: "Users",
        children: [
            {
                name: "Seonjin",
                children: [
                    { name: "Apps", type: "folder" },
                    {
                        name: "Desktop",
                        children: [
                            { name: "Profile", type: "preview", image: "./images/이력서사진.jpg", description: "Profile picture" },
                            {
                                name: "Design",
                                children: [
                                    { name: "Design1", type: "preview" },
                                    { name: "Design2", type: "preview" },
                                ],
                            },
                            {
                                name: "Projects",
                                children: [
                                    { name: "Project1", type: "preview" },
                                    { name: "Project2", type: "preview" },
                                ],
                            },
                            {
                                name: "Tools",
                                children: [
                                    { name: "VSCode", type: "preview" },
                                    { name: "Figma", type: "preview" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    // ----- Finder 초기화 함수 & DOM 참조 -----
    const finderWindow = document.querySelector('.window.finder');
    const content = finderWindow.querySelector('.content');
    const finderClose = finderWindow.querySelector('.close');

    finderClose.addEventListener('click', () => {
        finderWindow.classList.add('hidden');
        content.innerHTML = '';
    });

    // 유틸: 경로로 노드 찾기 (['Users','Seonjin','Desktop'] 등)
    function getNodeByPath(path) {
        if (!path || path.length === 0) return null;
        let node = finderData;
        // note: our first column uses finderData itself (name "Users")
        for (let i = 0; i < path.length; i++) {
            const name = path[i];
            if (!node) return null;
            // if i==0 and node.name matches, continue
            if (i === 0) {
                if (node.name !== name) return null;
                continue; // stay at finderData for next iteration (children)
            }
            // for subsequent steps, find in node.children
            if (!node.children) return null;
            node = node.children.find(c => c.name === name);
        }
        return node;
    }

    // 핵심: 주어진 path대로 컬럼+preview를 차례로 렌더
    // path 예: ['Users']  => shows Users column (single)
    // path 예: ['Users','Seonjin'] => Users, Seonjin, and Seonjin.children (Desktop, Apps)
    // path 예: ['Users','Seonjin','Desktop','Tools'] => Users, Seonjin, Desktop, Tools -> if Tools has children or preview -> render
    function openPath(path = []) {
        // 안전: path[0]가 'Users'인지 확인, 아니면 강제 set
        if (!path || path.length === 0) path = [finderData.name];

        // 먼저 content 비우기 (모든 컬럼/preview 제거)
        content.innerHTML = '';

        // 단계별로 렌더
        // level 0: render [finderData] (Users)
        renderColumn([finderData], 0, path[0], []); // selectedName path[0]

        // for depth >=1:
        for (let depth = 1; depth <= path.length - 1; depth++) {
            // items for this column come from node at path[0..depth-1].children
            const parentPath = path.slice(0, depth); // e.g. ['Users'] then ['Users','Seonjin']
            const parentNode = getNodeByPath(parentPath);
            const items = parentNode && parentNode.children ? parentNode.children : [];
            const selectedName = path[depth]; // name to mark selected in this column (may be undefined)
            renderColumn(items, depth, selectedName, parentPath);
        }

        // After rendering up to path.length - 1 columns, check the last node
        const lastNode = getNodeByPath(path);
        if (lastNode) {
            if (lastNode.children && lastNode.children.length > 0) {
                // render its children as the next column (so page shows children of lastNode)
                renderColumn(lastNode.children, path.length, null, path);
            } else if (lastNode.type === 'preview') {
                // show preview to the right of current columns
                renderPreview(lastNode, path.length);
            }
        }

        content.scrollLeft = content.scrollWidth;
    }

    // renderColumn(items, level, selectedName, pathPrefix)
    // - items: array of nodes to show in column
    // - level: column index (0-based)
    // - selectedName: if provided, mark that item selected in this column
    // - pathPrefix: parent path up to previous column
    function renderColumn(items, level = 0, selectedName = null, pathPrefix = []) {
        // remove columns & preview at and to the right of level
        // keep columns with index < level
        const existing = Array.from(content.children);
        existing.forEach((child, idx) => {
            if (idx >= level) child.remove();
        });

        const ul = document.createElement('ul');
        ul.classList.add('finder-columns');

        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('folder');
            li.innerHTML = `
                <img src="./images/folder.png" alt="folder" class="list-picture">
                <span>${item.name}</span>
            `;

            // selected 처리: selectedName과 일치하면 표시
            if (selectedName && item.name === selectedName) {
                li.classList.add('selected');
            }

            // 클릭 시: 새로운 경로로 openPath 호출
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                // 클릭된 컬럼에서 selected 토글(visual)
                ul.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
                li.classList.add('selected');

                const newPath = [...pathPrefix];
                // pathPrefix corresponds to parents up to previous column
                // 예: if level==2, pathPrefix might be ['Users','Seonjin']
                newPath.push(item.name);

                // open that path (this will render columns up to that point + children/preview)
                openPath(newPath);
            });

            ul.appendChild(li);
        });

        content.appendChild(ul);
    }

    // preview: render as div.finder-preview to the right (not as ul/li)
    function renderPreview(item, level) {
        // remove any columns/preview at and to the right of level
        const existing = Array.from(content.children);
        existing.forEach((child, idx) => {
            if (idx >= level) child.remove();
        });

        // remove any previous finder-preview (safety)
        Array.from(content.querySelectorAll('.finder-preview')).forEach(el => el.remove());

        const previewContainer = document.createElement('div');
        previewContainer.classList.add('finder-preview');
        previewContainer.innerHTML = `
            <div class="preview">
                <img src="${item.image}" alt="${item.description}">
                <div class="property-container">
                    <div class="property"><div class="key">Name</div><div class="value">${item.name}</div></div>
                    <div class="property"><div class="key">testDay</div><div class="value">testText2</div></div>
                    <div class="property"><div class="key">testDetail</div><div class="value">testText3</div></div>
                </div>
            </div>
        `;

        content.appendChild(previewContainer);
    }

    // ----- app 클릭 시 Finder 윈도우 표시 -----
    const apps = document.querySelectorAll('.app');
    function openFinderWindow(app) {
        const targetApp = app.dataset.app;
        const targetWindow = document.querySelector(`.window.${targetApp}`);
        const folderName = app.querySelector('.app-name') ? app.querySelector('.app-name').textContent.trim() : '';
        const windowName = targetWindow ? targetWindow.querySelector('.folder-name') : null;
        const folderImg = app.querySelector('img') ? app.querySelector('img').getAttribute('src') : '';
        const windowImg = targetWindow ? targetWindow.querySelector('.folder-icon') : null;
        console.log(`targetApp = ${targetApp}. this is app-grid -> data-app="${targetApp}"`);

        if (!targetWindow) return;

        targetWindow.classList.remove('hidden');
        targetWindow.style.opacity = 0;
        targetWindow.style.transform = 'scale(0.9)';
        setTimeout(() => {
            targetWindow.style.opacity = 1;
            targetWindow.style.transform = 'scale(1)';
        }, 20);

        if (targetApp === 'finder') {
            let initialPath = ['Users', 'Seonjin'];

            const clickedName = folderName ? folderName.charAt(0).toUpperCase() + folderName.slice(1) : null;
            const desktopNode = finderData.children[0].children.find(c => c.name === 'Desktop');

            if (clickedName && desktopNode && desktopNode.children.some(c => c.name === clickedName)) {
                openPath(['Users', 'Seonjin', 'Desktop', clickedName]);
            } else {
                openPath(initialPath);
            }
        }

        if (windowName && folderName) windowName.textContent = folderName;
        if (windowImg && folderImg) windowImg.style.backgroundImage = `url(${folderImg})`;
    }

    apps.forEach(app => {
        app.addEventListener('click', () => openFinderWindow(app));
    });

    function updateColumnBorders() {
        const columnsContainer = document.querySelector('.finder-columns');
        if (!columnsContainer) return;

        const columns = [...columnsContainer.children];
        if (!columns.length) return;

        const totalWidth = columns.reduce((sum, col) => sum + col.offsetWidth, 0);

        const containerWidth = columnsContainer.offsetWidth;

        columns.forEach(col => {
            col.style.borderRight = '1px solid #dcdcdc';
        });

        if (totalWidth > containerWidth) {
            columns[columns.length - 1].style.borderRight = 'none';
        }
    }

    const columnsContainer = document.querySelector('.finder-columns');
    if (columnsContainer) {
        window.addEventListener('resize', updateColumnBorders);
        new MutationObserver(updateColumnBorders).observe(columnsContainer, { childList: true });
        updateColumnBorders();
    }

    // ----- 공용 App 열기 함수 -----


    // 초기 렌더: 아무것도 하지 않음(윈도우 열릴 때 init via click)
    window.Finder = {
        openPath,
        finderData,
        getNodeByPath,
    };

    window.dispatchEvent(new Event('FinderReady'));
    window.Finder = window.Finder || {};
    window.Finder.openFinderWindow = openFinderWindow;
});