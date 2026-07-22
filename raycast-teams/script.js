/* Raycast for Teams — 상호작용 스크립트 (의존성 없음) */
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

  // 공유 워크스페이스 카드 행 hover 시 active 이동
  var rows = document.querySelectorAll(".tc__row");
  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () {
      rows.forEach(function (r) { r.classList.remove("is-active"); });
      row.classList.add("is-active");
    });
  });

  // 스크롤 진입 애니메이션 (reduced-motion 시 비활성)
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

    document.querySelectorAll(".head, .feat, .work, .chip, .hero-quote, .price")
      .forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
      });
  }
})();
