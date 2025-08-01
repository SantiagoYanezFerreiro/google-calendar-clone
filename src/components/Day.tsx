import React, { memo } from "react";
import { format } from "date-fns";
import Event from "./Event";
import { EventType } from "../types/eventTypes";
import { MdOutlineEventAvailable } from "react-icons/md";

interface DayProps {
  day: Date;
  events: EventType[];
  isCurrentMonth: boolean;
  isPastDate: boolean;
  isSelected: boolean;
  maxVisibleEvents: number;
  onEventClick: (event: EventType) => void;
  onDateSelect: (date: Date) => void;
  onMoreClick: (date: Date, events: EventType[]) => void;
  showDayName: boolean;
}

export const Day = memo(
  ({
    day,
    events,
    isCurrentMonth,
    isPastDate,
    isSelected,
    maxVisibleEvents,
    onEventClick,
    onDateSelect,
    onMoreClick,
    showDayName,
  }: DayProps) => {
    const dayClass = `calendar-day ${!isCurrentMonth ? "outside-month" : ""}
      ${isPastDate ? "past-date" : ""}
    } ${isSelected ? "selected-date" : ""}
     ${
       format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
         ? "today"
         : ""
     }`.trim();

    const visibleEvents = events.slice(0, maxVisibleEvents);
    const dayOverflowEvents = events.slice(maxVisibleEvents);

    return (
      <div className={dayClass} onClick={() => onDateSelect(day)}>
        {showDayName && (
          <div className="day-abbr">{format(day, "EEE").toUpperCase()}</div>
        )}
        <span className="day-number">{format(day, "d")}</span>

        {visibleEvents.length > 0 &&
          visibleEvents.map((event) => (
            <Event key={event.id} event={event} onClick={onEventClick} />
          ))}
        {dayOverflowEvents.length > 0 && (
          <button
            className="overflow-button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick(day, dayOverflowEvents);
            }}
            aria-label={`Show ${dayOverflowEvents.length} more events`}
          >
            +{dayOverflowEvents.length} More
          </button>
        )}

        <div className="add-event-container">
          <button
            className="add-event-button"
            aria-label="Add event"
            onClick={() =>
              onEventClick({
                id: Date.now(),
                name: "",
                startTime: `${format(day, "yyyy-MM-dd")}T09:00`,
                endTime: `${format(day, "yyyy-MM-dd")}T12:00`,
                color: "hsl(200, 80%, 50%)",
              })
            }
          >
            <MdOutlineEventAvailable />
          </button>
        </div>
      </div>
    );
  }
);

export default Day;
