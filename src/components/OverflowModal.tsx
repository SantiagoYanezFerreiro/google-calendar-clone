import React from "react";
import {format} from "date-fns";
import { EventType } from "../types/eventTypes";

interface OverflowModalProps{
    selectedDay: Date,
    events: EventType[],
    closeModal: () => void;
}

const OverflowModal:React.FC<OverflowModalProps> =({selectedDay, events, closeModal}) =>
{
    const eventsForDay = events.filter(
        (event) => format(new Date(event.startTime), "yyyy-MM-dd") ===format(selectedDay, "yyyy-MM-dd")
    )
    return(
        <div></div>
    )
}

export default OverflowModal;