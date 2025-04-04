import React, { useState, useEffect } from "react";
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
import { EventType } from "../types/eventTypes.ts";
import Event from "./Event";
import OverflowModal from "./OverflowModal.tsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";
import "../styles.css";

interface CalendarProps {
  events: EventType[];
  onEventClick: (event: EventType) => void;
}

const MAX_VISIBLE_EVENTS = 2; // Maximum number of events visible in a day cell

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [overflowEvents, setOverflowEvents] = useState<EventType[]>([]);
  const [showOverflowModal, setShowOverflowModal] = useState(false);

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
          const dayClass = `calendar-day ${
            !isCurrentMonth ? "outside-month" : ""
          } ${isPastDate ? "past-date" : ""}`;

          const eventsForDay = getEventsForDay(day);
          const visibleEvents = eventsForDay.slice(0, MAX_VISIBLE_EVENTS);
          const dayOverflowEvents = eventsForDay.slice(MAX_VISIBLE_EVENTS);

          return (
            <div key={index} className={dayClass}>
              {index < 7 && (
                <div className="day-abbr">
                  {format(day, "EEE").toUpperCase()}
                </div>
              )}
              <span className="day-number">{format(day, "d")}</span>
              {eventsForDay && eventsForDay.length > 0 ? (
                visibleEvents.map((event) => (
                  <Event key={event.id} event={event} onClick={onEventClick} />
                ))
              ) : (
                <p>No Events</p>
              )}
              {overflowEvents.length > 0 && (
                <button
                  className="overflow-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOverflowModal(day, dayOverflowEvents);
                  }}
                  aria-label={`Show ${overflowEvents.length} more events`}
                >
                  +{overflowEvents.length} More
                </button>
              )}
              <div className="add-event-container">
                <button
                  className="add-event-button"
                  aria-label="Add event"
                  onClick={() =>
                    onEventClick({
                      id: Date.now(),
                      name: "",
                      startTime: `${format(day, "yyyy-MM-dd")}T09:00`,
                      endTime: `${format(day, "yyyy-MM-dd")}T12:00`,
                      color: "hsl(200, 80%, 50%)",
                    })
                  }
                >
                  <MdOutlineEventAvailable />
                </button>
              </div>
            </div>
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
