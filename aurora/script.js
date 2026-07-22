/* Aurora 템플릿 — 상호작용 스크립트 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 테마 토글 (다크 ⇄ 라이트) ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  if (themeToggle) {
    var syncPressed = function () {
      themeToggle.setAttribute(
        "aria-pressed",
        root.getAttribute("data-theme") === "light" ? "true" : "false"
      );
    };
    syncPressed();

    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("aurora-theme", next);
      } catch (e) {}
      syncPressed();
    });
  }

  /* ---------- 모바일 메뉴 토글 ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");

  if (toggle && mobile) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      mobile.hidden = !open;
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    mobile.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
  }

  /* ---------- 스크롤 진입 애니메이션 ---------- */
  var revealTargets = document.querySelectorAll(
    ".card, .section__head, .bento__cell, .stat"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
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

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ---------- 스탯 카운트업 ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");

  var formatNumber = function (value, isDecimal) {
    if (isDecimal) return value.toFixed(1);
    return Math.round(value).toLocaleString("ko-KR");
  };

  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var isDecimal = target % 1 !== 0;

    if (reduceMotion) {
      el.textContent = formatNumber(target, isDecimal);
      return;
    }

    var duration = 1400;
    var start = null;

    var step = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(target * eased, isDecimal);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target, isDecimal);
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    } else {
      counters.forEach(animateCount);
    }
  }
})();
