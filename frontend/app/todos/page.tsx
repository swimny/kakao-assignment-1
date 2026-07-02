import Link from "next/link";
import { getActiveCountsByDate, getTodos, type TodoFilter } from "../actions";
import TodoCreateForm from "./TodoCreateForm";
import TodoResults from "./TodoResults";
import {
  buildTodosHref,
  formatWeekRange,
  getMondayOfWeek,
  getTodayKey,
  getWeekDates,
  isValidDateKey,
  shiftDate,
} from "./date-utils";

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string; search?: string }>;
}) {
  const { filter: rawFilter, date: rawDate, search: rawSearch } =
    await searchParams;
  const filter: TodoFilter =
    rawFilter === "active" || rawFilter === "completed" ? rawFilter : "all";
  const search = rawSearch?.trim() ?? "";

  const todayKey = getTodayKey();
  const selectedDate = isValidDateKey(rawDate) ? rawDate : todayKey;
  const weekStart = getMondayOfWeek(selectedDate);
  const weekDates = getWeekDates(weekStart);
  const prevWeekDate = shiftDate(selectedDate, -7);
  const nextWeekDate = shiftDate(selectedDate, 7);

  const [todos, activeCounts] = await Promise.all([
    getTodos(filter, selectedDate, search),
    getActiveCountsByDate(),
  ]);

  return (
    <div>
      <h1 className="mb-5 border-b-2 border-slate-900 pb-2 text-center text-lg font-bold uppercase tracking-widest text-slate-900">
        Todo List
      </h1>

      {/* 날짜 이동 (한 주 단위) */}
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-neutral-600">
        <Link href={buildTodosHref(prevWeekDate, filter, search)} aria-label="이전 주" className="px-2">
          ◀
        </Link>
        <div className="flex items-center gap-2">
          <span>{formatWeekRange(weekStart)}</span>
          {selectedDate !== todayKey && (
            <Link
              href={buildTodosHref(todayKey, filter, search)}
              className="rounded-sm border border-neutral-300 px-2 py-0.5 text-xs font-semibold text-neutral-500"
            >
              오늘
            </Link>
          )}
        </div>
        <Link href={buildTodosHref(nextWeekDate, filter, search)} aria-label="다음 주" className="px-2">
          ▶
        </Link>
      </div>

      {/* 요일 선택 */}
      <div className="mb-3 grid grid-cols-7 gap-1">
        {weekDates.map((dateKey, i) => {
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const activeCount = activeCounts[dateKey] ?? 0;

          return (
            <Link
              key={dateKey}
              href={buildTodosHref(dateKey, filter, search)}
              aria-label={`${dateKey} 선택`}
              className={`flex flex-col items-center gap-0.5 rounded-sm border py-2 text-xs font-semibold ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : isToday
                    ? "border-slate-900 bg-white text-slate-900"
                    : "border-neutral-200 bg-neutral-100 text-neutral-600"
              }`}
            >
              <span>{WEEKDAY_LABELS[i]}</span>
              <span>{Number(dateKey.split("-")[2])}</span>
              <span className={isSelected ? "text-white/70" : "text-neutral-400"}>
                {activeCount}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mb-3">
        <TodoCreateForm date={selectedDate} />
      </div>

      {/* 필터 탭 - URL 파라미터(?filter=)로 상태 관리, 서버에서 필터링 */}
      <div className="mb-3 flex rounded-sm border border-neutral-200 text-sm font-semibold">
        {FILTERS.map(({ value, label }, i) => (
          <Link
            key={value}
            href={buildTodosHref(selectedDate, value, search)}
            className={`flex-1 py-2 text-center ${i > 0 ? "border-l border-neutral-200" : ""} ${
              filter === value ? "bg-slate-900 text-white" : "text-neutral-400"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 검색 + 목록 - 검색은 타이핑 디바운스 후 /api/todos(route.ts)로 클라이언트 요청 */}
      <TodoResults
        initialTodos={todos}
        date={selectedDate}
        filter={filter}
        initialSearch={search}
      />
    </div>
  );
}
