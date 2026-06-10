function TodoInput({ inputText, showError, onAdd, onInputChange }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onAdd()
  }

  return (
    <section className="mb-4">
      <div className="flex gap-2.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 할 일을 입력하세요"
          maxLength={100}
          className={[
            'flex-1 px-4 py-3 text-sm bg-white text-gray-800 placeholder-gray-400 border-[1.5px] rounded-xl outline-none transition-all',
            showError
              ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(49,49,199,0.12)]',
          ].join(' ')}
        />
        <button
          onClick={onAdd}
          className="px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap cursor-pointer"
        >
          추가
        </button>
      </div>

      {showError && (
        <p className="mt-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-xl">
          할 일을 입력해주세요.
        </p>
      )}
    </section>
  )
}

export default TodoInput
