import React, { useState, useEffect } from "react";
import { EventType } from "../types/eventTypes";
import "../styles.css";
import { format } from "date-fns";

interface EventModalProps {
  event: (EventType & { allDay?: boolean }) | null;
  onClose: () => void;
  onSave: (event: EventType) => void;
  onDelete: (id: number) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onSave,
  onDelete,
}) => {
  const getDefaultEventTime = (hours: number, minutes: number = 0) => {
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  const [eventData, setEventData] = useState<EventType & { allDay?: boolean }>({
    id: event?.id || Date.now(),
    name: event?.name || "",
    startTime: event?.startTime
      ? format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm")
      : getDefaultEventTime(9), // Default to 9:00 AM
    endTime: event?.endTime
      ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
      : getDefaultEventTime(12), // Default to 12:00 PM
    color: event?.color || "#3498db",
    allDay: event?.allDay ?? false,
  });

  useEffect(() => {
    if (!event) {
      setEventData({
        id: Date.now(),
        name: "",
        startTime: getDefaultEventTime(9), // Default to 9:00 AM
        endTime: getDefaultEventTime(12), // Default to 12:00 PM
        color: "#3498db",
        allDay: false,
      });
    } else {
      setEventData({
        id: event.id,
        name: event.name || "",
        startTime: event.startTime
          ? format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(9), // Default to 9:00 AM
        endTime: event.endTime
          ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(12), // Default to 12:00 PM
        color: event.color || "#3498db",
        allDay: event.allDay || false,
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      setEventData({ ...eventData, [name]: value }); // Keep it in the correct format
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, allDay: e.target.checked });
  };

  const handleSave = () => {
    if (!eventData.name.trim()) {
      alert("Event name is required");
      return;
    }
    if (!eventData.allDay) {
      if (!eventData.startTime || !eventData.endTime) {
        alert("Start time and End Time are required");
        return;
      }
      if (new Date(eventData.startTime) > new Date(eventData.endTime)) {
        alert("Start time must be before end time");
        return;
      }
    }
    onSave(eventData);
  };

  const handleDelete = () => {
    onDelete(eventData.id);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <h3>{event ? "Edit Event" : "Create Event"}</h3>
      <label htmlFor="eventName">
        Event Name<span>*</span>
      </label>
      <input
        type="text"
        name="name"
        value={eventData.name}
        onChange={handleChange}
        required
      />

      <label>All Day:</label>
      <input
        type="checkbox"
        name="allDay"
        checked={eventData.allDay}
        onChange={handleAllDayChange}
      />

      <label>Start Time</label>
      <input
        type="datetime-local"
        name="startTime"
        value={eventData.startTime}
        onChange={handleChange}
        disabled={eventData.allDay}
        required={!eventData.allDay}
      />

      <label>End Time</label>
      <input
        type="datetime-local"
        name="endTime"
        value={eventData.endTime}
        onChange={handleChange}
        disabled={eventData.allDay}
        required={!eventData.allDay}
      />

      <label>Color:</label>
      <select name="color" value={eventData.color} onChange={handleChange}>
        <option value="hsl(0, 75%, 60%)">Red</option>
        <option value="hsl(200, 80%, 50%)">Blue</option>
        <option value="hsl(150, 80%, 30%)">Green</option>
      </select>

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
      {event && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default EventModal;
