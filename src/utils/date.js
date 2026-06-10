// ===================================================
// utils/date.js — 날짜 관련 유틸 함수 모음
//
// DateNav, WeekView 등 여러 컴포넌트에서 공통으로 사용
// ===================================================

const DAY_NAMES      = ['일', '월', '화', '수', '목', '금', '토']
export const WEEK_DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

// Date 객체 → 'YYYY-MM-DD' 문자열
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 오늘 날짜를 'YYYY-MM-DD'로 반환
export function getTodayKey() {
  return toDateKey(new Date())
}

// 날짜 키에서 days만큼 이동한 날짜 키 반환
export function shiftDate(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

// 해당 날짜가 속한 주의 월요일 날짜 키 반환
export function getMondayOfWeek(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = date.getDay() // 0=일, 1=월 ... 6=토
  const diff = dow === 0 ? -6 : 1 - dow // 월요일까지의 거리
  date.setDate(date.getDate() + diff)
  return toDateKey(date)
}

// 월요일 키 기준으로 7일(월~일) 날짜 키 배열 반환
export function getWeekDates(mondayKey) {
  return Array.from({ length: 7 }, (_, i) => shiftDate(mondayKey, i))
}

// 'YYYY-MM-DD' → '2025년 6월 9일 (월)' 형태
export function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const day = DAY_NAMES[date.getDay()]
  return `${y}년 ${m}월 ${d}일 (${day})`
}

// 주간 범위 레이블: 'YYYY-MM-DD ~ YYYY-MM-DD'
export function formatWeekRange(mondayKey) {
  const sundayKey = shiftDate(mondayKey, 6)
  return `${mondayKey} ~ ${sundayKey}`
}
