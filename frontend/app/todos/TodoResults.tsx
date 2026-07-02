"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TodoItem from "./TodoItem";
import { buildTodosHref } from "./date-utils";
import type { Todo, TodoFilter } from "../actions";

export default function TodoResults({
  initialTodos,
  date,
  filter,
  initialSearch,
}: {
  initialTodos: Todo[];
  date: string;
  filter: TodoFilter;
  initialSearch: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [todos, setTodos] = useState(initialTodos);
  const router = useRouter();
  const isFirstRun = useRef(true);

  // 검색어가 바뀔 때마다 바로 요청하지 않고, 타이핑이 멈춘 뒤(400ms) 한 번만 요청
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      const trimmed = search.trim();
      const params = new URLSearchParams({ date });
      if (filter !== "all") params.set("filter", filter);
      if (trimmed) params.set("search", trimmed);

      const res = await fetch(`/api/todos?${params.toString()}`, {
        cache: "no-store",
      });
      const data: Todo[] = await res.json();
      setTodos(data);

      router.replace(buildTodosHref(date, filter, trimmed || undefined), {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [search, date, filter, router]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 rounded-sm border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-neutral-400"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full bg-transparent outline-none placeholder:text-neutral-400"
        />
      </div>

      {todos.length === 0 ? (
        <p className="py-4 text-center text-sm text-neutral-400">
          {search.trim() ? "검색 결과가 없습니다" : "아직 등록된 할 일이 없습니다"}
        </p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              date={date}
              filter={filter}
              search={search.trim()}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
