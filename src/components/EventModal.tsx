import React, { useState, useEffect, useRef } from "react";
import { EventType } from "../types/eventTypes";
import "../styles.css";
import { format } from "date-fns";

interface EventModalProps {
  event: (EventType & { allDay?: boolean }) | null;
  onClose: () => void;
  onSave: (event: EventType) => Promise<void>;
  onDelete: (id: number) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onSave,
  onDelete,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");

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
      : getDefaultEventTime(10),
    color: event?.color || "hsl(200, 80%, 50%)",
    allDay: event?.allDay ?? false,
  });

  useEffect(() => {
    if (!event) {
      setEventData({
        id: Date.now(),
        name: "",
        startTime: getDefaultEventTime(9),
        endTime: getDefaultEventTime(10),
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
          : getDefaultEventTime(10),
        color: event.color || "hsl(200, 80%, 50%)",
        allDay: event.allDay || false,
      });
    }
  }, [event]);

  useEffect(() => {
    const firstInput = modalRef.current?.querySelector('input[name="name"]');
    if (firstInput instanceof HTMLElement) {
      firstInput.focus();
    }

    const previousFocus = document.activeElement;
    return () => {
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements =
          modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) ?? [];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, []);

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAllDay = e.target.checked;
    const date = new Date(eventData.startTime);

    setEventData((prev) => ({
      ...prev,
      allDay: isAllDay,
      startTime: isAllDay
        ? format(date, "yyyy-MM-dd") + "T00:00"
        : format(date, "yyyy-MM-dd'T'HH:mm"),
      endTime: isAllDay
        ? format(date, "yyyy-MM-dd") + "T23:59"
        : format(new Date(prev.endTime), "yyyy-MM-dd'T'HH:mm"),
      displayTime: isAllDay ? format(date, "MMM d, yyyy") : undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let valid = true;
      const errors: string[] = [];

      if (!eventData.name.trim()) {
        errors.push("Event name is required");
        valid = false;
      }

      if (!eventData.allDay) {
        if (!eventData.startTime || !eventData.endTime) {
          errors.push("Start time and End Time are required");
          valid = false;
        }
        if (new Date(eventData.startTime) > new Date(eventData.endTime)) {
          errors.push("Start time must be before end time");
          valid = false;
        }
      }

      setError(errors.join(". "));
      if (!valid) {
        setIsLoading(false);
        return;
      }

      await onSave({
        ...eventData,
        color: eventData.color || "hsl(200, 80%, 50%)",
      });
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save event";
      setError(errorMessage);
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    onDelete(eventData.id);
    onClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    const timeout = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timeout);
  };

  const formatDisplayTime = (time: string) => {
    try {
      return format(new Date(time), "h:mm a").toUpperCase();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Invalid date:", time, errorMessage);
      return "Invalid time";
    }
  };

  return (
    <div
      ref={modalRef}
      className={`modal ${isClosing ? "modal-closing" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <form
        className="modal-content"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="modal-header">
          <h3>{event ? "Edit Event" : "Add Event"}</h3>
          <button
            type="button"
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
          {event && (
            <span className="event-time">
              {eventData.allDay
                ? format(new Date(event.startTime), "MMM d, yyyy")
                : `${formatDisplayTime(event.startTime)} - ${formatDisplayTime(
                    event.endTime
                  )}`}
            </span>
          )}
          <input
            type="text"
            id="eventName"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
          />

          <div className="all-day-container">
            <label>
              <input
                type="checkbox"
                checked={eventData.allDay}
                onChange={handleAllDayChange}
              />
              All Day
            </label>
          </div>

          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            disabled={eventData.allDay}
            required={!eventData.allDay}
          />

          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
            disabled={eventData.allDay}
            required={!eventData.allDay}
          />

          <label htmlFor="color">Color:</label>
          <select
            id="color"
            name="color"
            value={eventData.color}
            onChange={handleChange}
          >
            <option value="hsl(0, 75%, 60%)">Red</option>
            <option value="hsl(200, 80%, 50%)">Blue</option>
            <option value="hsl(150, 80%, 30%)">Green</option>
          </select>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-footer">
            <button type="submit" className="save" disabled={isLoading}>
              {isLoading ? "Saving..." : event ? "Save" : "Add"}
            </button>
            {event && (
              <button type="button" onClick={handleDelete} className="delete">
                Delete
              </button>
            )}
            <button type="button" onClick={handleClose} className="close">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventModal;
