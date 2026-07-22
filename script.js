/* Nova 템플릿 — 최소한의 상호작용 스크립트 */
(function () {
  "use strict";

  // 모바일 메뉴 토글
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "메뉴 열기" : "메뉴 닫기");
      mobile.hidden = open;
    });

    // 모바일 메뉴 링크 클릭 시 닫기
    mobile.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "메뉴 열기");
        mobile.hidden = true;
      }
    });
  }

  // 스크롤 시 진입 애니메이션
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".card, .section__head").forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }
})();
