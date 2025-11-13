import { initFinder } from "./finder.js"; // Finder 열기 기능 사용

export function initDockMenu() {
    const dockStart = document.querySelector(".dock-start");
    const dockMenu = document.querySelector(".dock-menu");
    const menuList = dockMenu?.querySelector(".menu-list");
    const searchInput = dockMenu?.querySelector(".menu-search input");

    if (!dockStart || !dockMenu) return;

    /** 메뉴 토글 */
    dockStart.addEventListener("click", (e) => {
        e.stopPropagation();
        dockMenu.classList.toggle("active");

        if (dockMenu.classList.contains("active")) {
            renderRecentFolders();

            setTimeout(() => {
                searchInput?.focus();
            }, 100);
        }
    });

    /** 바깥 클릭 시 닫기 */
document.addEventListener('click', (e) => {
    if (dockMenu.classList.contains('active') && !dockMenu.contains(e.target) && !dockStart.contains(e.target)) {
        dockMenu.classList.remove('active');
    }
})

    /** 검색 */
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const keyword = e.target.value.trim().toLowerCase();
            if (keyword) {
                renderSearchResults(keyword);
            } else {
                renderRecentFolders();
            }
        });
    }

    /** 최근 폴더 렌더링 */
    function renderRecentFolders() {
        if (!menuList) return;
        menuList.innerHTML = "";

        const desktop = window.initFinder?.getDesktop?.(); // finder.js 내부 Desktop 반환 함수
        if (!desktop || !desktop.children) return;

        desktop.children.forEach((folder) => {
            if (!folder.children) return;

            // 폴더 기본
            const li = document.createElement("li");
            li.classList.add("menu-item");

            li.innerHTML = `
                <article class="folder-entry" data-folder="${folder.name}">
                    <img src="./images/folder.png" alt="${folder.name}" class="menu-icon" />
                    <div>
                        <h3 class="menu-name">${folder.name}</h3>
                        <p class="menu-count">${folder.children.length} items</p>
                    </div>
                </article>
            `;

            // 하위 아이템 2개 미리보기
            const subList = document.createElement("ul");
            subList.classList.add("menu-sublist");
            folder.children.slice(0, 2).forEach((child) => {
                const subItem = document.createElement("li");
                subItem.innerHTML = `
                    <a href="#" class="menu-link" data-path="${folder.name}/${child.name}">
                        <img src="./images/file.png" alt="${child.name}" />
                        <span>${child.name}</span>
                    </a>
                `;
                subList.appendChild(subItem);
            });

            li.appendChild(subList);
            menuList.appendChild(li);
        });

        attachOpenHandlers();
    }

    /** 검색 결과 렌더링 */
    function renderSearchResults(keyword) {
        if (!menuList) return;
        menuList.innerHTML = "";

        const results = window.initFinder?.search?.(keyword);
        if (!results || !results.length) {
            menuList.innerHTML = `<li class="no-results">"${keyword}"에 대한 결과가 없습니다.</li>`;
            return;
        }

        results.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <a href="#" class="menu-link" data-path="${item.path.join("/")}">
                    <img src="./images/file.png" alt="${item.name}" />
                    <span>${item.name}</span>
                </a>
            `;
            menuList.appendChild(li);
        });

        attachOpenHandlers();
    }

    /** initFinder 경로 열기 */
    function attachOpenHandlers() {
        const links = menuList.querySelectorAll(".menu-link");
        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const path = link.dataset.path.split("/");

                dockMenu.classList.remove("active");
                if (window.initFinder && typeof window.initFinder.openPath === "function") {
                    window.initFinder.openPath(["Users", "Seonjin", "Desktop", ...path]);
                }
            });
        });
    }



    if (!window.Finder || !window.Finder.getDesktop) {
        console.warn('[DockMenu] Finder not initialized yet.');
        return;
    }

    // /** 초기화: 모바일에서는 메뉴 로직 비활성화 */
    // if (window.innerWidth < 768) {
    //     dockMenu.remove();
    //     return;
    // }
}