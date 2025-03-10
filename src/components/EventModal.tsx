import React, { useState } from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes";
import "../styles.css";

interface EventModalProps {
  event: EventType | null;
  onClose: () => void;
  onSave: (event: EventType) => void;
  onDelete: (id: number) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onDelete,
  onSave,
}) => {
  const [eventData, setEventData] = useState<EventType>({
    id: event?.id || Date.now(),
    name: event?.name || "",
    startTime: event?.startTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: event?.endTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    color: event?.color || "#3498db",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(eventData);
  };

  const handleDelete = () => {
    onDelete(eventData.id);
  };

  return (
    <div className="modal">
      <h3>{event ? "Edit Event" : "Create Event"}</h3>
      <label>Event Name:</label>
      <input
        type="text"
        name="name"
        value={eventData.name}
        onChange={handleChange}
      />

      <label>Start Time</label>
      <input
        type="datetime-local"
        name="startTime"
        value={eventData.startTime}
        onChange={handleChange}
      />

      <label>End Time</label>
      <input
        type="datetime-local"
        name="endTime"
        value={eventData.endTime}
        onChange={handleChange}
      />

      <label>Color</label>
      <input
        type="color"
        name="color"
        value={eventData.color}
        onChange={handleChange}
      />

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
      {event && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default EventModal;
