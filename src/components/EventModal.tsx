import React, { useState } from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes";
import "../styles.css";

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
  const [eventData, setEventData] = useState<EventType>({
    id: event?.id || Date.now(),
    name: event?.name || "",
    startTime: event?.startTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: event?.endTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    color: event?.color || "#3498db",
    allDay: event?.allDay || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
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
      if (new Date(eventData.startTime) < new Date(eventData.endTime)) {
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
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
      {event && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default EventModal;
