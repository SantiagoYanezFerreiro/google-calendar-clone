import React, { useState } from "react";
import Calendar from "./components/Calendar.tsx";
import EventModal from "./components/EventModal";
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
  const handleSaveEvent = (event: EventType) => {
    setEvents((prevEvents) => {
      const eventsExists = prevEvents.some((e) => e.id === event.id);
      return eventsExists
        ? prevEvents.map((e) => (e.id === event.id ? event : e))
        : [...prevEvents, { ...event, id: Date.now() }];
    });
    setIsModalOpen(false);
  };

  // Delete an event by id handleDeleteEvent
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
    setIsModalOpen(false);
  };

  // When an event is clicked in the Calendar, open the modal for editing handleEventClick
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1>Google Calendar Clone</h1>
      <Calendar events={events} onEventClick={handleEventClick} />
      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default App;
