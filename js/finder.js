import { initWindowControls } from "./windowControls.js";

export function initFinder() {
    const finderData = {
        name: "Users",
        image: "./images/folder.png",
        children: [
            {
                name: "Seonjin",
                image: "./images/folder.png",
                children: [
                    {
                        name: "Apps",
                        image: "./images/folder.png",
                        children: [
                            { name: "Finder", type: "App", image: "./images/folder.png" },
                            { name: "Calculator", type: "App" },
                            { name: "Weather", type: "App" },
                        ]
                    },
                    {
                        name: "Desktop",
                        image: "./images/folder.png",
                        children: [
                            { name: "Profile", type: "preview", folderImage: "./images/Profile.png", image: "./images/profile_photo.jpg", description: "Profile picture" },
                            {
                                name: "Design",
                                image: "./images/Design.png",
                                children: [
                                    { name: "Design1", type: "preview" },
                                    { name: "Design2", type: "preview" },
                                ],
                            },
                            {
                                name: "Projects",
                                image: "./images/Projects.png",
                                children: [
                                    { name: "Ando Tadao", type: "preview", image: "./images/Ando_Page.jpg" },
                                    { name: "Angelinus", type: "preview", image: "./images/angelinus.jpg" },
                                    { name: "Musign", type: "preview", image: "./images/musign.jpg" },
                                    { name: "Monami", type: "preview", image: "./images/monami.jpg" },
                                ],
                            },
                            {
                                name: "Tools",
                                image: "./images/Tools.png",
                                children: [
                                    { name: "VSCode", type: "preview" },
                                    { name: "InteliJ", type: "preview" },
                                    { name: "eclipse", type: "preview" },
                                    { name: "android studio", type: "preview" },
                                    { name: "Xcode", type: "preview" },
                                    { name: "Photoshop", type: "preview" },
                                    { name: "Illustrator", type: "preview" },
                                    { name: "Indesign", type: "preview" },
                                    { name: "AdobeXD", type: "preview" },
                                    { name: "Figma", type: "preview" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const finderWindow = document.querySelector('.window.finder');
    if (!finderWindow) return;

    const content = finderWindow.querySelector('.content');
    const finderClose = finderWindow.querySelector('.close');

    if (finderClose) {
        finderClose.addEventListener('click', () => {
            finderWindow.classList.remove('active');
            if (content) content.innerHTML = '';
        });
    }

    function getNodeByPath(path) {
        if (!path || path.length === 0) return null;
        let node = finderData;
        for (const name of path) {
            if (node.name === name) continue;
            node = node.children?.find(c => c.name === name);
            if (!node) return null;
        }
        return node;
    }

    function openPath(path = []) {
        const folderNameEl = finderWindow.querySelector('.folder-name');
        const folderIconEl = finderWindow.querySelector('.folder-icon');

        if (!path || path.length === 0) {
            // Root 상태
            content.innerHTML = '';
            renderColumn([finderData], 0, null, []);
            if (folderNameEl) folderNameEl.textContent = 'Root';
            if (folderIconEl) folderIconEl.style.backgroundImage = `url(./images/folder.png)`;
            return;
        }

        window.Finder.currentPath = path;
        const currentNode = getNodeByPath(path);
        const currentName = path[path.length - 1] || 'Root';

        if (folderNameEl) folderNameEl.textContent = currentName;
        if (folderIconEl) {
            const iconURL = currentNode?.folderImage || currentNode?.image || './images/folder.png';
            folderIconEl.style.backgroundImage = `url(${iconURL})`;
        }

        content.innerHTML = '';
        renderColumn([finderData], 0, path[0], []);

        for (let depth = 1; depth < path.length; depth++) {
            const parentPath = path.slice(0, depth);
            const parentNode = getNodeByPath(parentPath);
            const items = parentNode?.children || [];
            const selectedName = path[depth];
            renderColumn(items, depth, selectedName, parentPath);
        }

        const lastNode = getNodeByPath(path);
        if (lastNode) {
            if (lastNode.children?.length > 0) {
                renderColumn(lastNode.children, path.length, null, path);
            } else if (lastNode.type === 'preview') {
                renderPreview(lastNode, path.length, path);
            }
        }

        content.scrollLeft = content.scrollWidth;
    }

    function renderColumn(items, level = 0, selectedName = null, pathPrefix = []) {
        Array.from(content.children).forEach((child, idx) => {
            if (idx >= level) child.remove();
        });

        const ul = document.createElement('ul');
        ul.classList.add('finder-columns');

        const isMobile = window.innerWidth <= 768;

        if (pathPrefix.length >= 1 && isMobile) {
            const backLi = document.createElement('li');
            backLi.classList.add('folder', 'back-item');
            backLi.innerHTML = `
                <img src="./images/folder.png" alt="folder" class="list-picture">
                <span>...</span>
            `;
            backLi.addEventListener('click', () => {
                const parentPath = pathPrefix.slice(0, -1);
                if (pathPrefix.length === 1 && pathPrefix[0] === 'Users') openPath([]);
                else openPath(parentPath);
            });
            ul.appendChild(backLi);
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('folder');

            const iconSrc =
                item.folderImage ||
                item.image ||
                (item.type === "App" ? `./images/${item.name.toLowerCase()}.png` : "./images/folder.png");

            li.innerHTML = `
                <img src="${iconSrc}" alt="${item.name}" class="list-picture">
                <span>${item.name}</span>
            `;

            if (selectedName === item.name && !isMobile) li.classList.add('selected');

            li.addEventListener('click', (e) => {
                e.stopPropagation();

                if (item.name === 'Finder') return;

                ul.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
                li.classList.add('selected');

                const newPath = [...pathPrefix, item.name];

                if (item.type === 'App') {
                    const appName = item.name.toLowerCase();
                    const targetWindow = document.querySelector(`.window.${appName}`);
                    if (targetWindow) {
                        targetWindow.classList.add('active');
                        targetWindow.style.opacity = 0;
                        targetWindow.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            targetWindow.style.opacity = 1;
                            targetWindow.style.transform = 'scale(1)';
                        }, 20);

                        if (window.WindowControls?.focusOrRestoreWindow) {
                            window.WindowControls.focusOrRestoreWindow(appName);
                        }

                        const dockIcon = document.querySelector(`.dock-icon[data-app="${appName}"]`);
                        if (dockIcon) dockIcon.classList.add('active');
                    }
                    return;
                }

                openPath(newPath);
            });

            ul.appendChild(li);
        });

        content.appendChild(ul);
    }

    function renderPreview(item, level, path = []) {
        Array.from(content.children).forEach((child, idx) => {
            if (idx >= level) child.remove();
        });

        const previewContainer = document.createElement('div');
        previewContainer.classList.add('finder-preview');

        const backBtn = document.createElement('button');
        backBtn.classList.add('preview-closeBtn');
        backBtn.textContent = '←';
        backBtn.addEventListener('click', () => {
            if (path.length > 1) openPath(path.slice(0, -1));
        });

        previewContainer.innerHTML = `
            <div class="preview">
                <img src="${item.image}" alt="${item.description || ''}">
                <div class="property-container">
                    <div class="property"><div class="key">Name</div><div class="value">${item.name}</div></div>
                    <div class="property"><div class="key">testDay</div><div class="value">testText2</div></div>
                    <div class="property"><div class="key">testDetail</div><div class="value">testText3</div></div>
                </div>
            </div>
        `;

        const folderIcon = finderWindow.querySelector('.folder-icon');
        const folderName = finderWindow.querySelector('.folder-name');
        // if (folderIcon && item.image) folderIcon.style.backgroundImage = `url(${item.image})`;
        if (folderIcon) {
            const iconURL = item.folderImage || item.image || './images/folder.png';
            folderIcon.style.backgroundImage = `url(${iconURL})`;
        }
        if (folderName) folderName.textContent = item.name;

        previewContainer.prepend(backBtn);
        content.appendChild(previewContainer);
    }

    const apps = document.querySelectorAll('.app');
    apps.forEach(app => {
        app.addEventListener('click', () => {
            const targetApp = app.dataset.app;
            const targetWindow = document.querySelector(`.window.${targetApp}`);
            if (!targetWindow) return;

            targetWindow.classList.add('active');
            targetWindow.style.opacity = 0;
            targetWindow.style.transform = 'scale(0.9)';
            setTimeout(() => {
                targetWindow.style.opacity = 1;
                targetWindow.style.transform = 'scale(1)';
            }, 20);

            if (targetApp === 'finder') {
                const folderName = app.querySelector('.app-name')?.textContent.trim();
                const desktopNode = finderData.children[0].children.find(c => c.name === 'Desktop');
                if (folderName && desktopNode?.children.some(c => c.name === folderName)) {
                    openPath(['Users', 'Seonjin', 'Desktop', folderName]);
                } else {
                    openPath(['Users', 'Seonjin']);
                }
            }

            const dockIcon = document.querySelector(`.dock-icon[data-app="${targetApp}"]`);
            if (dockIcon) dockIcon.classList.add('active');
        });
    });

    window.Finder = { openPath, finderData, getNodeByPath };
    window.dispatchEvent(new Event('FinderReady'));
}