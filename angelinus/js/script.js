$(document).ready(function () {
    const $html = $("html");
    const lastPage = $("#container div").length;
    const menuIcon = $(".menu_icon");
    const currentScrollBar = $("#scroll-bar .scroll-current");
    const progressScrollBar = $("#scroll-bar .scroll-progress-bar-ing");
    const ACTIVE_CLASS = "active";
    let page = 1;
    let posTop = (page - 1) * $(window).height();

    function animatePage2() {
        $("#ment-under").delay(100).animate({ width: "310px" }, 500);
        $("#ment").delay(500).animate({ top: "0", opacity: "1" }, 800);

        const categoryLength = $("#category li");
        let tmp = 0;
        if (tmp < categoryLength.length) {
            setInterval(() => {
                categoryLength.eq(tmp).delay(500).animate({ left: "0", opacity: "1" }, 800);
                tmp++;
                if (tmp >= categoryLength) clearInterval();
            }, 100);
        }
        $("#circle").delay(500).animate({ left: "35px" }, 800)
    };

    // default wheel event delete
    window.addEventListener("wheel", function (event) {
        event.preventDefault();
    }, { passive: false });

    // if refresh, move to first section 
    history.scrollRestoration = "manual";

    //  logo click, scroll top
    $("header .logo").click(function () {
        page = 1;
        posTop = (page - 1) * $(window).height();
        $html.animate({ scrollTop: posTop }, 300, "swing");
        currentScrollBar.html("01");
        progressScrollBar.css("height", "25%");
    });

    // bamburger menu
    menuIcon.click(function (event) {
        event.preventDefault();
        menuIcon.toggleClass(ACTIVE_CLASS);
        $("#gnb").toggleClass(ACTIVE_CLASS);
    });

    // gnb click to page
    $("#gnb li").click(function () {
        const gnbIndex = $(this).index() + 1;
        console.log(gnbIndex);
        switch (gnbIndex) {
            case 1:
                page = 1;
                posTop = (page - 1) * $(window).height();
                $html.animate({ scrollTop: posTop }, 800, "swing");
                currentScrollBar.html("01");
                progressScrollBar.css("height", "25%");
                console.log(posTop);
                floatImgOff();
                break;
            case 2:
                page = 2;
                posTop = (page - 1) * $(window).height();
                $html.animate({ scrollTop: posTop }, 800, "swing");
                currentScrollBar.html("02");
                progressScrollBar.css("height", "50%");
                console.log(posTop);

                animatePage2();
                floatImgOff();
                break;
            case 3:
                page = 3;
                posTop = (page - 1) * $(window).height();
                $html.animate({ scrollTop: posTop }, 800, "swing");
                currentScrollBar.html("03");
                progressScrollBar.css("height", "75%");
                console.log(posTop);
                floatImgOff();
                break;
            case 4:
                page = 4;
                posTop = (page - 1) * $(window).height();
                $html.animate({ scrollTop: posTop }, 800, "swing");
                currentScrollBar.html("04");
                progressScrollBar.css("height", "100%");
                floatImgOn();
                break;
        };
        menuIcon.toggleClass(ACTIVE_CLASS);
        $("#gnb").toggleClass(ACTIVE_CLASS);
    });

    // wheel scroll event
    $(window).on("wheel", (event) => {
        // if scrolling page, scroll x
        if ($html.is(":animated")) return;
        // last section scroll down x
        if (event.originalEvent.deltaY > 0) {
            if (page == lastPage) return;
            page++;
        }
        // first section scroll up x
        else if (event.originalEvent.deltaY < 0) {
            if (page == 1) return;
            page--;
        }
        // height to scrolling
        posTop = (page - 1) * $(window).height();
        $html.animate({ scrollTop: posTop }, 800, "swing");

        // scroll-bar
        if (page == 1) {
            currentScrollBar.html("01");
            progressScrollBar.css("height", "25%");
            floatImgOff();
        }
        else if (page == 2) {
            currentScrollBar.html("02");
            progressScrollBar.css("height", "50%");

            animatePage2();
            floatImgOff();
        }
        else if (page == 3) {
            currentScrollBar.html("03");
            progressScrollBar.css("height", "75%");
            floatImgOff();
        }
        else if (page >= 4) {
            currentScrollBar.html("04");
            progressScrollBar.css("height", "100%");
            floatImgOn();
        }
    });

    let slideImgNum = 1;
    const slideImg = $(".slideImg");
    const slideCurrent = $(".slide-current");
    function changeNumber() {
        switch (slideImgNum) {
            case 1:
                slideCurrent.html("1");
                break;
            case 2:
                slideCurrent.html("2");
                break;
            case 3:
                slideCurrent.html("3");
                break;
        };
    }

    // next slide button
    $(".slideButton button.next").click(function () {
        if (slideImg.is(":animated")) return;

        slideImg.animate({ left: "-100%" }, 800, function () {
            slideImg.removeAttr("style").children(":first").appendTo(slideImg);
        });

        if (slideImgNum < 3) slideImgNum += 1;
        else slideImgNum -= 2;

        changeNumber();
    });

    // previous slide button
    $(".slideButton button.prev").click(function () {
        if (slideImg.is(":animated")) return;

        slideImg.prepend(slideImg.children(":last")).css({ left: "-100%" }).animate({ left: 0 }, 800);

        if (slideImgNum > 1) slideImgNum -= 1;
        else slideImgNum += 2;

        changeNumber();
    });

    // page2 category list click event
    $("#category li").click(function () {
        const listIndex = $(this).index() + 1;
        const $imgList = $("#img-list");
        if ($imgList.is(":animated")) return;

        switch (listIndex) {
            case 1:
                $imgList.animate({ top: "10%" }, 800);
                break;
            case 2:
                $imgList.animate({ top: "-130%" }, 800);
                break;
            case 3:
                $imgList.animate({ top: "-265%" }, 800);
                break;
            case 4:
                $imgList.animate({ top: "-370%" }, 800);
                break;
            case 5:
                $imgList.animate({ top: "-470%" }, 800);
                break;
        };
    });

    // page3 md-list click event
    $("#md-list li").click(function() {
        const mdIndex = $(this).index() + 1;

        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    // page4 floatImg event
    function floatImgOn() {
        const $floatList = $("#floatingWrap ul");
        $floatList.addClass(ACTIVE_CLASS);
    };

    function floatImgOff() {
        const $floatList = $("#floatingWrap ul");
        $floatList.removeClass(ACTIVE_CLASS);
    };
});