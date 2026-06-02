/* ===================================================
   Todo App - app.js
   기능: Todo CRUD + 상태별 필터링 + 일간 뷰 + 주간 뷰
=================================================== */

// ===== DOM 요소 참조 =====
const todoInput      = document.getElementById('todoInput');
const addButton      = document.getElementById('addButton');
const todoList       = document.getElementById('todoList');
const errorMessage   = document.getElementById('errorMessage');
const emptyState     = document.getElementById('emptyState');
const filterTabs     = document.querySelectorAll('.filter-tab');
// 일간 네비게이터
const prevDayButton  = document.getElementById('prevDayButton');
const nextDayButton  = document.getElementById('nextDayButton');
const todayButton    = document.getElementById('todayButton');
const dateLabel      = document.getElementById('dateLabel');
// 주간 뷰
const prevWeekButton = document.getElementById('prevWeekButton');
const nextWeekButton = document.getElementById('nextWeekButton');
const weekRangeLabel = document.getElementById('weekRangeLabel');
const weekGrid       = document.getElementById('weekGrid');
// 월간 달력 팝업
const calendarPopup  = document.getElementById('calendarPopup');
const calPrevMonth   = document.getElementById('calPrevMonth');
const calNextMonth   = document.getElementById('calNextMonth');
const calMonthLabel  = document.getElementById('calMonthLabel');
const calGrid        = document.getElementById('calGrid');

// ===== 날짜 유틸 =====
const DAY_NAMES      = ['일', '월', '화', '수', '목', '금', '토'];
const WEEK_DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']; // 월요일 시작

// Date → 'YYYY-MM-DD' (로컬 시간 기준)
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 'YYYY-MM-DD' → Date (로컬 시간 기준)
function dateKeyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Date → 'YYYY년 M월 D일 (요일)'
function formatDateLabel(date) {
  const y   = date.getFullYear();
  const m   = date.getMonth() + 1;
  const d   = date.getDate();
  const day = DAY_NAMES[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

// 해당 날짜가 속한 주의 월요일 반환
function getMondayOfWeek(date) {
  const d   = new Date(date);
  const dow = d.getDay(); // 0=일, 1=월 ... 6=토
  const diff = dow === 0 ? -6 : 1 - dow; // 월요일까지의 오프셋
  d.setDate(d.getDate() + diff);
  return d;
}

// 월요일 기준으로 해당 주 7일(월~일) Date 배열 반환
function getWeekDates(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// 주 범위 레이블 포맷: '6월 2일 – 8일' or '5월 30일 – 6월 5일'
function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const m1 = monday.getMonth() + 1, d1 = monday.getDate();
  const m2 = sunday.getMonth() + 1, d2 = sunday.getDate();
  if (m1 === m2) return `${m1}월 ${d1}일 – ${d2}일`;
  return `${m1}월 ${d1}일 – ${m2}월 ${d2}일`;
}

// ===== 로컬스토리지 키 =====
const STORAGE_KEY = 'todo-app-data';

// 전체 todos 배열을 로컬스토리지에 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에서 todos 불러오기 — 없으면 빈 배열 반환
function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    // 저장 데이터가 손상된 경우 빈 배열로 초기화
    return [];
  }
}

// ===== 상태 =====
// 각 Todo는 { id, text, completed, date } 구조 — date: 'YYYY-MM-DD'
let todos         = loadTodos(); // 로컬스토리지에서 복원
// 저장된 todo 중 가장 큰 id보다 1 크게 설정해 ID 중복 방지
let nextId        = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let selectedDate  = toDateKey(new Date());       // 현재 선택된 날짜
let weekMonday    = getMondayOfWeek(new Date()); // 주간 뷰의 기준 월요일
// 월간 달력 팝업 상태 (0-indexed month)
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

// ===== 이벤트 리스너 =====

addButton.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

todoInput.addEventListener('input', clearError);

// 필터 탭
filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    currentFilter = tab.dataset.filter;
    updateFilterTabs();
    renderAll();
  });
});

// 일간 네비게이터
prevDayButton.addEventListener('click', () => {
  const d = dateKeyToDate(selectedDate);
  d.setDate(d.getDate() - 1);
  selectDate(toDateKey(d));
});

nextDayButton.addEventListener('click', () => {
  const d = dateKeyToDate(selectedDate);
  d.setDate(d.getDate() + 1);
  selectDate(toDateKey(d));
});

todayButton.addEventListener('click', () => {
  selectDate(toDateKey(new Date()));
});

// 주간 범위 레이블 클릭 → 달력 모달 토글
weekRangeLabel.addEventListener('click', () => {
  calendarPopup.classList.contains('hidden') ? openCalendar() : closeCalendar();
});

