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

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useStat([]);
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showOverflowModal, setShowOverflowModal] = useState(false);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    let currentDay = start;
    const tempDays = [];
    while (currentDay < end) {
      tempDays.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    setDays(tempDays);
  };

  const openEventModal = (day) => {
    setSelectedDay(day);
    setShowEventModal(true);
  };

  const openOverflowModal = (day) => {
    setSelectedDay(day);
    setShowOverflowModal(true);
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
    </div>
  );
}
