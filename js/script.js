$(document).ready(function () {

  // 창 닫기 버튼
  $(".head>.btn_1").click(function () {
    $(this).parents().removeClass("active");
    if ($(this).closest("article").attr("id") == "about") {
      $("#contact").removeClass("dot");
      setTimeout(function () {
        $(".my_list>li>p").removeClass('on');
      }, 200)
    } else if ($(this).closest("article").attr("id") == "skill") {
      $("#terminal").removeClass("dot");
      setTimeout(function () {
        $("#skill>.content>.box_2>ul").find('span').css('width', '0%')
      }, 200)
    } else if ($(this).closest("article").attr("id") == "project") {
      $("#keynote").removeClass("dot");
      setTimeout(function () {
        // $("#project>.content>.box_1>.pro_view>li").siblings().css('display', 'none');
      }, 400)
    } else if ($(this).closest("article").attr("id") == "uiux") {
      $("#finder").removeClass("dot");
    }
  });

  // 최소화 버튼
  $(".head>.btn_2").click(function () {
    $(this).parents().removeClass("active");
    $("#skill>.content>.box_2>ul").find('span').css('width', '0%')

  });

  // 푸터 아이콘 마우스 오버시 이름
  $("#footer_list>li").mouseenter(function () {
    var num = $(this).index();
    $("#footer_list_name>li").eq(num).css("display", "block");
  });
  $("#footer_list>li").mouseleave(function () {
    var num = $(this).index();
    $("#footer_list_name>li").eq(num).css("display", "none");
  });

  // 푸터 아이콘 클릭시 창 열기
  $("#contact").click(function () {
    $("#about").addClass("active");
    $(this).addClass("dot");
    $("#about").css('z-index', '+20');
    $("#about").siblings().not("#popup").css('z-index', '-20');
  });

  $("#terminal").click(function () {
    $("#skill").addClass("active");
    $(this).addClass("dot");
    $("#skill").siblings().not("#popup").css('z-index', '-20');
    $("#skill").css('z-index', '+20');
    $("#skill>.content>.box_2>ul").css('left', 0)
    if ($("#skill").hasClass("active") === true) {
      $(".html_pro").delay(300).animate({
        width: "80%"
      }, 1000)
      $(".css_pro").delay(300).animate({
        width: '70%'
      }, 1000, 'linear')
      $(".js_pro").delay(300).animate({
        width: "66%"
      }, 1000)
      $(".py_pro").delay(300).animate({
        width: "88%"
      }, 1000)
      $(".java_pro").delay(300).animate({
        width: "75%"
      }, 1000)
      $(".clang_pro").delay(300).animate({
        width: "66%"
      }, 1000)
    }
  });

  $("#keynote").click(function () {
    $("#project").addClass("active");
    $(this).addClass("dot");
    $("#project").siblings().not("#popup").css('z-index', '-20');
    $("#project").css('z-index', '+20');
  });

  $("#finder").click(function () {
    $("#uiux").addClass("active");
    $(this).addClass("dot");
    $("#uiux").siblings().not("#popup").css('z-index', '-20');
    $("#uiux").css('z-index', '+20');
  });

  // about 내부 자기소개 버튼 클릭
  $(".my_list>li>button").click(function () {
    var list_num = $(this).parent().index() + 1;
    console.log(list_num);
    $(".my_list>li:nth-child(" + list_num + ")>p").toggleClass('on');
  });

  // skill 내부 버튼 클릭시
  $("#skill>.content>.box_1>.btn_list>li>.btn_1").click(function () {
    $("#skill>.content>.box_2>ul").siblings().end().animate(({ left: '0px' }), 300)

    $("#skill>.content>.box_2>ul").find('span').css('width', '0%')
    $(".html_pro").animate({
      width: "80%"
    }, 1000)
    $(".css_pro").animate({
      width: '70%'
    }, 1000,)
    $(".js_pro").animate({
      width: "66%"
    }, 1000)
    $(".py_pro").animate({
      width: "88%"
    }, 1000)
    $(".java_pro").animate({
      width: "75%"
    }, 1000)
    $(".clang_pro").animate({
      width: "66%"
    }, 1000)

  });

  $("#skill>.content>.box_1>.btn_list>li>.btn_2").click(function () {
    $("#skill>.content>.box_2>ul").siblings().end().animate(({ left: '-750px' }), 300)

    $("#skill>.content>.box_2>ul").find('span').css('width', '0%')
    $(".phsp_pro").animate({
      width: "90%"
    }, 1000)
    $(".illur_pro").animate({
      width: "84%"
    }, 1000)
    $(".inde_pro").animate({
      width: "77%"
    }, 1000)
    $(".xd_pro").animate({
      width: "79%"
    }, 1000)
    $(".prem_pro").animate({
      width: "55%"
    }, 1000)
  });

  $("#skill>.content>.box_1>.btn_list>li>.btn_3").click(function () {
    $("#skill>.content>.box_2>ul").siblings().end().animate(({ left: '-1500px' }), 300)

    $("#skill>.content>.box_2>ul").find('span').css("width", '0%')
    $(".vscode_pro").animate({
      width: "77%"
    }, 1000)
    $(".xcode_pro").animate({
      width: "67%"
    }, 1000)
    $(".eclipse_pro").animate({
      width: "77%"
    }, 1000)
    $(".intel_pro").animate({
      width: "57%"
    }, 1000)

  });

  // 프로젝트 
  $("#project>.content>.box_1>.pro_list>li").click(function () {
    var pro_num = $(this).index() + 1;
    console.log(pro_num);
    $("#project>.content>.box_1>.pro_view>li:nth-child(" + pro_num + ")").css('display', 'block');
    $("#project>.content>.box_1>.pro_view>li:nth-child(" + pro_num + ")").siblings().css('display', 'none');
    switch (pro_num) {
      case 1:
        $(".box_2>h2").text("Ando Tadao");
        $(".box_2>.name_list>li:first-child").text("일본의 한 건축가 ‘안도 다다오’의 작품에 대해 소개하는 사이트");
        $(".box_2>.name_list>.day>li:first-child").text("프로젝트 시작일:");
        $(".box_2>.name_list>.day>li:nth-child(2)").text("2023.09.13");
        $(".box_2>.name_list>.day>li:nth-child(3)").text("프로젝트 종료일:");
        $(".box_2>.name_list>.day>li:nth-child(4)").text("2023.12.02");
        $(".box_2>.name_list>.day>li:nth-child(5)").text("규격:");
        $(".box_2>.name_list>.day>li:last-child").text("1920x1080");
        $(".box_2>.name_list>li:last-child").text("고정형 웹 형태로 제작");
        // 이동 주소 변경하기
        $(".box_2>a").attr("href", "./andotadao/index.html");
        break;
      case 2:
        $(".box_2>h2").text("ANGELINUS");
        $(".box_2>.name_list>li:first-child").text("엔제리너스 카페의 홈페이지를 리뉴얼");
        $(".box_2>.name_list>.day>li:first-child").text("프로젝트 시작일:");
        $(".box_2>.name_list>.day>li:nth-child(2)").text("2024.02.15");
        $(".box_2>.name_list>.day>li:nth-child(3)").text("프로젝트 종료일:");
        $(".box_2>.name_list>.day>li:nth-child(4)").text("2024.03.10");
        $(".box_2>.name_list>.day>li:nth-child(5)").text("규격:");
        $(".box_2>.name_list>.day>li:last-child").text("1920x1080");
        $(".box_2>.name_list>li:last-child").text("고정형 웹 형태로 제작");
        // 이동 주소 변경하기
        $(".box_2>a").attr("href", "./angelinus/index.html");
        break;
      case 3:
        $(".box_2>h2").text("Musign");
        $(".box_2>.name_list>li:first-child").text("뮤자인 홈페이지를 인터넷 강의를 들으며 제작");
        $(".box_2>.name_list>.day>li:first-child").text("프로젝트 시작일:");
        $(".box_2>.name_list>.day>li:nth-child(2)").text("2023.12.17");
        $(".box_2>.name_list>.day>li:nth-child(3)").text("프로젝트 종료일:");
        $(".box_2>.name_list>.day>li:nth-child(4)").text("2024.01.22");
        $(".box_2>.name_list>.day>li:nth-child(5)").text("규격:");
        $(".box_2>.name_list>.day>li:last-child").text("1920x1080");
        $(".box_2>.name_list>li:last-child").text("반응형 웹 형태로 제작");
        // 이동 주소 변경하기
        $(".box_2>a").attr("href", "./musign/index.html");
        break;
      case 4:
        $(".box_2>h2").text("Monami");
        $(".box_2>.name_list>li:first-child").text("모나미 홈페이지 리뉴얼");
        $(".box_2>.name_list>.day>li:first-child").text("프로젝트 시작일:");
        $(".box_2>.name_list>.day>li:nth-child(2)").text("2025.7.22");
        $(".box_2>.name_list>.day>li:nth-child(3)").text("프로젝트 종료일:");
        $(".box_2>.name_list>.day>li:nth-child(4)").text("2024.09.13");
        $(".box_2>.name_list>.day>li:nth-child(5)").text("규격:");
        $(".box_2>.name_list>.day>li:last-child").text("1920x1080");
        $(".box_2>.name_list>li:last-child").text("고정형 웹 형태로 제작");
        // 이동 주소 변경하기
        $(".box_2>a").attr("href", "./monami/index.html");
        break;
      case 5:
        $(".box_2>h2").text("PortFolio");
        $(".box_2>.name_list>li:first-child").text("현재 포트폴리오 페이지 리뉴얼");
        $(".box_2>.name_list>.day>li:first-child").text("프로젝트 시작일:");
        $(".box_2>.name_list>.day>li:nth-child(2)").text("2025.10.12");
        $(".box_2>.name_list>.day>li:nth-child(3)").text("프로젝트 종료일:");
        $(".box_2>.name_list>.day>li:nth-child(4)").text("제작중");
        $(".box_2>.name_list>.day>li:nth-child(5)").text("규격:");
        $(".box_2>.name_list>.day>li:last-child").text("1920x1080");
        $(".box_2>.name_list>li:last-child").text("반응형 웹 형태로 제작");
        // 이동 주소 변경하기
        $(".box_2>a").attr("href", "./portfolio_re/index.html");
        break;
    }
  })

  // uiux 목록 클릭시 팝업 등장
  $("#uiux>.content>.pjt>li").click(function () {
    var pop_num = $(this).index() + 1;
    $("#popup").css("transform", "translateY(0)");
    $("#popup>.pop_con>.pop_img>img").siblings().css('display', 'none');
    $("#popup>.pop_con>.pop_img>img:nth-child(" + pop_num + ")").css("display", "block");
    $("#modal").css('display', 'flex')

    switch (pop_num) {
      case 1:
        $("#popup").css({ top: '9%', left: '21%' });
        $(".pop_name").text("여행사 홈페이지.jpg");
        break
      case 2:
        $("#popup").css({ top: '3%', left: '39%' });
        $(".pop_name").text("아이폰 웹 페이지.jpg");
        break
      case 3:
        $("#popup").css({ top: '19%', left: '21%' });
        $(".pop_name").text("헬스장 웹 배너.jpg");
        break
      case 4:
        $("#popup").css({ top: '3%', left: '24%' });
        $(".pop_name").text("비스포크 웹 배너.jpg");
        break
      case 5:
        $("#popup").css({ top: '3%', left: '31%' });
        $(".pop_name").text("서브웨이 인스타.jpg");
        break
      case 6:
        $("#popup").css({ top: '28%', left: '25%' });
        $(".pop_name").text("서브웨이 웹 배너.jpg");
        break
      case 7:
        $("#popup").css({ top: '35%', left: '23%' });
        $(".pop_name").text("크림 웹 배너.jpg");
        break
      case 8:
        $("#popup").css({ top: '34%', left: '21%' });
        $(".pop_name").text("뇌새김 웹 배너.jpg");
        break
    }
  });

  // 팝업 닫기
  $("#popup>.pop_con>.tool>.close").click(function () {
    $("#popup").css("transform", "translateY(-300%)");
    $("#modal").css('display', 'none')
  });
});
