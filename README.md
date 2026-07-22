# 사이트 디자인 템플릿 모음

앞으로 여러 프로젝트에서 바로 가져다 쓸 수 있도록 만든 **반응형 랜딩페이지 템플릿 컬렉션**입니다.
모두 순수 HTML/CSS/JS로 제작되어 빌드 도구나 외부 라이브러리 없이 파일만 열면 동작합니다.
Raycast 스타일의 다크 테마와 그라디언트 강조 색상을 참고했습니다.

🔗 **라이브 사이트**: https://aebonlee.github.io/templete04/ (커스텀 도메인: `templete04.dreamitbiz.com`, DNS 설정 후 활성화)
📘 **개발 참고 가이드**: [`docs/개발-가이드.md`](./docs/개발-가이드.md) · **개발일지**: [`docs/개발일지.md`](./docs/개발일지.md)

## 템플릿 목록

모든 페이지 상단에는 **버전 비교 띠줄**이 있어, 적용된 여러 버전을 바로 전환·비교하고 그동안의 개발 내역을 확인할 수 있습니다(`compare-bar.js`).

| 템플릿 | 콘셉트 | 특징 |
|--------|--------|------|
| [**Raycast Pro**](./raycast-pro/) | 런처 · 제품 (실제 사이트 재현) | 실제 raycast.com 마크업 기반 풀 재현 — 로고 SVG, Meet Glaze, 확장·AI·후기·커뮤니티·API·뉴스레터, 칼집처럼 기울인 광선 |
| [**Raycast**](./raycast/) | 런처 · 제품 (고충실도 클론) | 커맨드바 UI 목업, 확장 그리드, AI 섹션, 시그니처 레드(#FF6363), 세로 광선 |

각 템플릿 폴더에는 동일한 3개 파일이 들어 있습니다.

| 파일 | 설명 |
|------|------|
| `index.html` | 페이지 구조 |
| `styles.css` | 디자인 토큰(`:root`), 컴포넌트 스타일, 반응형 규칙 |
| `script.js`  | 모바일 메뉴 토글, 스크롤 진입 애니메이션 등 |

## 공통 특징

- 🎨 **디자인 토큰** — `styles.css` 상단 `:root` 변수만 바꿔도 전체 테마 변경
- 📱 **완전 반응형** — 960 / 760 / 460px 브레이크포인트, 모바일 햄버거 메뉴
- ⚡ **의존성 없음** — 빌드·번들 불필요, 정적 호스팅 그대로 배포 가능
- ♿ **접근성 고려** — 시맨틱 마크업, `aria` 속성, `prefers-reduced-motion` 지원

## 사용 방법

```bash
# 원하는 템플릿 폴더로 이동해서 바로 열기
open raycast-pro/index.html      # macOS
open raycast/index.html

# 또는 간단한 로컬 서버로 (프로젝트 루트에서)
python3 -m http.server 8000
# → http://localhost:8000/raycast-pro/  또는  /raycast/
```

## 커스터마이징

각 템플릿의 `styles.css` 상단 `:root` 토큰만 수정하면 됩니다.

```css
/* 예: raycast/styles.css */
:root {
  --red:    #ff6363;   /* Raycast 시그니처 레드 */
  --bg:     #07080a;   /* 배경 */
  --text:   #ffffff;   /* 본문 색 */
  --radius: 14px;      /* 카드 모서리 */
}
```

## 새 템플릿 추가하기

1. 새 폴더를 만들고 `index.html` / `styles.css` / `script.js`를 추가합니다.
2. 위 “템플릿 목록” 표에 한 줄을 추가합니다.
3. 디자인 토큰 구조(`:root`)와 반응형 브레이크포인트를 그대로 따르면 일관성이 유지됩니다.
