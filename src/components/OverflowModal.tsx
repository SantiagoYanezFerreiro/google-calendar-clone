import React, { useState } from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes";
import "../styles.css";

interface OverflowModalProps {
  selectedDay: Date;
  events: EventType[];
  closeModal: () => void;
  onEventClick: (event: EventType) => void;
}

const OverflowModal: React.FC<OverflowModalProps> = ({
  selectedDay,
  events,
  onEventClick,
  closeModal,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const eventsForDay = events.filter(
    (event) =>
      format(new Date(event.startTime), "yyyy-MM-dd") ===
      format(selectedDay, "yyyy-MM-dd")
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  return (
    <div className={`modal  ${isClosing ? "modal-closing" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Events on {format(selectedDay, "MMMM d, yyyy")}</h3>
          <button onClick={handleClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body modal-body-overflow">
          {eventsForDay.map((event, index) => (
            <div
              className="overflow-event"
              key={index}
              style={{ borderLeft: `4px solid ${event.color}` }} // Add color indicator
              onClick={() => onEventClick(event)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onEventClick(event);
                }
              }}
              aria-label={`Edit Event ${event.name}`}
            >
              <p className="event-name-time">
                <span className="event-name">{event.name}:</span>
                {"  "}
                <span className="event-time">
                  {event.allDay
                    ? "All Day"
                    : `${format(
                        new Date(event.startTime),
                        "h:mm a"
                      )} - ${format(new Date(event.endTime), "h:mm a")}`}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverflowModal;
