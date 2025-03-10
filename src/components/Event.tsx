import React from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes.jsx";
import "../styles.css";

interface EventProps {
  event: EventType;
}

const Event: React.FC<EventProps> = ({ event }) => {
  return (
    <div className="event">
      <p className="event-name">{event.name}</p>
      <p className="event-time">
        {format(new Date(event.startTime), "HH-mm")} -{" "}
        {format(new Date(event.endTime), "HH-mm")}
      </p>
    </div>
  );
};

export default Event;
