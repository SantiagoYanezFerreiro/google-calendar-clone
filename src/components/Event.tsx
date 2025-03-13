import React from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes.jsx";
import "../styles.css";

interface EventProps {
  event: EventType;
  onClick: (event: EventType) => void;
}

const Event: React.FC<EventProps> = ({ event, onClick }) => {
  return (
    <div
      className="event"
      style={{ backgroundColor: event.color }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <p className="event-name">{event.name}</p>
      <p className="event-time">
        {format(new Date(event.startTime), "HH:mm")} -{" "}
        {format(new Date(event.endTime), "HH:mm")}
      </p>
    </div>
  );
};

export default Event;
