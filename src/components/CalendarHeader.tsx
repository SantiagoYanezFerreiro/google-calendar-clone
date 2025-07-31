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
  }: CalendarHeaderProps) => {}
);
