import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onEdit, onDelete }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
