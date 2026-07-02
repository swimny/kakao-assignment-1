import { notFound } from "next/navigation";
import { getTodos } from "../../actions";
import { buildTodosHref, getTodayKey, isValidDateKey } from "../date-utils";
import EditTodoForm from "./EditTodoForm";

export default async function EditTodoPage({
  params,
  searchParams,
}: {
  params: Promise<{ todoId: string }>;
  searchParams: Promise<{ date?: string; filter?: string; search?: string }>;
}) {
  const { todoId } = await params;
  const { date: rawDate, filter, search } = await searchParams;
  const date = isValidDateKey(rawDate) ? rawDate : getTodayKey();

  const todos = await getTodos();
  const todo = todos.find((t) => String(t.id) === todoId);

  if (!todo) {
    notFound();
  }

  const returnTo = buildTodosHref(date, filter, search);

  return <EditTodoForm todo={todo} returnTo={returnTo} />;
}
