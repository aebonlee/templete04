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

/* =========================================================
   히어로 WebGL 배경 — 라이브러리 없이 순수 WebGL 프래그먼트 셰이더로
   실제 raycast.com처럼 살아 움직이는 붉은 유리 블롭을 렌더링.
   실패/미지원/reduced-motion 시 정적 CSS 블롭으로 폴백.
   ========================================================= */
(function () {
  "use strict";
  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) { canvas.style.display = "none"; return; }  // CSS 폴백

  var vsrc =
    "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

  var fsrc = [
    "precision highp float;",
    "uniform vec2 u_res; uniform float u_time;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }",
    "float noise(vec2 p){",
    "  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);",
    "  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),",
    "             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);",
    "}",
    "float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / u_res.xy;",
    "  vec2 p = uv; p.x *= u_res.x/u_res.y;",
    "  float t = u_time*0.045;",
    "  vec2 q = vec2(fbm(p*1.4 + vec2(0.0,t)), fbm(p*1.4 + vec2(5.2,-t)));",
    "  vec2 r = vec2(fbm(p*1.4 + 2.6*q + vec2(1.7,9.2) + 0.5*t), fbm(p*1.4 + 2.6*q + vec2(8.3,2.8) - 0.4*t));",
    "  float f = fbm(p*1.4 + 2.6*r);",
    "  float diag = clamp(uv.x*0.40 + (1.0-uv.y)*0.60, 0.0, 1.3);",
    "  float m = clamp(f*1.35 + diag*0.32 - 0.5, 0.0, 1.0);",
    "  vec3 bg   = vec3(7.0,8.0,10.0)/255.0;",
    "  vec3 deep = vec3(184.0,2.0,50.0)/255.0;",
    "  vec3 red  = vec3(255.0,22.0,42.0)/255.0;",
    "  vec3 pink = vec3(255.0,122.0,152.0)/255.0;",
    "  vec3 white= vec3(244.0,254.0,255.0)/255.0;",
    "  vec3 col = bg;",
    "  col = mix(col, deep,  smoothstep(0.14,0.5,m));",
    "  col = mix(col, red,   smoothstep(0.42,0.72,m));",
    "  col = mix(col, pink,  smoothstep(0.62,0.86,m));",
    "  col = mix(col, white, smoothstep(0.82,1.0,m));",
    "  float vig = smoothstep(0.95,0.15, length((uv-vec2(0.55,0.38))*vec2(1.3,1.05)));",
    "  col = mix(bg, col, vig);",
    "  float g = hash(gl_FragCoord.xy + vec2(u_time)) * 0.055 - 0.0275;",
    "  col += g;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, vsrc), fs = compile(gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) { canvas.style.display = "none"; return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "u_res");
  var uTime = gl.getUniformLocation(prog, "u_time");

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(canvas.clientWidth * dpr);
    var h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }
  window.addEventListener("resize", resize);

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var running = true;

  function render(ms) {
    if (!running) return;
    resize();
    gl.uniform1f(uTime, reduce ? 8.0 : ms * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce) requestAnimationFrame(render);
  }

  // 탭이 보이지 않을 때는 애니메이션 정지(배터리 절약)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { running = false; }
    else if (!reduce) { running = true; requestAnimationFrame(render); }
  });

  resize();
  requestAnimationFrame(render);
})();
