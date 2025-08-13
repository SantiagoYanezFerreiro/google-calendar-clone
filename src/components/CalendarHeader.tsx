import { memo } from "react";
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
        <button className="calendar-header-today" onClick={onTodayClick}>
          Today
        </button>
        <div className="calendar-controls">
          <button
            onClick={onPreviousMonth}
            aria-label="Previous Month"
            className="calendar-control-button"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={onNextMonth}
            aria-label="Next Month"
            className="calendar-control-button"
          >
            <FaChevronRight />
          </button>
        </div>
        <h2 className="calendar-header-month">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
      </div>
    );
  }
);
