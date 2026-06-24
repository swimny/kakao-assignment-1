import Link from "next/link";
import { getTodos } from "@/app/actions";

// Server Component: actions.ts의 getTodos()로 FastAPI 직접 호출
export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        Todo 목록
      </h1>

      <Link
        href="/todos/new"
        style={{
          display: "inline-block",
          marginBottom: 24,
          padding: "8px 16px",
          background: "#0070f3",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        + 새 Todo 추가
      </Link>

      {todos.length === 0 ? (
        <p style={{ color: "#888" }}>Todo가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#aaa" : "#000",
                }}
              >
                {todo.text}
                <span style={{ marginLeft: 8, fontSize: 12, color: "#999" }}>
                  {todo.date}
                </span>
              </span>
              <Link
                href={`/todos/${todo.id}`}
                style={{ fontSize: 13, color: "#0070f3" }}
              >
                수정
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
