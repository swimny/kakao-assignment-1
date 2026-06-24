# Week 03 — Todo App (Next.js + FastAPI)

2차 과제의 React(Vite) 기반 Todo 앱을 Next.js App Router + FastAPI 풀스택 구조로 재구현한 프로젝트입니다.

## 프로젝트 구조

```
kakao-assignment-3/
├── frontend/   # Next.js App Router
└── backend/    # FastAPI + SQLite
```

## 실행 방법

### 백엔드

```bash
cd backend
py -m uvicorn main:app --reload
```

### 프론트엔드

```bash
cd frontend
npm run dev
```

- 프론트엔드: http://localhost:3000
- 백엔드 API 문서: http://localhost:8000/docs

## 환경변수 설정

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000
```

**backend/.env.local**
```
DATABASE_URL=sqlite:///./todos.db
```

## 구현 기능

- Todo 목록 조회 / 생성 / 수정 / 삭제 (CRUD)
- Next.js App Router 파일 기반 라우팅
- Server Component / Client Component 구분
- API Route(`route.ts`)를 통한 프론트-백엔드 연동
- 환경변수로 API 엔드포인트 분리
