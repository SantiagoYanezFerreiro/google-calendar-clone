import React, { useState, useEffect } from "react";
import {
  addDays,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import Event from "Event.tsx";
import EventModal from "EventModal.tsx";
import OverFlowModal from "OverFlowModal.tsx";

const Calendar: React.FC<{
  events: EventType[];
  onEventClick: (event: EventType) => void;
}> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    let currentDay = start;
    const tempDays = [];

    while (currentDay <= end) {
      tempDays.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    setDays(tempDays);
  };

  return (
    <div>
      <header>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          Previous
        </button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
        </button>
      </header>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className="calendar-day"
            onClick={() =>
              onEventClick({
                id: Date.now(),
                name: "",
                startTime: "",
                endTime: "",
                color: "",
              })
            }
          >
            <span>{format(day, "d")}</span>
            {/* Display events for the day */}
            {events
              .filter(
                (event) =>
                  format(new Date(event.startTime), "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd")
              )
              .slice(0, 2)
              .map((event, idx) => (
                <Event key={idx} event={event} />
              ))}
            {/* Show +X More if events overflow */}
            {events.filter(
              (event) =>
                format(new Date(event.startTime), "yyyy-MM-dd") ===
                format(day, "yyyy-MM-dd")
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
