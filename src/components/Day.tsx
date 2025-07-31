import React, { memo } from "react";
import { format } from "date-fns";
import Event from "./Event";
import { EventType } from "../types/eventTypes";

interface DayProps {
  day: Date;
  events: EventType[];
  isCurrentMonth: boolean;
  isPastDate: boolean;
  isSelected: boolean;
  maxVisibleEvents: number;
  onEventClick: (event: EventType) => void;
  onDateSelect: (date: Date) => void;
  onMoreClick: (date: Date, event: EventType) => void;
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
  }: DayProps) => {}
);
