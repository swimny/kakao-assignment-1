export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayKey(): string {
  return toDateKey(new Date());
}

export function shiftDate(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getMondayOfWeek(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + diff);
  return toDateKey(date);
}

export function getWeekDates(mondayKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => shiftDate(mondayKey, i));
}

export function formatWeekRange(mondayKey: string): string {
  const sundayKey = shiftDate(mondayKey, 6);
  return `${mondayKey} ~ ${sundayKey}`;
}

export function isValidDateKey(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function buildTodosParams(
  date: string,
  filter?: string,
  search?: string
): URLSearchParams {
  const params = new URLSearchParams({ date });
  if (filter && filter !== "all") {
    params.set("filter", filter);
  }
  if (search) {
    params.set("search", search);
  }
  return params;
}

export function buildTodosHref(
  date: string,
  filter?: string,
  search?: string
): string {
  return `/todos?${buildTodosParams(date, filter, search).toString()}`;
}
