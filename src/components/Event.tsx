import React from "react";
import { format } from "date-fns";
import { EventType } from "../types/eventTypes";
import "../styles.css";

interface EventProps {
  event: EventType;
  onClick: (event: EventType) => void;
}

const Event: React.FC<EventProps> = ({ event, onClick }) => {
  return (
    <div
      className={`event ${event.allDay ? "all-day-event" : "timed-event"}`}
      style={{ backgroundColor: event.color }}
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
      aria-label={`${event.name} ${
        event.allDay
          ? "All Day"
          : `${format(new Date(event.startTime), "h:mm a")} - ${format(
              new Date(event.endTime),
              "h:mm a"
            )}`
      }`}
    >
      <p className="event-name-time">
        <span className="event-name">{event.name}</span>
        <span className="event-time">
          {event.allDay
            ? "All Day"
            : format(new Date(event.startTime), "h:mm a").toUpperCase()}
        </span>
      </p>
    </div>
  );
};

export default Event;
