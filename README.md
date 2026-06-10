# 📝 과제 2. React로 Todo 앱 만들기

과제 1에서 Vanilla JS로 만든 Todo 앱을 React + Tailwind CSS로 재구현

---

## 🚀 실행 방법

1. 저장소를 클론해서
```bash
git clone 저장소 주소
cd assignment-2
```
2. 패키지를 설치해서
```bash
npm install
```
3. 개발 서버를 실행해서
```bash
npm run dev
```
4. 브라우저에서 `http://localhost:5173`으로 접속해서

---

## 📁 프로젝트 구조
```
assignment-2/
├── src/
│   ├── components/
│   │   ├── FilterTabs.jsx     # 필터 탭 (전체 / 진행 중 / 완료)
│   │   ├── TodoInput.jsx      # Todo 입력창
│   │   ├── TodoItem.jsx       # Todo 아이템 (완료 · 수정 · 삭제)
│   │   ├── TodoList.jsx       # Todo 목록
│   │   └── WeekView.jsx       # 주간 캘린더 뷰
│   ├── utils/
│   │   └── date.js            # 날짜 관련 유틸 함수
│   ├── App.jsx                # 루트 컴포넌트 (전체 상태 관리)
│   ├── index.css              # 글로벌 스타일 (Tailwind 진입점)
│   └── main.jsx               # 앱 진입점
├── index.html
├── vite.config.js
└── package.json
```

---

## ✅ 구현 기능

- **Todo CRUD** — Todo 항목 생성, 수정, 완료 처리, 삭제 기능을 구현했습니다.
- **상태별 필터링** — 전체 / 진행 중 / 완료 탭으로 Todo 목록을 필터링할 수 있습니다.
- **일간 뷰 및 주간 뷰** — 날짜별로 Todo를 관리하며, 주간 캘린더에서 날짜를 선택해 해당 일자의 Todo를 확인할 수 있습니다. 미완료 항목 수도 주간 뷰에서 한눈에 확인할 수 있습니다.
- **로컬 스토리지 연동** — 브라우저의 localStorage에 Todo 데이터를 저장해 새로고침 후에도 데이터가 유지됩니다.

---

## 🛠️ 활용 스택

- `React 19` / `Vite 8`
- `Tailwind CSS v4` (`@tailwindcss/vite` 플러그인)
- `Web Storage API` (localStorage)
