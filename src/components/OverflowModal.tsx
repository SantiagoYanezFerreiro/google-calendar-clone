import React, { useState } from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes";
import "../styles.css";

interface OverflowModalProps {
  selectedDay: Date;
  events: EventType[];
  closeModal: () => void;
}

const OverflowModal: React.FC<OverflowModalProps> = ({
  selectedDay,
  events,
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
    <div className={`modal ${isClosing ? "closing" : ""}`}>
      <h3>Events on {selectedDay.toDateString()}</h3>
      {eventsForDay.map((event, index) => (
        <div key={index} onClick={() => console.log("Editing Event:", event)}>
          <p>
            {event.name} - {format(new Date(event.startTime), "HH:MM")}
          </p>
        </div>
      ))}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default OverflowModal;
