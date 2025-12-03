document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.common');
    const nextBtn = document.querySelector('.right_arrow');
    const prevBtn = document.querySelector('.left_arrow');
    const slideIndicator = document.querySelector('.slide_present');
    const slideBar = document.querySelector('.slide_bar');
    const menuIcon = document.querySelector('.menu_icon');
    const lines = document.querySelectorAll('.line');
    const menuListBtn = document.querySelectorAll('.menu_list .item a');
    const menuBtn = document.querySelector('.menuBtn');
    const menuList = document.querySelector('.menu_list');
    const loadingScreen = document.getElementById('loadingScreen');
    const logoRect = document.getElementById('logoRect');
    const logo = document.querySelector('.logo');

    let currentIndex = 0;
    let intervalId = null;

    /* ------------------------------------slide--------------------------------------- */
    // ------------------------SlideBar-----------------------------------
    function updateSlideBar(index) {
        const totalSlides = sections.length;
        const presentWidth = slideBar.clientWidth / totalSlides;
        slideIndicator.style.left = `${index * presentWidth}px`;
    }

    // ------------------------Slide Buttons-----------------------------------
    nextBtn.addEventListener('click', () => { moveSection(1); resetAutoSlide(); });
    prevBtn.addEventListener('click', () => { moveSection(-1); resetAutoSlide(); });

    /* ------------------------------------Functions--------------------------------------- */
    // ------------------------Helper Functions-----------------------------------
    function moveSection(direction) {
        currentIndex = (currentIndex + direction + sections.length) % sections.length;
        showSection(currentIndex);
    }

    // slideStart
    function startAutoSlide() {
        intervalId = setInterval(() => moveSection(1), 15000);
    }

    // reset slide
    function resetAutoSlide() {
        clearInterval(intervalId);
        startAutoSlide();
    }

    // section animation 
    function showSection(index) {
        sections.forEach((section, i) => {
            const isActive = i === index;
            section.classList.toggle('active', isActive);

            if (i === 0) {
                document.querySelector('.black_inner').classList.toggle('active', isActive);
                document.querySelector('.white_inner').classList.toggle('active', isActive);
            }

            if (i === 1) isActive ? startPenAnimation() : stopPenAnimation();
            if (i === 3) isActive ? startBlurWindow() : stopBlurWindow();
        });

        updateSlideBar(index);
    }

    /* ------------------------------------section_animation--------------------------------------- */
    // ------------------------Section_2-----------------------------------
    // 펜 애니메이션이 적용될 요소들을 객체로 저장
    const penElements = {
        lid1: document.querySelector('.pen_lid_1'),
        lid2: document.querySelector('.pen_lid_2'),
        body: document.querySelector('.pen_body'),
        shadow: document.querySelector('.pen_shadow')
    };

    let penAnimFrame = null; // 
    let baseX = 0, baseY = 0, targetBaseX = 0, targetBaseY = 0, angle = 0;
    const radius1 = 10, radius2 = 15, speed = 0.01;

    function animatePen() {
        angle += speed;
        baseX += (targetBaseX - baseX) * 0.1;
        baseY += (targetBaseY - baseY) * 0.1;

        const offsetX1 = Math.cos(angle) * radius1;
        const offsetY1 = Math.sin(angle) * radius1;
        const offsetX2 = Math.cos(angle + Math.PI / 2) * radius2;
        const offsetY2 = Math.sin(angle + Math.PI / 2) * radius2;

        penElements.lid1.style.transform = `translate(${baseX + offsetX1}px, ${baseY + offsetY1}px)`;
        penElements.lid2.style.transform = `translate(${baseX + offsetX1}px, ${baseY + offsetY1}px)`;
        penElements.body.style.transform = `translate(${baseX + offsetX2}px, ${baseY + offsetY2}px)`;
        penElements.shadow.style.transform = `translate(${baseX + offsetX2}px, ${baseY + offsetY2}px)`;

        penAnimFrame = requestAnimationFrame(animatePen);
    }

    function startPenAnimation() {
        if (!penAnimFrame) animatePen();
    }

    function stopPenAnimation() {
        cancelAnimationFrame(penAnimFrame);
        penAnimFrame = null;
    }

    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        targetBaseX = ((e.clientX - centerX) / centerX) * 70;
        targetBaseY = ((e.clientY - centerY) / centerY) * 70;
    });

    // ------------------------Section_4-----------------------------------
    const blurData = {};
    function startBlurWindow() {
        const blurWindow = document.querySelector('#section_4 .blur_window');
        const bgBlur = document.querySelector('#section_4 .bg_blur');
        if (!blurWindow || !bgBlur) return;

        blurData.pos = 0;
        blurData.dir = 1;
        blurData.last = null;
        blurData.totalWidth = 1100;
        blurData.windowWidth = 65;
        blurData.speed = 90;
        blurData.blurWindow = blurWindow;
        blurData.animFrame = requestAnimationFrame(stepBlur);

        blurWindow.style.width = `${blurData.windowWidth}px`;
        blurWindow.style.backgroundImage = getComputedStyle(bgBlur).backgroundImage;
        blurWindow.style.backgroundRepeat = 'no-repeat';
        blurWindow.style.backgroundSize = getComputedStyle(bgBlur).backgroundSize;
        blurWindow.style.backgroundPosition = getComputedStyle(bgBlur).backgroundPosition;
        console.log('startBlurWindow')
    }

    function stepBlur(t) {
        if (blurData.last === null) {
            blurData.last = t;
            blurData.animFrame = requestAnimationFrame(stepBlur);
            return;
        }

        const dt = (t - blurData.last) / 1000;
        blurData.last = t;

        blurData.pos += blurData.dir * blurData.speed * dt;
        if (blurData.pos >= blurData.totalWidth - blurData.windowWidth || blurData.pos <= 0) {
            blurData.dir *= -1;
        }

        const startX = window.innerWidth / 2 - blurData.totalWidth / 2;
        const x = startX + blurData.pos;
        blurData.blurWindow.style.transform = `translateX(${x}px)`;

        blurData.blurWindow.style.backgroundPosition = `${-x}px 0`;

        blurData.animFrame = requestAnimationFrame(stepBlur);
        console.log('stepBlur')
    }

    function stopBlurWindow() {
        cancelAnimationFrame(blurData.animFrame);
        blurData.animFrame = null;
        blurData.last = null;
        console.log('stopBlurWindow')
    }

    /* ------------------------------------Menu&UI--------------------------------------- */
    // menuIcon_animate
    menuIcon.addEventListener('mouseenter', () => {
        lines.forEach((line, i) => setTimeout(() => {
            line.style.transformOrigin = '100% 50%';
            line.style.transform = 'scaleX(0)';
        }, i * 100));

        setTimeout(() => {
            lines.forEach((line, i) => setTimeout(() => {
                line.style.transformOrigin = '0% 50%';
                line.style.transform = 'scaleX(1)';
            }, i * 100));
        }, 1000);
    });

    // menuList_click_move_to_section
    menuListBtn.forEach((anchor, index) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            currentIndex = index;
            showSection(currentIndex);
            resetAutoSlide();
        });
    });

    // MenuIcon_click_menuList_toggle_animate
    menuBtn.addEventListener('click', () => menuList.classList.toggle('active'));

    // logo_click_refresh
    logo.addEventListener('click', () => location.reload());

    /* ------------------------Loading----------------------------------- */
    // loadingScreen_off_delay
    if (logoRect) setTimeout(() => logoRect.style.width = '100%', 500);

    // 
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            showSection(currentIndex);
            startAutoSlide();
        }, 2500);
    });


});