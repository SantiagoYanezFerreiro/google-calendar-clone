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
              onClick={() => onEventClick(event)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === "") {
                  onEventClick(event);
                }
              }}
              aria-label={`Edit Event ${event.name}`}
            >
              <p className="event-name-time">
                <span className="event-name">{event.name}:</span>
                {"  "}
                <span className="event-time">
                  {format(new Date(event.startTime), "HH:mm")} -{" "}
                  {format(new Date(event.endTime), "HH:mm")}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverflowModal;
