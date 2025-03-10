import React from "react";
import {format} from "date-fns";
import {EventType} from "../types/eventTypes.jsx";

interface EventProps {
    event:EventType;
}

const Event:React.FC<EventProps> = ({event}) =>{
    return(
    <div>
       <p>{event.name}</p> 
       <p>{format(new Date(event.startTime), "HH-mm")} - {format(new Date(event.endTime), "HH-mm")}</p>
    </div>
    )
}

export default Event;