export function initDockMenu() {
    const dockStart = document.querySelector(".dock-start");
    const dockMenu = document.querySelector(".dock-menu");
    if (!dockStart || !dockMenu) return;

    // menuList
    const menuList = dockMenu.querySelector(".menu-list");
    if (!menuList) {
        console.warn("[DockMenu] .menu-list 요소를 찾을 수 없습니다.");
        return;
    }

    // searchInput
    let searchInput = null;
    const searchWrapper = dockMenu.querySelector(".menu-search");
    if (searchWrapper) {
        searchInput = searchWrapper.querySelector("input") || searchWrapper;
    }

    /* ============================================================
     * 메뉴 닫힐 때 실행되는 함수
     * ============================================================ */
    function closeDockMenu() {
        if (!dockMenu.classList.contains("active")) return;

        dockMenu.classList.remove("active");

        // 입력 초기화
        if (searchInput) {
            const inputEl = searchInput.tagName === "INPUT"
                ? searchInput
                : searchInput.querySelector("input");
            if (inputEl) inputEl.value = "";
        }
    }

    /* ============================================================
     *  Finder 검색 DFS
     * ============================================================ */
    function findNodesByName(root, nameLower) {
        const results = [];
        if (!root) return results;

        function dfs(node, path) {
            if (!node) return;
            const nodeName = node.name || "";
            const newPath = nodeName ? [...path, nodeName] : [...path];

            if (nodeName.toLowerCase().includes(nameLower)) {
                results.push({ node, path: newPath });
            }

            if (Array.isArray(node.children)) {
                for (const child of node.children) dfs(child, newPath);
            }
        }
        dfs(root, []);
        return results;
    }

    function getDesktopNodeAndPath() {
        if (!window.Finder || !window.Finder.finderData) return null;

        const root = window.Finder.finderData;

        const found = findNodesByName(root, "desktop").filter(
            f => f.node && f.node.name === "Desktop"
        );

        if (!found.length) return null;

        const { node, path } = found[0];
        const usersIndex = path.findIndex(p => p.toLowerCase() === "users");
        const normalizedPath = usersIndex >= 0 ? path.slice(usersIndex) : path;

        return { node, path: normalizedPath };
    }

    function searchFinder(keyword) {
        const results = [];
        if (!window.Finder || !window.Finder.finderData) return results;

        function recurse(node, path = []) {
            if (!node) return;

            const nodeName = node.name || "";
            const currentPath = [...path, nodeName];

            const isFolder = !!node.folderImage;

            if (nodeName.toLowerCase().includes(keyword)) {
                results.push({
                    name: nodeName,
                    path: currentPath,
                    node,
                    type: isFolder ? "folder" : "file",
                    image: isFolder
                        ? node.folderImage
                        : node.image || "./images/이력서사진.jpg"
                });
            }

            if (Array.isArray(node.children)) {
                node.children.forEach(child => recurse(child, currentPath));
            }
        }

        recurse(window.Finder.finderData, []);
        return results;
    }

    /* ============================================================
     *  flattenFinderData — 검색 결과 없을 때 전체 표시용
     * ============================================================ */
    function flattenFinderData() {
        const all = [];

        function recurse(node, path = []) {
            if (!node) return;

            const currentPath = [...path, node.name];
            const isFolder = Array.isArray(node.children) && node.children.length > 0;
            const itemType = node.type || (isFolder ? "folder" : "file");
            let img = './images/close.png';

            if (itemType.toLowerCase() === 'app') {
                img = node.appImage || node.icon || node.image || img;
            }
            else if (itemType === 'folder') {
                img = node.folderImage || node.image || img;
            }
            else {
                img = node.image || img;
            }

            all.push({
                name: node.name,
                path: currentPath,
                node,
                type: itemType,
                image: img
            });

            if (isFolder) {
                node.children.forEach(child => recurse(child, currentPath));
            }
        }

        recurse(window.Finder.finderData, []);
        return all;
    }

    function escapeHtml(s) {
        if (typeof s !== "string") return s;
        return s.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    /* ============================================================
     *  renderRecent — Desktop 기준 최근 항목
     * ============================================================ */
    function renderRecent() {
        menuList.innerHTML = "";

        const header = document.querySelector('.menu-header');
        if (header) header.textContent = 'Recent Items';

        const desktopInfo = getDesktopNodeAndPath();
        if (!desktopInfo || !desktopInfo.node?.children) {
            return;
        }

        const folders = desktopInfo.node.children;

        folders.forEach(folder => {
            if (!folder?.name) return;

            const liFolder = document.createElement("li");
            liFolder.className = "menu-item folder-item";

            const folderPath = [...desktopInfo.path, folder.name];
            liFolder.dataset.path = folderPath.join("/");

            liFolder.innerHTML = `
                <div class="folder-entry" data-path="${folderPath.join("/")}">
                    <img src="${folder.folderImage}" alt="${escapeHtml(folder.name)}" class="menu-icon" />
                    <div class="menu-text">
                        <div class="menu-name">${escapeHtml(folder.name)}</div>
                        <div class="menu-count">${folder.children?.length || 0} items</div>
                    </div>
                </div>
            `;
            menuList.appendChild(liFolder);

            if (Array.isArray(folder.children)) {
                folder.children.slice(0, 2).forEach(child => {
                    if (!child?.name) return;

                    const liChild = document.createElement("li");
                    liChild.className = "menu-item preview-item";

                    const childPath = [...desktopInfo.path, folder.name, child.name];
                    liChild.dataset.path = childPath.join("/");

                    liChild.innerHTML = `
                        <button class="menu-link" data-path="${childPath.join("/")}">
                            <img src="${child.image}" alt="${escapeHtml(child.name)}" class="menu-icon" />
                            <div class="menu-name">${escapeHtml(child.name)}</div>
                        </button>
                    `;
                    menuList.appendChild(liChild);
                });
            }
        });

        attachOpenHandlers();
    }

    /* ============================================================
     *  renderSearchResults — 검색
     * ============================================================ */
    function renderSearchResults(keyword) {
        menuList.innerHTML = "";
        const results = searchFinder(keyword);

        const header = document.querySelector('.menu-header');
        if (header) header.textContent = `Search Results for "${keyword}"`;

        if (!results.length) {
            const allItems = flattenFinderData();

            allItems.forEach(item => {
                const li = document.createElement('li');
                li.className = `menu-item ${item.type}-item`;
                const path = item.path || [];

                li.dataset.path = path.join('/');
                li.innerHTML = `
                    <button class="menu-link" data-path="${path.join('/')}">
                        <img src="${item.image}" class="menu-icon" />
                        <div class="menu-text">
                            <div class="menu-name">${escapeHtml(item.name)}</div>
                            <div class="menu-root">${path.join('/')}</div>
                        </div>
                    </button>
                `;
                menuList.appendChild(li);
            });

            attachOpenHandlers();
            return;
        }

        results.forEach(item => {
            const li = document.createElement("li");
            li.className = `menu-item ${item.type}-item`;

            const path = item.path || [];
            li.dataset.path = path.join("/");

            li.innerHTML = `
                <button class="menu-link" data-path="${path.join("/")}">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="menu-icon" />
                    <div class="menu-text">
                        <div class="menu-name">${escapeHtml(item.name)}</div>
                    </div>
                </button>
            `;
            menuList.appendChild(li);
        });

        attachOpenHandlers();
    }

    /* ============================================================
     *  attachOpenHandlers — Finder 열기
     * ============================================================ */
    function attachOpenHandlers() {
        const items = menuList.querySelectorAll(".menu-item");

        items.forEach(item => {
            const clone = item.cloneNode(true);
            item.replaceWith(clone);
        });

        menuList.querySelectorAll(".menu-item").forEach(item => {
            const link = item.querySelector(".menu-link");
            const folderEntry = item.querySelector(".folder-entry");

            if (link) {
                link.addEventListener("click", () => {
                    const raw = link.dataset.path || item.dataset.path;
                    handleOpenPathRaw(raw);
                });
            } else if (folderEntry) {
                folderEntry.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const raw = folderEntry.dataset.path || item.dataset.path;
                    handleOpenPathRaw(raw);
                });
            } else {
                item.addEventListener("click", () => {
                    const raw = item.dataset.path;
                    handleOpenPathRaw(raw);
                });
            }
        });
    }

    /* ============================================================
     *  Finder path 열기 — 공통 닫기 함수 사용
     * ============================================================ */
    function handleOpenPathRaw(rawPath) {
        if (!rawPath) return;
        const arr = rawPath.split("/").filter(Boolean);
        if (!arr.length) return;

        const node = findNodeByPath(arr);

        closeDockMenu();

        if (node && node.type && node.type.toLowerCase() === 'app') {
            if (window.WindowControls?.openApp) {
                try {
                    window.WindowControls.openApp(node.name.toLowerCase());
                }
                catch { }
            }
            return;
        }

        if (window.Finder?.openPath) {
            try { window.Finder.openPath(arr); } catch { }
        }
        if (window.WindowControls?.openApp) {
            try { window.WindowControls.openApp("finder", { path: arr }); } catch { }
        }
    }

    function findNodeByPath(pathArr) {
        if (!window.Finder?.finderData) return null;

        let current = window.Finder.finderData;

        for (let i = 1; i < pathArr.length; i++) {
            const name = pathArr[i];
            if (!current.children) return null;
            current = current.children.find(c => c.name === name);
            if (!current) return null;
        }
        return current;
    }

    /* ============================================================
     *  검색 input 이벤트
     * ============================================================ */
    if (searchInput) {
        const inputEl = searchInput.tagName === "INPUT"
            ? searchInput
            : searchInput.querySelector("input");

        if (inputEl) {
            inputEl.addEventListener("input", (e) => {
                const v = e.target.value.trim();
                if (!v) renderRecent();
                else renderSearchResults(v.toLowerCase());
            });

            inputEl.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const q = inputEl.value.trim();
                    if (!q) return;

                    const res = searchFinder(q.toLowerCase());
                    if (res.length) {
                        const path = res[0].path;
                        handleOpenPathRaw(path.join("/"));
                    }
                }
            });
        }
    }

    /* ============================================================
     *  Dock 아이콘 클릭 (토글)
     * ============================================================ */
    dockStart.addEventListener("click", (e) => {
        e.stopPropagation();

        const willOpen = !dockMenu.classList.contains("active");
        dockMenu.classList.toggle("active");

        if (willOpen) {
            renderRecent();

            const el = searchInput?.tagName === "INPUT"
                ? searchInput
                : searchInput?.querySelector("input");
            if (el) setTimeout(() => el.focus(), 60);
        } else {
            closeDockMenu();
        }
    });

    /* ============================================================
     *  외부 클릭 시 닫기
     * ============================================================ */
    document.addEventListener("click", (e) => {
        if (!dockMenu.classList.contains("active")) return;
        if (dockMenu.contains(e.target)) return;
        if (dockStart.contains(e.target)) return;

        closeDockMenu();
    });

    /* ============================================================
     *  Finder Ready
     * ============================================================ */
    function initializeMenuOnReady() {
        if (window.Finder?.finderData) {
            if (dockMenu.classList.contains("active")) renderRecent();
        } else {
            const onReady = () => {
                if (dockMenu.classList.contains("active")) renderRecent();
                window.removeEventListener("FinderReady", onReady);
            };
            window.addEventListener("FinderReady", onReady);
        }
    }

    initializeMenuOnReady();
}