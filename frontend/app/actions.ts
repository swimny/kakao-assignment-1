"use server";

// Server Action: Server Component에서 직접 FastAPI를 호출해 목록을 가져옴
// 생성/수정/삭제는 Client Component에서 /api/todos route를 통해 처리

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function getTodoById(id: number): Promise<Todo> {
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) throw new Error("존재하지 않는 Todo입니다.");
  return todo;
}