// 오버레이 배경(모달 바깥) 클릭 시 닫기 — 모달 내부 클릭은 제외
calendarPopup.addEventListener('click', (e) => {
  if (e.target === calendarPopup) closeCalendar();
});

// Escape 키로 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCalendar();
});

// 이전 달 버튼
calPrevMonth.addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

// 다음 달 버튼
calNextMonth.addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

// 주간 네비게이터 — weekMonday만 이동, selectedDate는 유지
prevWeekButton.addEventListener('click', () => {
  const d = new Date(weekMonday);
  d.setDate(d.getDate() - 7);
  weekMonday = d;
  renderWeekView();
});

nextWeekButton.addEventListener('click', () => {
  const d = new Date(weekMonday);
  d.setDate(d.getDate() + 7);
  weekMonday = d;
  renderWeekView();
});

// ===== 날짜 선택 (중앙 함수) =====
// selectedDate 변경 시 항상 이 함수를 통해 변경 — 연관 UI를 일괄 갱신
function selectDate(dateKey) {
  selectedDate = dateKey;

  // selectedDate가 현재 주간 뷰 범위를 벗어나면 주간 뷰를 따라감
  const newMonday = getMondayOfWeek(dateKeyToDate(dateKey));
  if (toDateKey(newMonday) !== toDateKey(weekMonday)) {
    weekMonday = newMonday;
  }

  updateDateDisplay();
  renderWeekView();
  renderAll();
}

// ===== Todo 생성 =====
function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showError();
    return;
  }

  // 현재 선택된 날짜를 함께 저장
  const newTodo = { id: nextId++, text, completed: false, date: selectedDate };
  todos.push(newTodo);
  saveTodos();

  todoInput.value = '';
  clearError();
  renderWeekView(); // 뱃지 카운트 갱신
  renderAll();
}

// ===== Todo 완료 토글 =====
function toggleComplete(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderWeekView(); // 진행 중 뱃지 카운트 갱신
    renderAll();
  }
}

// ===== Todo 삭제 =====
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderWeekView(); // 뱃지 카운트 갱신
  renderAll();
}

// ===== Todo 수정 (인라인 편집) =====
function startEdit(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const listItem = todoList.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  const textEl  = listItem.querySelector('.todo-text');
  const editBtn = listItem.querySelector('.edit-button');

  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'edit-input';
  editInput.value     = todo.text;
  editInput.maxLength = 100;
  textEl.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  editBtn.textContent = '저장';
  editBtn.onclick = () => saveEdit(id, editInput);

  listItem.querySelector('.complete-button').disabled = true;
  listItem.querySelector('.delete-button').disabled   = true;

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit(id, editInput);
    if (e.key === 'Escape') renderAll();
  });
}

function saveEdit(id, editInput) {
  const newText = editInput.value.trim();
  if (!newText) { renderAll(); return; }

  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = newText;
    saveTodos();
    renderAll();
  }
}

// ===== 오류 표시 / 해제 =====
function showError() {
  errorMessage.classList.remove('hidden');
  todoInput.classList.add('input-error');
  todoInput.focus();
}

function clearError() {
  errorMessage.classList.add('hidden');
  todoInput.classList.remove('input-error');
}

// ===== 일간 날짜 표시 업데이트 =====
function updateDateDisplay() {
  dateLabel.textContent = formatDateLabel(dateKeyToDate(selectedDate));

  const isToday = selectedDate === toDateKey(new Date());
  todayButton.classList.toggle('hidden', isToday);
}

// ===== 필터 탭 활성화 스타일 업데이트 =====
function updateFilterTabs() {
  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === currentFilter);
  });
}

// ===== 월간 달력 팝업 열기 / 닫기 =====
function openCalendar() {
  // 열 때는 선택된 날짜의 월로 맞춤
  const date = dateKeyToDate(selectedDate);
  calYear  = date.getFullYear();
  calMonth = date.getMonth();
  renderCalendar();
  calendarPopup.classList.remove('hidden');
}

function closeCalendar() {
  calendarPopup.classList.add('hidden');
}

