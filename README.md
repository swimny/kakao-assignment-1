# 📝 과제 2. React로 Todo 앱 만들기

과제 1에서 Vanilla JS로 만든 Todo 앱을 React + Tailwind CSS로 재구현

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

- **Todo CRUD** — Todo 항목 생성, 수정, 완료 처리, 삭제 기능 구현
- **상태별 필터링** — 전체 / 진행 중 / 완료 탭으로 Todo 목록 필터링
- **일간 뷰 및 주간 뷰** — 날짜별로 Todo 관리, 주간 캘린더에서 날짜를 선택해 해당 일자의 Todo를 확인 가능. 미완료 항목 수도 주간 뷰에서 한눈에 확인할 수 있음.
- **로컬 스토리지 연동** — 브라우저의 localStorage에 Todo 데이터를 저장해 새로고침 후에도 데이터가 유지.

---

## 🛠️ 활용 스택

- `React 19` / `Vite 8`
- `Tailwind CSS v4` (`@tailwindcss/vite` 플러그인)
- `Web Storage API` (localStorage)
