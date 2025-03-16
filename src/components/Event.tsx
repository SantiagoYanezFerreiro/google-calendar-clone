import React from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes.jsx";
import "../styles.css";

interface EventProps {
  event: EventType;
  onClick: (event: EventType) => void;
}

const Event: React.FC<EventProps> = ({ event, onClick }) => {
  const eventClass =
    event.color === "red"
      ? "event red"
      : event.color === "blue"
      ? "event blue"
      : "event green";

  return (
    <div
      className={eventClass}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(event);
        }
      }}
    >
      <p className="event-name-time">
        <span className="event-name">{event.name}</span>
        <span className="event-time">
          {format(new Date(event.startTime), "HH:mm")} -{" "}
          {format(new Date(event.endTime), "HH:mm")}
        </span>
      </p>
    </div>
  );
};

export default Event;
