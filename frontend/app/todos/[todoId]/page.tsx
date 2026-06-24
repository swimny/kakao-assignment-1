import { getTodoById } from "@/app/actions";
import TodoEditForm from "./TodoEditForm";

// Server Component: actions.ts의 getTodoById()로 FastAPI 직접 호출
// 가져온 데이터를 Client Component(TodoEditForm)에 props로 전달
export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodoById(Number(todoId));

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        Todo 수정
      </h1>
      <TodoEditForm todo={todo} />
    </main>
  );
}
