const TABS = [
  { value: 'all',       label: '전체' },
  { value: 'active',    label: '진행중' },
  { value: 'completed', label: '완료' },
]

function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-1.5 mb-4 bg-sub p-1.5 rounded-xl">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onFilterChange(tab.value)}
          className={[
            'flex-1 py-2 text-sm rounded-lg transition-all cursor-pointer',
            currentFilter === tab.value
              ? 'bg-primary text-white font-semibold shadow-sm'
              : 'text-gray-500 font-medium hover:bg-sub-dark hover:text-primary',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
