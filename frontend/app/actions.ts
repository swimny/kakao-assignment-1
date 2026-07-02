"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
};

export type TodoFormState = {
  error: string | null;
};

export type TodoFilter = "all" | "active" | "completed";

export async function getTodos(
  filter: TodoFilter = "all",
  date?: string,
  search?: string
): Promise<Todo[]> {
  const url = new URL(`${BACKEND_API_URL}/todos`);
  if (filter === "active") {
    url.searchParams.set("completed", "false");
  } else if (filter === "completed") {
    url.searchParams.set("completed", "true");
  }
  if (date) {
    url.searchParams.set("date", date);
  }
  if (search) {
    url.searchParams.set("search", search);
  }

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("할 일 목록을 불러오지 못했습니다.");
  }

  return res.json();
}

// 주간 뷰의 요일별 "진행 중" 개수 표시용 — 날짜 필터 없이 미완료 항목 전체를 가져와 날짜별로 집계
export async function getActiveCountsByDate(): Promise<Record<string, number>> {
  const url = new URL(`${BACKEND_API_URL}/todos`);
  url.searchParams.set("completed", "false");

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("할 일 개수를 불러오지 못했습니다.");
  }

  const todos: Todo[] = await res.json();

  return todos.reduce<Record<string, number>>((counts, todo) => {
    counts[todo.date] = (counts[todo.date] ?? 0) + 1;
    return counts;
  }, {});
}

export async function createTodo(
  date: string,
  _prevState: TodoFormState,
  formData: FormData
): Promise<TodoFormState> {
  const text = (formData.get("text") as string | null)?.trim();

  if (!text) {
    return { error: "할 일을 입력해주세요" };
  }

  const res = await fetch(`${SITE_URL}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, date }),
  });

  if (!res.ok) {
    return { error: "할 일을 저장하지 못했습니다." };
  }

  revalidatePath("/todos");
  redirect(`/todos?date=${date}`);
}

export async function updateTodo(
  todoId: string,
  returnTo: string,
  _prevState: TodoFormState,
  formData: FormData
): Promise<TodoFormState> {
  const text = (formData.get("text") as string | null)?.trim();

  if (!text) {
    return { error: "할 일을 입력해주세요" };
  }

  const res = await fetch(`${SITE_URL}/api/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    return { error: "할 일을 수정하지 못했습니다." };
  }

  revalidatePath("/todos");
  redirect(returnTo);
}

export async function toggleTodo(todoId: string, completed: boolean) {
  const res = await fetch(`${SITE_URL}/api/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) {
    throw new Error("완료 상태를 변경하지 못했습니다.");
  }

  revalidatePath("/todos");
  revalidatePath(`/todos/${todoId}`);
}

export async function deleteTodo(todoId: string, returnTo: string) {
  const res = await fetch(`${SITE_URL}/api/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("할 일을 삭제하지 못했습니다.");
  }

  revalidatePath("/todos");
  redirect(returnTo);
}
