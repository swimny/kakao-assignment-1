"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTodo, type TodoFormState } from "../../actions";

const initialState: TodoFormState = { error: null };

export default function CreateTodoForm({ date }: { date: string }) {
  const createTodoWithDate = createTodo.bind(null, date);
  const [state, formAction, pending] = useActionState(
    createTodoWithDate,
    initialState
  );

  return (
    <div>
      <h1 className="mb-5 border-b-2 border-slate-900 pb-2 text-center text-lg font-bold uppercase tracking-widest text-slate-900">
        할 일 추가
      </h1>

      <form action={formAction} className="space-y-2">
        <input
          type="text"
          name="text"
          placeholder="할 일을 입력하세요"
          autoFocus
          className="w-full rounded-sm border border-slate-900 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-neutral-400"
        />

        {state.error && <p className="text-xs text-red-600">{state.error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-sm bg-slate-900 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            추가
          </button>
          <Link
            href="/todos"
            className="flex-1 rounded-sm border border-neutral-300 py-2 text-center text-sm font-semibold text-neutral-600"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
