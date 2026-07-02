"use client";

import { useActionState } from "react";
import { createTodo, type TodoFormState } from "../actions";

const initialState: TodoFormState = { error: null };

export default function TodoCreateForm({ date }: { date: string }) {
  const createTodoWithDate = createTodo.bind(null, date);
  const [state, formAction, pending] = useActionState(
    createTodoWithDate,
    initialState
  );

  return (
    <div>
      <form action={formAction} className="flex gap-2">
        <input
          type="text"
          name="text"
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-sm border border-slate-900 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          추가
        </button>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {state.error}
        </p>
      )}
    </div>
  );
}
