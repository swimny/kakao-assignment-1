# Todo List

Next.js(App Router) 프론트엔드 + FastAPI 백엔드로 구성된 할 일 관리 앱입니다.

## 구현한 기능

- **CRUD**: 할 일 생성/조회/수정/삭제
- **완료 토글**: 목록에서 동그라미 체크로 완료/미완료 전환
- **날짜별 보기**: 주간 캘린더에서 날짜를 선택하면 그 날짜의 할 일만 표시, 좌우 화살표로 주 단위 이동, 오늘 날짜로 바로 이동하는 버튼, 요일별 진행 중 개수 표시
- **상태 필터**: 전체 / 진행 중 / 완료 탭 (`?filter=` URL 파라미터로 상태 유지)
- **검색**: 키워드로 할 일 내용 검색 (`?search=` URL 파라미터, 입력 후 400ms 디바운스)
- 필터, 날짜, 검색은 모두 URL 파라미터로 관리되어 새로고침하거나 링크를 공유해도 같은 화면이 유지됩니다.
- 실제 필터링/검색은 프론트엔드가 아닌 FastAPI(DB 쿼리)에서 처리됩니다.

## 프로젝트 구조

```
advanced-assignment/
├── frontend/   # Next.js (App Router)
└── backend/    # FastAPI + SQLite
```

- `app/actions.ts`: Server Actions — 페이지/컴포넌트에서 직접 호출하는 서버 함수 (조회는 FastAPI 직접 호출, 생성/수정/삭제는 API Route를 거침)
- `app/api/todos/`: API Route — 브라우저에서 발생하는 요청(생성/수정/삭제/검색)을 FastAPI로 전달하는 프록시
- `app/todos/`: 할 일 목록/생성/수정 페이지와 관련 컴포넌트

## 실행 방법

### 백엔드

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

`backend/.env.local`에 `DATABASE_URL`, `CORS_ORIGINS`를 설정합니다.

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env.local`에 다음 값을 설정합니다.

```
BACKEND_API_URL=http://localhost:8000
SITE_URL=http://localhost:3000
```

브라우저에서 [http://localhost:3000/todos](http://localhost:3000/todos)로 접속합니다.
