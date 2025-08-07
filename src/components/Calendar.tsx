import { useState, useEffect } from "react";
import {
  addDays,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  format,
} from "date-fns";
import { EventType } from "../types/eventTypes";
import Day from "./Day";
import OverflowModal from "./OverflowModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles.css";

interface CalendarProps {
  events: EventType[];
  onEventClick: (event: EventType) => void;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventClick,
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [overflowEvents, setOverflowEvents] = useState<EventType[]>([]);
  const [showOverflowModal, setShowOverflowModal] = useState(false);
  const [maxVisibleEvents, setMaxVisibleEvents] = useState(2);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("events", JSON.stringify(events));
    }, 500); // 500ms debounce delay
    return () => clearTimeout(timer);
  }, [events]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    let currentDay = start;
    const tempDays: Date[] = [];
    while (currentDay <= end) {
      tempDays.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    setDays(tempDays);
  };

  const openOverflowModal = (day: Date, overflowEvents: EventType[]) => {
    setSelectedDay(day);
    setOverflowEvents(overflowEvents);
    setShowOverflowModal(true);
  };

  const getEventsForDay = (day: Date) => {
    return events
      .filter(
        (event) =>
          format(new Date(event.startTime), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      )
      .sort((a, b) =>
        a.allDay === b.allDay
          ? a.startTime.localeCompare(b.startTime)
          : a.allDay
          ? -1
          : 1
      );
  };

  useEffect(() => {
    const calculateVisibleEvents = () => {
      const dayEl = document.querySelector(".calendar-day");
      if (dayEl) {
        const dayHeight = dayEl.clientHeight;
        const headerHeight = 30;
        const addButtonHeight = 24;
        const eventHeight = 22;
        const availableHeight = dayHeight - headerHeight - addButtonHeight;
        const visibleCount = Math.floor(availableHeight / eventHeight);
        setMaxVisibleEvents(Math.max(visibleCount, 1));
      }
    };

    const observer = new ResizeObserver(calculateVisibleEvents);
    const container = document.querySelector(".calendar-container");
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <button
          className="calendar-header-today"
          onClick={() => setCurrentMonth(new Date())}
          aria-label="Go to today"
        >
          Today
        </button>
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          aria-label="Previous month"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          aria-label="Next month"
        >
          <FaChevronRight />
        </button>
        <h2 className="calendar-header-month">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
      </header>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPastDate = day < today;
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const eventsForDay = getEventsForDay(day);

          return (
            <Day
              key={index}
              day={day}
              events={eventsForDay}
              isCurrentMonth={isCurrentMonth}
              isPastDate={isPastDate}
              isSelected={
                selectedDate
                  ? format(day, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                  : false
              }
              maxVisibleEvents={maxVisibleEvents}
              onEventClick={onEventClick}
              onDateSelect={onDateSelect}
              onMoreClick={openOverflowModal}
              showDayName={index < 7}
            />
          );
        })}
      </div>

      {showOverflowModal && selectedDay && (
        <OverflowModal
          selectedDay={selectedDay}
          events={overflowEvents}
          closeModal={() => setShowOverflowModal(false)}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
};
export default Calendar;
