import React, { useState } from "react";
import {format} from "date-fns";
import {EventType} from "../types/eventTypes";
import {Event} from "../" 

interface EventModalProps {
  event: EventType | null;
  onClose: () => void;
  onSave: (event:EventType) =>void;
  onDelete: (id:number) =>void;
}

const EventModal:React.FC<EventModalProps> =({event,onClose,onDelete,onSave}) => {
  const [eventData,setEventData] = useState<EventType>({
  id: event?.id || Date.now(),
  name:event?.name || "",
  startTime: event?.startTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  endTime: event?.endTime || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  color: event?.color || "#3498db",
})

const handleChange= (e:React.ChangeEvent<HTMLInputElement>) =>{
  setEventData({...eventData, [e.target.name]:e.target.value})
}

const handleSave= () => {
  onSave(eventData);
}

const handleDelete = () =>{
  onDelete(eventData.id);
}

};

export default EventModal;