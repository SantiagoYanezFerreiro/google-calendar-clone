import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar.tsx";
import Event from "./components/Event.tsx";
import EventModal from "./components/EventModal.tsx";
import OverflowModal from "./components/OverflowModal.tsx";
import { EventType } from "./types/eventTypes.ts";
import "./App.css";
import "index.css";

const App: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([
    {
      id: 1,
      name: "Meeting",
      startTime: "2025-03-15T10:00",
      endTime: "2025-03-15T11:00",
      color: "#3498db",
    },
    {
      id: 2,
      name: "Lunch",
      startTime: "2025-03-15T12:00",
      endTime: "2025-03-15T13:00",
      color: "#e74c3c",
    },
  ]);
  // Modal state for creating/editing events
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save a new event or update an existing event handleSaveEvent
  // Delete an event by id handleDeleteEvent
  // When an event is clicked in the Calendar, open the modal for editing handleEventClick

  return (
    <div>
      <h1>Google Calendar Clone</h1>
    </div>
  );
};

export default App;
