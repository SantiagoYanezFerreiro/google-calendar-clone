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
      : getDefaultEventTime(9),
    endTime: event?.endTime
      ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
      : getDefaultEventTime(12),
    color: event?.color || "blue",
    allDay: event?.allDay ?? false,
  });

  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!event) {
      setEventData({
        id: Date.now(),
        name: "",
        startTime: getDefaultEventTime(9),
        endTime: getDefaultEventTime(12),
        color: "hsl(200, 80%, 50%)",
        allDay: false,
      });
    } else {
      setEventData({
        id: event.id,
        name: event.name || "",
        startTime: event.startTime
          ? format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(9),
        endTime: event.endTime
          ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(12),
        color: event.color || "#3498db",
        allDay: event.allDay || false,
      });
    }
  }, [event]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
    let valid = true;
    setError("");

    if (!eventData.name.trim()) {
      setError("Event name is required");
      valid = false;
    }
    if (!eventData.allDay) {
      if (!eventData.startTime || !eventData.endTime) {
        setError((prev) => prev + "Start time and End Time are required");
        valid = false;
      }
      if (new Date(eventData.startTime) > new Date(eventData.endTime)) {
        setError((prev) => prev + "Start time must be before end time");
        valid = false;
      }
    }
    if (!valid) return;

    onSave({
      ...eventData,
      color: eventData.color || "hsl(200, 80%, 50%)", // Default to blue if no color is selected
    });
  };

  const handleDelete = () => {
    onDelete(eventData.id);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`modal ${isClosing ? "modal-closing" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>{event ? "Edit Event" : "Add Event"}</h3>
          <button
            onClick={handleClose}
            className="close-button"
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
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

          <div className="all-day-container">
            <label>
              <input
                type="checkbox"
                name="allDay"
                checked={eventData.allDay}
                onChange={handleAllDayChange}
              />
              All Day:
            </label>
          </div>

          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            disabled={eventData.allDay}
            required={!eventData.allDay}
          />

          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
            disabled={eventData.allDay}
            required={!eventData.allDay}
          />

          <label htmlFor="color">Color:</label>
          <select name="color" value={eventData.color} onChange={handleChange}>
            <option
              value="hsl(0, 75%, 60%)"
              style={{ color: "hsl(0, 75%, 60%)" }}
            >
              Red
            </option>
            <option
              value="hsl(200, 80%, 50%)"
              style={{ color: "hsl(200, 80%, 50%)" }}
            >
              Blue
            </option>
            <option
              value="hsl(150, 80%, 30%)"
              style={{ color: "hsl(150, 80%, 30%)" }}
            >
              Green
            </option>
          </select>

          {error && <p className="error">{error}</p>}

          <div className="modal-footer">
            <button onClick={handleSave} className="save">
              {event ? "Save" : "Add"}
            </button>
            {event && (
              <button onClick={handleDelete} className="delete">
                Delete
              </button>
            )}
            <button onClick={handleClose} className="close-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
