/* Raycast 클론 템플릿 — 상호작용 스크립트 */
(function () {
  "use strict";

  // 모바일 메뉴 토글
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  if (toggle && mobile) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobile.hidden = !open;
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobile.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  // 확장 카테고리 탭 (표시 전환용 데모)
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
    });
  });

  // 커맨드바 행 hover 시 active 이동 (실제 Raycast 느낌)
  var rows = document.querySelectorAll(".rc__row");
  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () {
      rows.forEach(function (r) { r.classList.remove("is-active"); });
      row.classList.add("is-active");
    });
  });

  // 스크롤 진입 애니메이션
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".head, .ext, .ai-card, .quote, .auto, .pills, .marquee-list")
      .forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
      });
  }
})();
