import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar.tsx";
import EventModal from "./components/EventModal";
import { EventType } from "./types/eventTypes";
import "./App.css";
import "./styles.css";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <Calendar
        events={events}
        onEventClick={handleEventClick}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
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
