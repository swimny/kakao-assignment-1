import { getTodayKey, isValidDateKey } from "../date-utils";
import CreateTodoForm from "./CreateTodoForm";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: rawDate } = await searchParams;
  const date = isValidDateKey(rawDate) ? rawDate : getTodayKey();

  return <CreateTodoForm date={date} />;
}
