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
import "../styles.css";

interface CalendarProps {
  events: EventType[];
  onEventClick: (event: EventType) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showOverFlowModal, setShowOverflowModal] = useState(false);

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

  const openOverflowModal = (day: Date) => {
    setSelectedDay(day);
    setShowOverflowModal(true);
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date())}>Today</button>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <FaChevronLeft />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <FaChevronRight />
        </button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
      </header>

      <div className="calendar-grid">
        {days.map((day, index) => {
          //Filter events for specific day
          const isPastDate = day < new Date();
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const dayClass = `calendar-day ${
            !isCurrentMonth ? "outside-month" : ""
          } ${isPastDate ? "past-date" : ""}`;
          const eventsForDay = events.filter(
            (event) =>
              format(new Date(event.startTime), "yyyy-MM-dd") ===
              format(day, "yyyy-MM-dd")
          );
          return (
            <div
              key={index}
              className={dayClass}
              onClick={() =>
                onEventClick({
                  id: Date.now(),
                  name: "",
                  startTime: "",
                  endTime: "",
                  color: "#3498db",
                })
              }
            >
              <span className="day-number">{format(day, "d")}</span>
              {eventsForDay.slice(0, 2).map((event, idx) => (
                <Event key={idx} event={event} onClick={onEventClick} />
              ))}
              {eventsForDay.length > 2 && (
                <button
                  className="overflow-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOverflowModal(day);
                  }}
                >
                  +More
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showOverFlowModal && selectedDay && (
        <OverflowModal
          selectedDay={selectedDay}
          events={events}
          closeModal={() => setShowOverflowModal(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
