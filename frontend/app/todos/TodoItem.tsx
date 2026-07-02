"use client";

import Link from "next/link";
import { deleteTodo, toggleTodo, type Todo, type TodoFilter } from "../actions";
import { buildTodosHref, buildTodosParams } from "./date-utils";

export default function TodoItem({
  todo,
  date,
  filter,
  search,
}: {
  todo: Todo;
  date: string;
  filter: TodoFilter;
  search?: string;
}) {
  const toggleTodoWithId = toggleTodo.bind(null, String(todo.id), !todo.completed);
  const returnTo = buildTodosHref(date, filter, search);
  const deleteTodoWithId = deleteTodo.bind(null, String(todo.id), returnTo);

  const editParams = buildTodosParams(date, filter, search);

  return (
    <li className="flex items-center gap-2 border-b border-neutral-200 py-2">
      <form action={toggleTodoWithId}>
        <button
          type="submit"
          aria-label={todo.completed ? "완료 취소" : "완료로 표시"}
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border border-neutral-500 text-[10px] leading-none ${
            todo.completed ? "bg-slate-900 text-white" : "bg-white text-transparent"
          }`}
        >
          ✓
        </button>
      </form>

      <span
        className={`min-w-0 flex-1 break-words text-sm ${
          todo.completed ? "text-neutral-400 line-through" : "text-neutral-800"
        }`}
      >
        {todo.text}
      </span>

      <div className="flex shrink-0 items-center gap-2 text-xs text-neutral-400">
        <Link
          href={`/todos/${todo.id}?${editParams.toString()}`}
          aria-label="수정"
          className="hover:text-neutral-800"
        >
          수정
        </Link>
        <form action={deleteTodoWithId}>
          <button type="submit" aria-label="삭제" className="hover:text-red-600">
            삭제
          </button>
        </form>
      </div>
    </li>
  );
}
