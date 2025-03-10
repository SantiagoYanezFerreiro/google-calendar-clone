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

  const openOverflowModal = (day:Date) =>{
    setSelectedDay(day);
    setShowOverflowModal(true);
  }

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
        {days.map((day,index)=>{
          //Filter events for specific day
          const eventsForDay = events.filter((event) => format(new Date(event.startTime), "yyyy-MM-dd") === format(day,"yyyy-mm-dd"));
          return (<div key={index} className="calendar-day" onClick = {() => onEventClick({
            id: Date.now(),
            name: "",
            startTime: "",
            endTime: "",
            color: "#3498db",
          })}>
            <span>{format(day,"d")}</span>
            {eventsForDay.slice(0,2).map((event, idx) => (
              <Event key={idx} event={event}/>
            ))}
            {eventsForDay.length > 2 && (
              <button onClick={(e) =>{
                e.stopPropagation();
                openOverflowModal(day);
              }}>
                +More
              </button>
            ) }
          </div>)
        })}
        </div>
        {showOverFlowModal && selectedDay && (
          <OverflowModal
            selectedDay={selectedDay}
            events={events}
            closeModal={() =>setShowOverflowModal(false)}
          />
        )}
    </div>
)}

export default Calendar;
