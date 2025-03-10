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
        <div className="modal">
            <h3>Events on {selectedDay.toDateString()}</h3>
            {eventsForDay.map((event,index) => (
                <div key={index} onClick={()=>console.log("Editing Event:", event)}>
                <p>
                    {event.name} - {format(new Date(event.startTime), "HH:MM")}
                </p>
                </div>
            ))}
            <button onClick={closeModal}>Close</button>
        </div>
    )
}

export default OverflowModal;