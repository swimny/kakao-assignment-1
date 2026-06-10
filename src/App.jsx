import { useState, useEffect } from 'react'
import { getTodayKey, shiftDate, getMondayOfWeek } from './utils/date'
import WeekView from './components/WeekView'
import TodoInput from './components/TodoInput'
import FilterTabs from './components/FilterTabs'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  const [inputText, setInputText] = useState('')
  const [showError, setShowError] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('all')

  const [selectedDate, setSelectedDate] = useState(getTodayKey)

  const [weekStartDate, setWeekStartDate] = useState(() => getMondayOfWeek(getTodayKey()))

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function handleSelectDate(dateKey) {
    setSelectedDate(dateKey)
    const newMonday = getMondayOfWeek(dateKey)
    if (newMonday !== weekStartDate) {
      setWeekStartDate(newMonday)
    }
  }

  function handleAdd() {
    if (!inputText.trim()) {
      setShowError(true)
      return
    }
    const newTodo = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      date: selectedDate,
    }
    setTodos([...todos, newTodo])
    setInputText('')
    setShowError(false)
  }

  function handleInputChange(value) {
    setInputText(value)
    setShowError(false)
  }

  function handleToggle(id) {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  function handleEdit(id, newText) {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos
    .filter((todo) => todo.date === selectedDate)
    .filter((todo) => {
      if (currentFilter === 'active')    return !todo.completed
      if (currentFilter === 'completed') return todo.completed
      return true
    })

  return (
    <div className="w-full py-10">
      <h1 className="text-3xl font-bold text-primary mb-5 tracking-tight">
        Todo List
      </h1>

      <WeekView
        weekStartDate={weekStartDate}
        selectedDate={selectedDate}
        todos={todos}
        onSelectDate={handleSelectDate}
        onPrevWeek={() => setWeekStartDate(shiftDate(weekStartDate, -7))}
        onNextWeek={() => setWeekStartDate(shiftDate(weekStartDate, +7))}
      />

      <TodoInput
        inputText={inputText}
        showError={showError}
        onAdd={handleAdd}
        onInputChange={handleInputChange}
      />

      <FilterTabs
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App
