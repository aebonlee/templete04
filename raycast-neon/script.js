/* Raycast — "Neon" template — interaction script */
(function () {
  "use strict";

  // Mobile menu toggle
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

  // Command-bar rows: move active highlight on hover
  var rows = document.querySelectorAll(".rc__row");
  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () {
      rows.forEach(function (r) { r.classList.remove("is-active"); });
      row.classList.add("is-active");
    });
  });

  // Scroll-reveal, guarded by prefers-reduced-motion
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

    document.querySelectorAll(".head, .key, .ext, .ai-card, .chip, .hero-quote")
      .forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
      });
  }
})();
