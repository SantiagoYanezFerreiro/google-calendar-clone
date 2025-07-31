import React, { memo } from "react";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CalendarHeaderProps {
  currentMonth: Date;
  onTodayClick: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = memo(
  ({
    currentMonth,
    onTodayClick,
    onPreviousMonth,
    onNextMonth,
  }: CalendarHeaderProps) => {
    return (
      <div className="calendar-header">
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="calendar-controls">
          <button onClick={onTodayClick}>Today</button>
          <button onClick={onPreviousMonth} aria-label="Previous Month">
            <FaChevronLeft />
          </button>
          <button onClick={onNextMonth} aria-label="Next Month">
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  }
);