// ===== 월간 달력 렌더링 =====
// 항상 6행 × 7열 = 42칸으로 고정 렌더링 (4주/5주/6주 모두 동일 높이)
function renderCalendar() {
  calMonthLabel.textContent = `${calYear}년 ${calMonth + 1}월`;
  calGrid.innerHTML = '';

  const todayKey = toDateKey(new Date());

  // 일요일 시작 달력: getDay() 반환값(일=0 … 토=6)을 열 인덱스로 바로 사용
  const firstColIndex = new Date(calYear, calMonth, 1).getDay();

  // 42칸 순회 (6행 × 7열 고정)
  for (let i = 0; i < 42; i++) {
    const dayOffset      = i - firstColIndex;
    const date           = new Date(calYear, calMonth, 1 + dayOffset);
    const dateKey        = toDateKey(date);
    const isCurrentMonth = date.getMonth() === calMonth;
    const isToday        = dateKey === todayKey;
    const isSelected     = dateKey === selectedDate;
    const colIndex       = i % 7; // 0=일, 6=토

    const cell = document.createElement('button');
    cell.className   = 'cal-date-cell';
    cell.textContent = date.getDate();

    if (colIndex === 0)    cell.classList.add('col-sun'); // 일요일 빨강
    if (colIndex === 6)    cell.classList.add('col-sat'); // 토요일 파랑
    if (!isCurrentMonth)   cell.classList.add('other-month');
    if (isToday)           cell.classList.add('today');
    if (isSelected)        cell.classList.add('selected');

    cell.addEventListener('click', () => {
      selectDate(dateKey);
      closeCalendar();
    });

    calGrid.appendChild(cell);
  }
}

// ===== 주간 뷰 렌더링 =====
function renderWeekView() {
  weekRangeLabel.textContent = formatWeekRange(weekMonday);
  weekGrid.innerHTML = '';

  const todayKey   = toDateKey(new Date());
  const weekDates  = getWeekDates(weekMonday);

  weekDates.forEach((date, i) => {
    const dateKey     = toDateKey(date);
    const isToday     = dateKey === todayKey;
    const isSelected  = dateKey === selectedDate;
    // 진행 중인 Todo 개수만 표시
    const activeCount = todos.filter((t) => t.date === dateKey && !t.completed).length;

    const cell       = document.createElement('button');
    cell.className   = 'day-cell';
    if (isToday)    cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');
    cell.setAttribute('aria-label', `${date.getMonth() + 1}월 ${date.getDate()}일 선택`);

    // 요일 (월~일)
    const nameEl       = document.createElement('span');
    nameEl.className   = 'day-cell-name';
    nameEl.textContent = WEEK_DAY_NAMES[i]; // i=0→월, i=6→일

    // 날짜 숫자
    const numEl       = document.createElement('span');
    numEl.className   = 'day-cell-number';
    numEl.textContent = date.getDate();

    // 진행 중 뱃지 — 0개여도 자리 유지
    const badge       = document.createElement('span');
    badge.className   = activeCount > 0 ? 'day-cell-badge' : 'day-cell-badge day-cell-badge--empty';
    badge.textContent = activeCount > 0 ? activeCount : '';

    cell.append(nameEl, numEl, badge);

    // 날짜 셀 클릭 → 해당 날짜 선택
    cell.addEventListener('click', () => selectDate(dateKey));

    weekGrid.appendChild(cell);
  });
}

// ===== 현재 날짜 + 상태 필터에 맞는 Todo 반환 =====
function getFilteredTodos() {
  const byDate = todos.filter((t) => t.date === selectedDate);
  if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
  if (currentFilter === 'completed') return byDate.filter((t) => t.completed);
  return byDate;
}

// ===== 빈 상태 메시지 =====
const EMPTY_MESSAGES = {
  all:       '이 날의 할 일이 없습니다. 새로운 Todo를 추가해보세요!',
  active:    '진행 중인 할 일이 없습니다.',
  completed: '완료된 할 일이 없습니다.',
};

// ===== Todo 목록 렌더링 =====
function renderAll() {
  todoList.innerHTML = '';

  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    emptyState.querySelector('p').textContent = EMPTY_MESSAGES[currentFilter];
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  filtered.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
}

// ===== Todo 아이템 DOM 생성 =====
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className  = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id;

  const textSpan       = document.createElement('span');
  textSpan.className   = 'todo-text';
  textSpan.textContent = todo.text;

  const actions     = document.createElement('div');
  actions.className = 'item-actions';

  const completeBtn       = document.createElement('button');
  completeBtn.className   = 'action-button complete-button';
  completeBtn.textContent = todo.completed ? '되돌리기' : '완료';
  completeBtn.addEventListener('click', () => toggleComplete(todo.id));

  const editBtn       = document.createElement('button');
  editBtn.className   = 'action-button edit-button';
  editBtn.textContent = '수정';
  editBtn.disabled    = todo.completed;
  editBtn.addEventListener('click', () => startEdit(todo.id));

  const deleteBtn       = document.createElement('button');
  deleteBtn.className   = 'action-button delete-button';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  actions.append(completeBtn, editBtn, deleteBtn);
  li.append(textSpan, actions);

  return li;
}

// ===== 초기화 =====
// 모든 상수·함수 선언 이후에 실행
updateDateDisplay();
renderWeekView();
renderAll();
