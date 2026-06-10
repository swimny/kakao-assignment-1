import { getTodayKey, getWeekDates, formatWeekRange, WEEK_DAY_LABELS } from '../utils/date'

function WeekView({ weekStartDate, selectedDate, todos, onSelectDate, onPrevWeek, onNextWeek }) {
  const todayKey  = getTodayKey()
  const weekDates = getWeekDates(weekStartDate)
  const selectedIsToday = selectedDate === todayKey

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevWeek}
          aria-label="이전 주"
          className="text-primary text-base leading-none cursor-pointer hover:opacity-60 transition-opacity"
        >
          &#9664;
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">
            {formatWeekRange(weekStartDate)}
          </span>
          {!selectedIsToday && (
            <button
              onClick={() => onSelectDate(todayKey)}
              className="px-2.5 py-0.5 text-xs font-medium text-primary bg-sub border border-sub-dark rounded-lg hover:bg-sub-dark transition-colors cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={onNextWeek}
          aria-label="다음 주"
          className="text-primary text-base leading-none cursor-pointer hover:opacity-60 transition-opacity"
        >
          &#9654;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDates.map((dateKey, i) => {
          const isToday    = dateKey === todayKey
          const isSelected = dateKey === selectedDate
          const activeCount = todos.filter(
            (t) => t.date === dateKey && !t.completed
          ).length

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              aria-label={`${dateKey} 선택`}
              className={[
                'flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-[1.5px] cursor-pointer transition-colors',
                isSelected
                  ? 'bg-primary border-primary'
                  : isToday
                  ? 'bg-sub border-sub-dark'
                  : 'border-transparent hover:bg-sub',
              ].join(' ')}
            >
              <span className={`text-[0.65rem] font-medium leading-none ${
                isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-gray-400'
              }`}>
                {WEEK_DAY_LABELS[i]}
              </span>

              <span className={`w-6 h-6 flex items-center justify-center text-sm font-semibold rounded-full ${
                isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-gray-700'
              }`}>
                {Number(dateKey.split('-')[2])}
              </span>

              <span className={[
                'h-3.5 min-w-3.5 px-1 flex items-center justify-center text-[0.55rem] font-semibold rounded-full leading-none',
                activeCount > 0
                  ? isSelected ? 'bg-white text-primary' : 'bg-primary text-white'
                  : 'invisible',
              ].join(' ')}>
                {activeCount > 0 ? activeCount : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeekView
