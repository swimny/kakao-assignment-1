import { getTodayKey, formatDateLabel } from '../utils/date'

function DateNav({ selectedDate, onPrev, onNext, onToday }) {
  const isToday = selectedDate === getTodayKey()

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-5 py-5 shadow-sm">
        <button
          onClick={onPrev}
          aria-label="이전 날짜"
          className="w-9 h-9 flex items-center justify-center text-2xl text-primary bg-sub rounded-lg hover:bg-sub-dark transition-colors cursor-pointer"
        >
          &#8249;
        </button>

        <span className="text-base font-semibold text-gray-800">
          {formatDateLabel(selectedDate)}
        </span>

        <button
          onClick={onNext}
          aria-label="다음 날짜"
          className="w-9 h-9 flex items-center justify-center text-2xl text-primary bg-sub rounded-lg hover:bg-sub-dark transition-colors cursor-pointer"
        >
          &#8250;
        </button>
      </div>

      <div className="flex justify-end min-h-7 pt-2">
        {!isToday && (
          <button
            onClick={onToday}
            className="px-3.5 py-1 text-xs font-medium text-primary bg-sub border border-sub-dark rounded-lg hover:bg-sub-dark transition-colors cursor-pointer"
          >
            Today
          </button>
        )}
      </div>
    </div>
  )
}

export default DateNav
