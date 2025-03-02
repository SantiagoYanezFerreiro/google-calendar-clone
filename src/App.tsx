import React, { useState, useEffect } from "react";
import {
  addDays,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import Calendar from "Calendar.tsx";
import Event from "Event.tsx";
import EventModal from "EventModal.tsx";
import OverFlowModal from "OverFlowModal.tsx";
import "./App.css";
import "index.css";

export default function App() {
  return (
    <>
      const [value, setValue] = useState();
      <DatePicker value={value} onChange={setValue} />
      <p>Initial Component</p>
    </>
  );
}
