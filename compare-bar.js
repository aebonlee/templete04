/* =========================================================
   버전 비교 띠줄 (compare bar)
   모든 템플릿 페이지 상단에 동일하게 삽입되어, 적용된 여러 버전을
   바로 전환·비교하고 그동안의 개발 내역을 확인할 수 있게 합니다.
   순수 JS, 의존성 없음. 각 페이지에서 <script src=".../compare-bar.js"> 로 포함.
   ========================================================= */
(function () {
  "use strict";

  // 현재 페이지 깊이에 맞춘 상대 경로 베이스 (루트=./, 하위폴더=../)
  var path = location.pathname;
  var folders = ["raycast-pro", "raycast", "nova", "aurora"];
  var current = "";
  for (var i = 0; i < folders.length; i++) {
    if (path.indexOf("/" + folders[i] + "/") !== -1 || path.indexOf("/" + folders[i]) !== -1) {
      current = folders[i];
      break;
    }
  }
  var base = current ? "../" : "./";

  // 버전 목록
  var versions = [
    { id: "raycast-pro", label: "Raycast Pro", note: "실제 사이트 재현 · 칼집 광선", dot: "#ff6363" },
    { id: "raycast", label: "Raycast", note: "고충실도 클론 · 세로 광선", dot: "#ff6363" },
    { id: "nova", label: "Nova", note: "제품 · 런처형", dot: "#6c8cff" },
    { id: "aurora", label: "Aurora", note: "스타트업 · 라이트/다크", dot: "#22d3ee" }
  ];

  // 개발 내역 (최신순)
  var history = [
    ["상단 비교 띠줄", "모든 페이지에서 버전 전환·비교 + 개발 내역 확인"],
    ["Raycast Pro", "실제 raycast.com 마크업 기반 풀 재현(로고 SVG·Meet Glaze·Community·API·뉴스레터), 광선을 칼집처럼 기울임"],
    ["히어로 세로 광선", "Raycast 히어로에 브랜드 4색(레드·옐로·그린·블루) 세로 광선 추가"],
    ["Raycast 고충실도 클론", "실제 텍스트·색상(#07080A/#FF6363) 추출해 커맨드바 UI·확장·AI·후기 재현"],
    ["커스텀 도메인·버전 버튼·가이드", "CNAME(templete04.dreamitbiz.com), 갤러리 버전 버튼, 사이트 개발 가이드"],
    ["갤러리·개발일지·배포", "루트 갤러리 진입 페이지, docs/개발일지, GitHub Pages 자동 배포"],
    ["Aurora 라이트/다크 토글 + CI", "테마 토글(localStorage), HTML 검증 CI 워크플로"],
    ["Aurora 템플릿 + 컬렉션 구조", "스타트업/SaaS형(벤토·스탯·FAQ), nova/·aurora/ 폴더 정리"],
    ["Nova 템플릿", "제품/런처형 반응형 랜딩(히어로 목업·기능·요금제)"]
  ];

  // 스타일 주입
  var css = [
    ":root{--cmpbar-h:38px;}",
    "body{padding-top:var(--cmpbar-h)!important;}",
    ".nav,.topbar{top:var(--cmpbar-h)!important;}",
    ".cmpbar{position:fixed;top:0;left:0;right:0;height:var(--cmpbar-h);z-index:9999;",
    "display:flex;align-items:center;gap:14px;padding:0 14px;font-size:13px;",
    "font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;",
    "color:#e8ecf5;background:rgba(10,12,18,.9);backdrop-filter:blur(12px);",
    "border-bottom:1px solid rgba(255,255,255,.12);box-sizing:border-box;}",
    ".cmpbar *{box-sizing:border-box;}",
    ".cmpbar__label{font-weight:700;letter-spacing:-.01em;white-space:nowrap;opacity:.9;}",
    ".cmpbar__vers{display:flex;gap:6px;overflow-x:auto;flex:1;scrollbar-width:none;}",
    ".cmpbar__vers::-webkit-scrollbar{display:none;}",
    ".cmpbar__v{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;",
    "padding:5px 11px;border-radius:999px;color:#c4ccdb;text-decoration:none;",
    "border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);transition:.15s;}",
    ".cmpbar__v:hover{color:#fff;background:rgba(255,255,255,.09);}",
    ".cmpbar__v.is-active{color:#0a0a0a;background:#fff;border-color:#fff;font-weight:600;}",
    ".cmpbar__d{width:7px;height:7px;border-radius:50%;flex:none;}",
    ".cmpbar__hist{margin-left:auto;white-space:nowrap;padding:5px 12px;border-radius:999px;",
    "cursor:pointer;color:#c4ccdb;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);",
    "font:inherit;font-size:13px;}",
    ".cmpbar__hist:hover{color:#fff;}",
    ".cmpbar__panel{position:fixed;top:var(--cmpbar-h);right:14px;z-index:9999;width:min(460px,92vw);",
    "max-height:70vh;overflow-y:auto;background:#0d1017;border:1px solid rgba(255,255,255,.14);",
    "border-radius:14px;box-shadow:0 30px 70px -20px rgba(0,0,0,.8);padding:8px;display:none;}",
    ".cmpbar__panel.is-open{display:block;}",
    ".cmpbar__panel h5{margin:8px 12px 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8a94a8;}",
    ".cmpbar__item{display:flex;gap:12px;padding:10px 12px;border-radius:10px;}",
    ".cmpbar__item:hover{background:rgba(255,255,255,.05);}",
    ".cmpbar__num{flex:none;width:22px;height:22px;border-radius:6px;display:grid;place-items:center;",
    "font-size:12px;font-weight:700;color:#0a0a0a;background:linear-gradient(135deg,#ff8a8a,#ff6363);}",
    ".cmpbar__t{color:#eef2fb;font-weight:600;font-size:13.5px;}",
    ".cmpbar__s{color:#9aa4b8;font-size:12.5px;margin-top:2px;line-height:1.5;}",
    "@media (max-width:640px){.cmpbar__label{display:none;}}",
    "@media (prefers-reduced-motion:reduce){.cmpbar__v,.cmpbar__hist{transition:none;}}"
  ].join("");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // 띠줄 DOM
  var bar = document.createElement("div");
  bar.className = "cmpbar";

  var label = document.createElement("span");
  label.className = "cmpbar__label";
  label.textContent = "디자인 비교";
  bar.appendChild(label);

  var vers = document.createElement("div");
  vers.className = "cmpbar__vers";
  versions.forEach(function (v) {
    var a = document.createElement("a");
    a.className = "cmpbar__v" + (v.id === current ? " is-active" : "");
    a.href = base + v.id + "/";
    a.title = v.note;
    var dot = document.createElement("span");
    dot.className = "cmpbar__d";
    dot.style.background = v.dot;
    a.appendChild(dot);
    a.appendChild(document.createTextNode(v.label));
    vers.appendChild(a);
  });
  bar.appendChild(vers);

  var histBtn = document.createElement("button");
  histBtn.className = "cmpbar__hist";
  histBtn.type = "button";
  histBtn.setAttribute("aria-expanded", "false");
  histBtn.textContent = "개발 내역 ▾";
  bar.appendChild(histBtn);

  document.body.appendChild(bar);

  // 개발 내역 패널
  var panel = document.createElement("div");
  panel.className = "cmpbar__panel";
  var h5 = document.createElement("h5");
  h5.textContent = "그동안의 개발 내역 (최신순)";
  panel.appendChild(h5);
  history.forEach(function (row, idx) {
    var item = document.createElement("div");
    item.className = "cmpbar__item";
    var num = document.createElement("span");
    num.className = "cmpbar__num";
    num.textContent = String(history.length - idx);
    var box = document.createElement("div");
    var t = document.createElement("div");
    t.className = "cmpbar__t";
    t.textContent = row[0];
    var s = document.createElement("div");
    s.className = "cmpbar__s";
    s.textContent = row[1];
    box.appendChild(t);
    box.appendChild(s);
    item.appendChild(num);
    item.appendChild(box);
    panel.appendChild(item);
  });
  document.body.appendChild(panel);

  function toggle(open) {
    var willOpen = typeof open === "boolean" ? open : !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", willOpen);
    histBtn.setAttribute("aria-expanded", String(willOpen));
    histBtn.textContent = willOpen ? "개발 내역 ▴" : "개발 내역 ▾";
  }
  histBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggle();
  });
  document.addEventListener("click", function (e) {
    if (panel.classList.contains("is-open") && !panel.contains(e.target) && e.target !== histBtn) {
      toggle(false);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggle(false);
  });
})();
