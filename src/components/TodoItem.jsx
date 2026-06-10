import { useState } from 'react'

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleEditStart() {
    setEditText(todo.text)
    setIsEditing(true)
  }

  function handleEditConfirm() {
    if (!editText.trim()) return
    onEdit(todo.id, editText.trim())
    setIsEditing(false)
  }

  function handleEditCancel() {
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleEditConfirm()
    if (e.key === 'Escape') handleEditCancel()
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">

      {isEditing ? (
        <>
          <input
            className="flex-1 px-3.5 py-2.5 text-sm border-[1.5px] border-primary rounded-xl outline-none shadow-[0_0_0_3px_rgba(49,49,199,0.12)] text-gray-800"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoFocus
          />
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={handleEditConfirm}
              disabled={!editText.trim()}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              확인
            </button>
            <button
              onClick={handleEditCancel}
              className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <span className={`flex-1 text-sm leading-relaxed break-all ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {todo.text}
          </span>

          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => onToggle(todo.id)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap cursor-pointer"
            >
              {todo.completed ? '되돌리기' : '완료'}
            </button>

            <button
              onClick={handleEditStart}
              disabled={todo.completed}
              className="px-3.5 py-2 text-xs font-semibold text-primary bg-sub rounded-lg hover:bg-sub-dark transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              수정
            </button>

            <button
              onClick={() => onDelete(todo.id)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem
