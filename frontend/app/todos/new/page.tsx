"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Client Component: 입력 상태 관리 필요 → "use client"
// 생성 요청은 fetch('/api/todos') → route.ts → FastAPI 순서로 전달
export default function NewTodoPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [text, setText] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false, date }),
    });
    router.push("/todos");
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        새 Todo 추가
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>할 일</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="할 일을 입력하세요"
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
            {loading ? "추가 중..." : "추가"}
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
    </main>
  );
}
