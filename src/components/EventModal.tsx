import React, { useState, useEffect, useRef, useCallback } from "react";
import { EventType } from "../types/eventTypes";
import "../styles.css";
import { format } from "date-fns";

interface EventModalProps {
  event: (EventType & { allDay?: boolean }) | null;
  onClose: () => void;
  onSave: (event: EventType) => Promise<void>;
  onDelete: (id: number) => void;
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onSave,
  onDelete,
  selectedDate,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");

  const getDefaultEventTime = useCallback(
    (hours: number, minutes: number = 0, date?: Date) => {
      const targetDate = date || selectedDate || new Date();
      const eventDate = new Date(targetDate);
      eventDate.setHours(hours, minutes, 0, 0);
      return format(eventDate, "yyyy-MM-dd'T'HH:mm");
    },
    [selectedDate]
  );

  const [eventData, setEventData] = useState<EventType & { allDay?: boolean }>({
    id: event?.id || Date.now(),
    name: event?.name || "",
    startTime: event?.startTime
      ? format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm")
      : getDefaultEventTime(9, 0, selectedDate),
    endTime: event?.endTime
      ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
      : getDefaultEventTime(10, 0, selectedDate),
    color: event?.color || "hsl(200, 80%, 50%)",
    allDay: event?.allDay ?? false,
  });

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timeout = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timeout);
  }, [onClose]);

  useEffect(() => {
    if (!event) {
      setEventData({
        id: Date.now(),
        name: "",
        startTime: getDefaultEventTime(9, 0, selectedDate),
        endTime: getDefaultEventTime(10, 0, selectedDate),
        color: "hsl(200, 80%, 50%)",
        allDay: false,
      });
    } else {
      setEventData({
        id: event.id,
        name: event.name || "",
        startTime: event.startTime
          ? format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(9, 0, selectedDate),
        endTime: event.endTime
          ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm")
          : getDefaultEventTime(10, 0, selectedDate),
        color: event.color || "hsl(200, 80%, 50%)",
        allDay: event.allDay || false,
      });
    }
  }, [event, selectedDate, getDefaultEventTime]);

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
  }, [handleClose]);

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
          <h3 className="modal-date-header">
            {event ? "Edit Event" : "Add Event"}
            {}
          </h3>
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
          <div className="form-field">
            <label htmlFor="eventName">
              Event Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="eventName"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
            {event && (
              <span className="event-time-display">
                {eventData.allDay
                  ? format(new Date(event.startTime), "MMM d, yyyy")
                  : `${formatDisplayTime(
                      event.startTime
                    )} - ${formatDisplayTime(event.endTime)}`}
              </span>
            )}

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
          </div>

          <div className="time-fields">
            <div className="form-field">
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
            </div>

            <div className="form-field">
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
            </div>
          </div>

          <div className="form-field">
            <label>Color:</label>
            <div className="color-picker">
              <div className="color-options">
                <div
                  className={`color-option ${
                    eventData.color === "hsl(0, 75%, 60%)" ? "selected" : ""
                  }`}
                  style={{ backgroundColor: "hsl(0, 75%, 60%)" }}
                  onClick={() =>
                    setEventData((prev) => ({
                      ...prev,
                      color: "hsl(0, 75%, 60%)",
                    }))
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Red color"
                />
                <div
                  className={`color-option ${
                    eventData.color === "hsl(200, 80%, 50%)" ? "selected" : ""
                  }`}
                  style={{ backgroundColor: "hsl(200, 80%, 50%)" }}
                  onClick={() =>
                    setEventData((prev) => ({
                      ...prev,
                      color: "hsl(200, 80%, 50%)",
                    }))
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Blue color"
                />
                <div
                  className={`color-option ${
                    eventData.color === "hsl(150, 80%, 30%)" ? "selected" : ""
                  }`}
                  style={{ backgroundColor: "hsl(150, 80%, 30%)" }}
                  onClick={() =>
                    setEventData((prev) => ({
                      ...prev,
                      color: "hsl(150, 80%, 30%)",
                    }))
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Green color"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="modal-footer">
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-delete"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : event ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventModal;
