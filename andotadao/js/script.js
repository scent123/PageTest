$(document).ready(() => {
    $('body').on("selectstart", function (event) { return false; });	// 마우스 클릭 후 드래그 방지
    $('body').on("dragstart", function (event) { return false; });	//마우스 드래그 방지
    var flag_1 = 0;
    var flag_2 = 1;
    var flag_3 = 0;
    var flag_4 = 1;
    var height = 0;
    var flag_start = 1;
    var lineIndex = 0;

    // 새로고침시 스크롤 탑
    setTimeout(() => {
        scrollTo(0, 0);
        // 동작 방지
        flag_start = 0;
        flag_1 = 0;
        flag_2 = 1;
        flag_3 = 0;
        flag_4 = 1;
        height = 0;
        $('body').css('overflow', 'hidden');
    }, 100);

    // page_1
    setTimeout(() => {
        // show line
        $("#line").fadeIn('slow');
    }, 800);

    // line spread
    setTimeout(() => {
        // vertical
        $("#vertical>hr:nth-child(" + 1 + ")").animate({ top: '20.3vh' }, 1000)
        $("#vertical>hr:nth-child(" + 2 + ")").animate({ top: '45.6vh' }, 1000)
        $("#vertical>hr:nth-child(" + 3 + ")").animate({ top: '54.5vh' }, 1000)
        $("#vertical>hr:nth-child(" + 4 + ")").animate({ top: '79.9vh' }, 1000)

        // horizontal
        $("#horizontal>hr:nth-child(" + 1 + ")").animate({ left: '-29.9vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 2 + ")").animate({ left: '-24.9vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 3 + ")").animate({ left: '-20.1vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 4 + ")").animate({ left: '-19.3vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 5 + ")").animate({ left: '-12.3vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 6 + ")").animate({ left: '-11.3vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 7 + ")").animate({ left: '-7.5vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 8 + ")").animate({ left: '-6.5vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 9 + ")").animate({ left: '-0.7vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 10 + ")").animate({ left: '0.9vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 11 + ")").animate({ left: '4.3vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 12 + ")").animate({ left: '4.6vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 13 + ")").animate({ left: '11.6vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 14 + ")").animate({ left: '13vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 15 + ")").animate({ left: '17.1vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 16 + ")").animate({ left: '18.1vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 17 + ")").animate({ left: '23.7vw' }, 1000)
        $("#horizontal>hr:nth-child(" + 18 + ")").animate({ left: '28.8vw' }, 1000)
    }, 1300);

    setTimeout(() => {
        // show text
        $(".bg").fadeIn(1000);
        // hide line
        setTimeout(() => {
            // hide line
            $("#line").fadeOut('500');
            // scroll on
            setTimeout(() => {
                $("body").css("overflow", 'hidden visible');
            }, 1000);
        }, 1500);
    }, 2000);

    $(window).scroll(() => {
        // 스크롤된 높이
        if (flag_start == 0) {
            height = $(this).scrollTop();
        }
        else {
            height = 0;
        }

        // -------------------page_1---------------------------
        // #page_1의 높이
        var viewHeight1 = $("#page_1").innerHeight();

        // 현재 스크롤의 높이가 #page_1의 높이보다 작거나 같을 때
        if (viewHeight1 >= height) {
            // 텍스트 고정
            $("#page_1>p").css('position', 'sticky');
            // 텍스트의 배경이미지 y좌표가 0px보다 작거나 같을 때
            if (height >= 0) {
                // 배경 이미지의 y좌표가 -1130px보다 크거나 같을 때
                if (height <= 1130) {
                    // 배경 이미지의 y좌표값 변경
                    $("#page_1>p").css('background-position-y', `-${height}px`);
                }
            }
        }
        // 현재 스크롤의 높이가 #page_1의 높이보다 크거나 같을 때
        else if (height >= viewHeight1) {
            // 텍스트 고정 해제
            $("#page_1>p").css('position', 'fixed');
        }

        // -------------------page_2---------------------------

        // #page_2의 높이
        var viewheight2 = $("#page_2").innerHeight();
        // 스크롤 높이가 #page_2 +(스크롤 높이 / 5)보다 크거나 같을 때
        if (flag_1 == 0 && height >= viewheight2 + (height / 4) && height >= viewHeight1) {
            // 스크롤 막기
            $("body").css('overflow', 'hidden');
            // 멘트 출현
            $("#page_2>.ment").css({ position: 'sticky', opacity: '1' });
            $("#page_2>.img_text").css('position', 'sticky');
            // 멘트 사라짐
            setTimeout(() => {
                $("#page_2>.ment").css('opacity', '0');
                // 이미지, 텍스트 나타남
                setTimeout(() => {
                    $("#page_2>.img_text").css('opacity', '1');
                    $("#page_2>.img_text>.img").delay(1000).css('left', '20px');
                    $("#page_2>.img_text>.text").css({ opacity: '0.1', right: '0' });
                    setTimeout(() => {
                        $("#page_2>.img_text>.text").delay(1000).css({ opacity: '0.8', right: '0' });
                        $("body").css('overflow', 'hidden visible');
                    }, 1300);
                    flag_1 = 1;
                }, 1100);
            }, 1000);
        }
        // 스크롤 높이가 #page_2 + (스크롤 높이 / 5)보다 작거나 같을 때
        else if (flag_1 == 1 && height <= viewheight2 + (height / 4)) {
            $("#page_2>.ment").css('opacity', '0');
            $("#page_2>.img_text").css('opacity', '0');
            $("#page_2>.img_text>.img").delay(1000).css('left', '-100%');
            $("#page_2>.img_text>.text").delay(1000).css({ opacity: '0', right: '-100%' });
            flag_1 = 0;
        }

        // -------------------page_3---------------------------

        var viewheight3 = $("#page_3").innerHeight();
        var textLine = $("#page_3>.img_text>.text_box>li");

        // #page_2 효과 제거
        if (flag_1 == 1 && height > viewheight3 * 1.8) {
            $("#page_2>.img_text").css({ opacity: '0' });
            $("#page_2>.img_text>.text").css({ right: '55%' });
            $("#page_2>.img_text>.img").css({ opacity: '0', left: '50%' });
        }
        // 위로 스크롤시 #page_2 효과 나타나기
        else if (flag_1 == 1 && height < viewheight3 * 1.8) {
            $("#page_2>.img_text").css({ opacity: '1' });
            $("#page_2>.img_text>.text").css({ right: '0' });
            $("#page_2>.img_text>.img").css({ opacity: '1', left: '20px' });
        }
        // #page_3 효과
        if (height >= viewheight3 + (height / 2.2)) {
            $("#page_3>.img_text").css({ opacity: '1', position: 'sticky', top: '20vh' });
            $("#page_3>.img_text>.text_box").delay(800).css({ opacity: '1', left: '30px' });
            $("#page_3>.img_text>img").delay(800).css({ opacity: '1', left: '64%' });
            if (lineIndex < textLine.length) {
                setTimeout(() => {
                    $("body").css("overflow", "hidden");
                    var showText = setInterval(() => {
                        textLine.eq(lineIndex).css('opacity', '0.8');
                        lineIndex++;
                        if (lineIndex >= textLine.length) {
                            clearInterval(showText);
                            $("body").css("overflow", "hidden visible");
                        }
                    }, 1000);
                }, 500);
            }
        }
        // #page_3 효과 제거
        else {
            $("#page_3>.img_text").css({ opacity: '0', position: 'absolute' });
            $("#page_3>.img_text>.text_box").css({ opacity: '0', left: '65%' });
            $("#page_3>.img_text>.text_box>li").css({ opacity: '0.1', left: '65%' });
            $("#page_3>.img_text>img").css({ opacity: '0', left: '30%' });
            lineIndex = 0;
        }

        // -------------------page_4---------------------------
        var viewheight4 = $('#page_4').innerHeight();
        // #page_3 효과 제거
        if (height > 4960) {
            $("#page_3>.img_text").css({ opacity: '0' });
            $("#page_3>.img_text>.text_box").delay(800).css({ opacity: '0', left: '65%' });
            $("#page_3>.img_text>img").delay(800).css({ opacity: '0', left: '30%' });
        }
        if (height >= Math.floor(viewheight4 * 3.011) && flag_2 == 0) {
            // 스크롤 금지
            $("body").css('overflow', 'hidden');
            // 멘트 등장
            $('#page_4>.ment').css({ opacity: '1', position: 'sticky' });
            setTimeout(() => {
                // 멘트 사라짐
                $('#page_4>.ment').css('opacity', '0');
                setTimeout(() => {
                    $("#ver_list>li:nth-child(odd)>a").css({ left: '0', 'opacity': '1' });
                    $("#ver_list>li:nth-child(odd)>a:first-child").css({ left: '0', 'opacity': '1' });
                    $("#ver_list>li:nth-child(even)>a").css({ left: '0', 'opacity': '1' });
                    $("#ver_list>li:nth-child(even)>a:first-child").css({ left: '0', 'opacity': '1' });
                    setTimeout(() => {
                        $("body").css('overflow', 'hidden visible');
                    }, 1000);
                }, 1500);
                flag_2 = 1;
            }, 1000);
        }
        else if (flag_2 == 1 && height <= viewheight4 * 2.6) {
            $('#page_4>.ment').css('opacity', '0');

            $("#ver_list>li:nth-child(odd)>a").css({ left: '70%', 'opacity': '0' });
            $("#ver_list>li:nth-child(odd)>a:first-child").css({ left: '-120%', 'opacity': '0' });
            $("#ver_list>li:nth-child(even)>a").css({ left: '-70%', 'opacity': '0' });
            $("#ver_list>li:nth-child(even)>a:first-child").css({ left: '120%', 'opacity': '0' });
            flag_2 = 0;
        }

        // -------------------page_5---------------------------
        var viewheight5 = $('#page_5').innerHeight();
        if (height >= viewheight5 * 7.99 && flag_3 == 0) {
            $('#page_5>.ment').css('opacity', '1');
            $('body').css('overflow', 'hidden');
            setTimeout(() => {
                $('#page_5>.ment').css('opacity', '0');
                $('#hor_list').css('opacity', '1');
                $('#hor_list').css('left', '-460px');
                $('#hor_list>li:first-child').css({ left: '15%', top: '50px', opacity: '1' });
                $('#hor_list>li:last-child').css({ left: '5%', top: '530px', opacity: '1' });
                $("body").delay(1000).css('overflow', 'hidden');
                flag_3 = 1;
                flag_4 = 1;

                setTimeout(() => {
                    $('body').on('mousewheel', (e) => {
                        var hor_list_left = $('#hor_list').css('left');
                        var wheelDelta = e.originalEvent.wheelDelta;
                        var limitLeft = $(hor_list).position().left;

                        // hor_list left scroll
                        if ($('#modal').css('display') == 'none' && flag_4 == 1 && height >= viewheight5 * 8 && limitLeft < 500) {
                            $('body').css('overflow', 'hidden');
                            // scroll up
                            if (wheelDelta > 0 && limitLeft < 500) {
                                $('#hor_list').css('left', `+=${wheelDelta + 80}`);
                            }
                            // scroll down
                            else if (wheelDelta < 0 && limitLeft > -1200) {
                                $('#hor_list').css('left', `+=${wheelDelta - 80}`);
                            }
                        }
                        // page up
                        else if (hor_list_left > `${500}px` && flag_3 == 1) {
                            $("body").css('overflow', 'hidden visible');
                            flag_4 = 0;
                        }
                    });
                }, 100);
            }, 2000);
        }
        else if (height <= viewheight5 * 7.8 && flag_3 == 1) {
            $("body").css('overflow', 'hidden visible');
            $('#page_5>.ment').css('opacity', '0');
            $('#hor_list').css('opacity', '0');
            $('#hor_list >li:first-child').css({ left: '-250%', top: '100%' });
            $('#hor_list >li:last-child').css({ left: '250%', bottom: '100%' });
            flag_3 = 0;
            flag_4 = 0;
        }
    });

    // ---------------------------------modal------------------------------------------
    var modal = $("#modal");
    var photo = $("#photo");
    var photoList = $("#ver_list > li > a");
    var photoList2 = $("#hor_list > li > a");
    var imgIndex = 0;
    var imgIndex2 = 0;

    // 인덱스에 따라 이름 변환
    function changeName1(index) {
        switch (index) {
            case 0:
                $("#modal>.content>.name>.name_2").text('Church of Light');
                $("#modal>.content>.name>.name_3").text('Osaka in Japan');
                break;
            case 1:
                $("#modal>.content>.name>.name_2").text('Poly Grand Theater');
                $("#modal>.content>.name>.name_3").text('Sanghai in China');
                break;
            case 2:
                $("#modal>.content>.name>.name_2").text('House in Utsubo Park');
                $("#modal>.content>.name>.name_3").text('Osaka in Japan');
                break;
            case 3:
                $("#modal>.content>.name>.name_2").text("Museum SAN's");
                $("#modal>.content>.name>.name_3").text('Gangwondo in Korea');
                break;
            case 4:
                $("#modal>.content>.name>.name_2").text('Valley Gallery');
                $("#modal>.content>.name>.name_3").text('Naoshima in Japan');
                break;
            case 5:
                $("#modal>.content>.name>.name_2").text('Azuma House');
                $("#modal>.content>.name>.name_3").text('Osaka in Japan');
                break;
            case 6:
                $("#modal>.content>.name>.name_2").text('Church of the Heart');
                $("#modal>.content>.name>.name_3").text('Yeaju in Korea');
                break;
            case 7:
                $("#modal>.content>.name>.name_2").text('Ando Museum');
                $("#modal>.content>.name>.name_3").text('Naoshima in Japan');
                break;
            case 8:
                $("#modal>.content>.name>.name_2").text('Church of Hiroo');
                $("#modal>.content>.name>.name_3").text('Tokyo in Japan');
                break;
            case 9:
                $("#modal>.content>.name>.name_2").text('He Art Museum(HEM)');
                $("#modal>.content>.name>.name_3").text('Gwangdong in China');
                break;
            case 10:
                $("#modal>.content>.name>.name_2").text('Meditation Space');
                $("#modal>.content>.name>.name_3").text('Paris in France');
                break;
            case 11:
                $("#modal>.content>.name>.name_2").text('Osaka Prefectural Sayamaike Museum');
                $("#modal>.content>.name>.name_3").text('Osaka in Japan');
                break;
        }
    }

    // 인덱스에 따라 이름 변환
    function changeName2(index) {
        switch (index) {
            case 0:
                $("#modal>.content>.name>.name_2").text('Water Temple');
                $("#modal>.content>.name>.name_3").text('Honpukuji in Japan');
                break;
            case 1:
                $("#modal>.content>.name>.name_2").text('Church of Water');
                $("#modal>.content>.name>.name_3").text('Hokkaido in Japan');
                break;
            case 2:
                $("#modal>.content>.name>.name_2").text('Koshino House');
                $("#modal>.content>.name>.name_3").text('Osaka in Japan');
                break;
            case 3:
                $("#modal>.content>.name>.name_2").text('Yumin Art Nouveau Collection');
                $("#modal>.content>.name>.name_3").text('Jeju in Korea');
                break;
            case 4:
                $("#modal>.content>.name>.name_2").text('Chichu Art Museum');
                $("#modal>.content>.name>.name_3").text('Naoshima in Japan');
                break;
            case 5:
                $("#modal>.content>.name>.name_2").text('Ymebutai');
                $("#modal>.content>.name>.name_3").text('Awaji in Japan');
                break;
            case 6:
                $("#modal>.content>.name>.name_2").text('Benesse House');
                $("#modal>.content>.name>.name_3").text('Naoshima in Japan');
                break;
            case 7:
                $("#modal>.content>.name>.name_2").text('Hill of The Buddha');
                $("#modal>.content>.name>.name_3").text('Sapporo in Japan');
                break;

        }
    }

    // ---------------------------------page_4---------------------------------------
    // page_4 리스트 클릭 시 modal 팝업
    photoList.on("click", function (e) {
        // a 태그 기본 이벤트 제거
        e.preventDefault();

        // 팝업창 현재 화면 위치에 맞춰 등장
        $('#modal').css({ "top": (($(window).height() - $("#modal").outerHeight()) / 2 + $(window).scrollTop()) + "px", });
        $("#modal").addClass('page_4');
        $('body').css('overflow', 'hidden');

        // 클릭한 이미지의 주소 저장
        var imgSrc = $(this).attr("href");

        // 클릭한 이미지의 인덱스 저장
        imgIndex = photoList.index(this);

        // 팝업 창 등장 + 이미지 주소 지정
        modal.fadeIn(400);
        photo.attr("src", imgSrc);


        // 이름 변경
        changeName1(imgIndex);

    });

    // ---------------------------------page_5---------------------------------------
    // page_5 리스트 클릭 시 modal 팝업
    photoList2.on("click", function (e) {
        // a 태그 기본 이벤트 제거
        e.preventDefault();

        // 팝업창 현재 화면 위치에 맞춰 등장
        modal.css({ "top": (($(window).height() - $("#modal").outerHeight()) / 2 + $(window).scrollTop()) + "px", });
        $("#modal").addClass('page_5');
        $('body').css('overflow', 'hidden');

        // 클릭한 이미지의 주소 저장
        var imgSrc2 = $(this).attr("href");

        // 클릭한 이미지의 인덱스 저장
        imgIndex2 = photoList2.index(this);

        // 팝업 창 등장 + 이미지 주소 지정
        modal.fadeIn(400);
        photo.attr("src", imgSrc2);

        // 이름 변경
        changeName2(imgIndex2);



    });

    // modal 공통
    // next
    $("#modal>.content>.next").click(() => {
        if ($("#modal").hasClass("page_4") === true) {
            imgIndex++;
            if (imgIndex == photoList.length) imgIndex = 0;

            var imgSrc = photoList.eq(imgIndex).attr("href");
            photo.fadeOut(function () {
                photo.attr("src", imgSrc).fadeIn();
            });

            // 이름 변경
            changeName1(imgIndex);
        }

        if ($("#modal").hasClass("page_5") === true) {
            imgIndex2++;
            if (imgIndex2 == photoList2.length) imgIndex2 = 0;

            var imgSrc2 = photoList2.eq(imgIndex2).attr("href");
            photo.fadeOut(function () {
                photo.attr("src", imgSrc2).fadeIn();
            });

            // 이름 변경
            changeName2(imgIndex2);
        }
    });

    // prev
    $("#modal>.content>.pre").click(() => {
        if ($("#modal").hasClass("page_4") === true) {
            imgIndex--;
            if (imgIndex < 0) imgIndex += photoList.length;

            var imgSrc = photoList.eq(imgIndex).attr("href");
            photo.fadeOut(function () {
                photo.attr("src", imgSrc).fadeIn();
            });

            // 이름 변경
            changeName1(imgIndex);
        }
        if ($("#modal").hasClass("page_5") === true) {
            imgIndex2--;
            if (imgIndex2 < 0) imgIndex2 += photoList2.length;

            var imgSrc2 = photoList2.eq(imgIndex2).attr("href");
            photo.fadeOut(function () {
                photo.attr("src", imgSrc2).fadeIn();
            });

            // 이름 변경
            changeName2(imgIndex2);
        }
    });

    // content 영역 바깥으로 마우스 이동 시 close 표시
    $('#modal>.content').mouseleave(() => {
        $('#modal>.content>.close').css({ transform: 'rotate(0)', opacity: '1' });
    });
    $('#modal>.content').mouseenter(() => {
        $('#modal>.content>.close').css({ transform: 'rotate(225deg)', opacity: '0' });
    });

    // 외부 영역 클릭 시 modal 닫기
    $(window).mouseup((e) => {
        var modal = $('#modal');
        // page_5 팝업 닫기
        if (flag_4 == 1 && $('#modal').css('display') == 'block' && height >= 7500) {
            if (modal.has(e.target).length === 0) {
                modal.fadeOut(400);
                $('body').css('overflow', 'hidden');
                $("#modal").removeClass('page_5');

            }
        }
        // page_4 팝업 닫기
        else if (flag_2 == 1 && $('#modal').css('display') == 'block') {
            if (modal.has(e.target).length === 0) {
                modal.fadeOut(400);
                $('body').css('overflow', 'hidden visible');
                $("#modal").removeClass('page_4');

            }
        }
    });

    // next
    $("#modal>.content>.next").hover(() => {
        $("#modal>.content>.next>.cover").css('left', '100%');
    },
        () => {
            $("#modal>.content>.next>.cover").css('left', '0');
        }
    );

    // prev
    $("#modal>.content>.pre").hover(() => {
        $("#modal>.content>.pre>.cover").css('right', '100%');
    },
        () => {
            $("#modal>.content>.pre>.cover").css('right', '0');
        }
    );


});