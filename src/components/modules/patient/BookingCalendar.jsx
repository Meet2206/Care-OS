import { useState } from "react"

function buildCalendarDays(visibleMonth) {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = (firstDay.getDay() + 6) % 7
    const days = []

    for (let index = 0; index < startPadding; index += 1) {
        days.push(null)
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
        days.push(new Date(year, month, day))
    }

    return days
}

function isSameDate(a, b) {
    if (!a || !b) {
        return false
    }

    return (
        a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate()
    )
}

function toDateString(date) {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    return `${year}-${month}-${day}`
}

function BookingCalendar({ value, onChange }) {
    const today = new Date()
    const selectedDate = value ? new Date(`${value}T00:00:00`) : null
    const initialMonth = selectedDate ?? today
    const [visibleMonth, setVisibleMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1))
    const monthLabel = visibleMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    const days = buildCalendarDays(visibleMonth)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const todayFloor = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const changeMonth = (offset) => {
        setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
    }

    return (
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="rounded-full border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]"
                >
                    Prev
                </button>
                <p className="text-sm font-semibold text-[var(--ink)]">{monthLabel}</p>
                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="rounded-full border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]"
                >
                    Next
                </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] sm:gap-2 sm:text-xs">
                {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="h-10" />
                    }

                    const dayFloor = new Date(day.getFullYear(), day.getMonth(), day.getDate())
                    const disabled = dayFloor < todayFloor
                    const selected = isSameDate(day, selectedDate)
                    const isToday = !selectedDate && isSameDate(day, todayFloor)

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(toDateString(day))}
                            className={`h-9 rounded-xl text-sm font-medium sm:h-10 sm:rounded-2xl ${
                                disabled
                                    ? "cursor-not-allowed bg-[rgba(245,241,235,0.72)] text-[rgba(110,116,111,0.45)]"
                                    : selected
                                        ? "bg-[#e8f3fb] text-[var(--ink)] ring-1 ring-[#a8cfe8]"
                                        : isToday
                                            ? "bg-[#eef7f1] text-[var(--ink)] ring-1 ring-[#b7dbbf]"
                                            : "bg-[var(--panel-muted)] text-[var(--ink)]"
                            }`}
                        >
                            {day.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default BookingCalendar
