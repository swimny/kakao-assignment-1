"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Todo } from "@/app/actions";

// Client Component: 수정/삭제 버튼 클릭 필요 → "use client"
// 수정/삭제 요청은 fetch('/api/todos/[id]') → route.ts → FastAPI 순서로 전달
export default function TodoEditForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [date, setDate] = useState(todo.date);
  const [completed, setCompleted] = useState(todo.completed);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed, date }),
    });
    router.push("/todos");
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.id}`, { method: "DELETE" });
    router.push("/todos");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>할 일</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor="completed">완료</label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "#aaa" : "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            저장
          </button>
          <a
            href="/todos"
            style={{
              padding: "10px 20px",
              border: "1px solid #ddd",
              borderRadius: 6,
              textDecoration: "none",
              color: "#333",
            }}
          >
            취소
          </a>
        </div>
      </form>

      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#aaa" : "#e00",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          width: "fit-content",
        }}
      >
        삭제
      </button>
    </div>
  );
}
