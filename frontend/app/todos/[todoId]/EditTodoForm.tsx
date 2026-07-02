"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  updateTodo,
  deleteTodo,
  toggleTodo,
  type Todo,
  type TodoFormState,
} from "../../actions";

const initialState: TodoFormState = { error: null };

export default function EditTodoForm({
  todo,
  returnTo,
}: {
  todo: Todo;
  returnTo: string;
}) {
  const [text, setText] = useState(todo.text);

  const updateTodoWithId = updateTodo.bind(null, String(todo.id), returnTo);
  const [state, formAction, pending] = useActionState(
    updateTodoWithId,
    initialState
  );

  const toggleTodoWithId = toggleTodo.bind(null, String(todo.id), !todo.completed);
  const deleteTodoWithId = deleteTodo.bind(null, String(todo.id), returnTo);

  return (
    <div>
      <h1 className="mb-5 border-b-2 border-slate-900 pb-2 text-center text-lg font-bold uppercase tracking-widest text-slate-900">
        할 일 수정
      </h1>

      <form action={formAction} className="space-y-2">
        <input
          type="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
        />

        {state.error && <p className="text-xs text-red-600">{state.error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!text.trim() || pending}
            className="flex-1 rounded-sm bg-slate-900 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            저장
          </button>
          <Link
            href={returnTo}
            className="flex-1 rounded-sm border border-neutral-300 py-2 text-center text-sm font-semibold text-neutral-600"
          >
            취소
          </Link>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3 text-sm">
        <form action={toggleTodoWithId}>
          <button type="submit" className="font-semibold text-neutral-600">
            {todo.completed ? "완료 취소" : "완료로 표시"}
          </button>
        </form>
        <form action={deleteTodoWithId}>
          <button type="submit" className="font-semibold text-red-600">
            삭제
          </button>
        </form>
      </div>
    </div>
  );
}
