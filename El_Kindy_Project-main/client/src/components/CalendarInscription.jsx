import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";

const localizer = momentLocalizer(moment);

const CalendarInscription = () => {


const calendarStyle = {
  height: 600, // Hauteur fixe en pixels, ajustez selon les besoins
  overflow: 'hidden', // Empêche le défilement interne du calendrier
};

// Pour un conteneur avec défilement, si nécessaire
const containerStyle = {
  height: '100vh', // Hauteur du conteneur, ajustez selon les besoins
  overflow: 'auto', // Permet le défilement à l'intérieur du conteneur
};

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [courses, setCourses] = useState([]); // Ajoutez un état pour stocker les cours

const daysAsResources = [
  { resourceId: 1, resourceTitle: 'Lundi' },
  { resourceId: 2, resourceTitle: 'Mardi' },
  { resourceId: 3, resourceTitle: 'Mercredi' },
  { resourceId: 4, resourceTitle: 'Jeudi' },
  { resourceId: 5, resourceTitle: 'Vendredi' },
  { resourceId: 6, resourceTitle: 'Samedi' },
  { resourceId: 7, resourceTitle: 'Dimanche' },
  // Ajoutez plus si vous voulez inclure le weekend
];

    

  const handleSelectSlot = ({ start, end, resourceId }) => {
    setSelectedEvent({ start, end, resourceId });
    setShowModal(true);
  };

 
  

  return (
    <>
      
            <Calendar
              key={events.length}
              localizer={localizer}
              events={events}
              onSelectSlot={handleSelectSlot}
              selectable={true}
              defaultView="day"
              min={new Date(0, 0, 0, 9, 0)}
              max={new Date(0, 0, 0, 21, 30)} // Fin à 21:00 PM
              step={30} // Définit des tranches horaires de 30 minutes
              timeslots={1}
              views={{ month: false, week: false, day: true }}
              resources={daysAsResources}
              resourceIdAccessor="resourceId"
              resourceTitleAccessor="resourceTitle"
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={(event) => {
                return { style: { backgroundColor: event.color } };
              }}
              components={{
                toolbar: () => null // Cela supprime la barre d'outils entièrement
              }}
              style={{ width: "78vh" }}
            />

    </>
  );
};

export default CalendarInscription