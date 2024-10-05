import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal"; // Assurez-vous d'avoir un composant Modal
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";


const localizer = momentLocalizer(moment);

const MyCalendar = () => {

  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [courses, setCourses] = useState({ data: [] });
  const [classes, setClasses] = useState({ data: [] });
  const [availableTeachers, setAvailableTeachers] = useState([]); // Define availableTeachers state variable

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [teacherId, setTeacherId] = useState(null); // Ajoutez un état pour stocker l'ID de l'enseignant sélectionné
  const navigate = useNavigate();
  useEffect(() => {
    const timeSlots = generateTimeSlots(new Date());
    setEvents(timeSlots);
  }, []);

  // Définissez une fonction pour mettre à jour l'ID de l'enseignant sélectionné

  const [teachers, setTeachers] = useState([]); // Ajout d'un état pour les enseignants
  const [students, setStudents] = useState([]); // Ajout d'un état pour les étudiants
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [teachersData, setTeachersData] = useState([]); // Renommer l'état pour éviter la redondance
  const [studentsData, setStudentsData] = useState([]); // Renommer l'état pour éviter la redondance
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [editEventDetails, setEditEventDetails] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const timeSlots = generateTimeSlots(new Date()); // Utilisez la date actuelle ou une autre date si nécessaire
    setEvents(timeSlots); // Remplacer les créneaux horaires existants par les nouveaux créneaux horaires générés
  }, []);
  
  useEffect(() => {
    const fetchEventData = async () => {
      setOpen(true);

      try {
        const response = await axios.get(
          `http://localhost:3001/planning/${selectedEventId}`
        );
        setEventDetails(response.data);
        setShowModal(true);
        setOpen(false);

      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    if (selectedEventId) {
      fetchEventData();
    }
  }, [selectedEventId]);
  const handleSelectEvent = (event) => {
    setSelectedEventId(event.id); // Utilisez event.id au lieu de event._id
    setSelectedEvent(event);
    handleEditEvent(event); // Appel de handleEditEvent pour l'événement sélectionné
  };

  const handleEditEvent = (event) => {
    setSelectedEventId(event._id);
    setEditEventDetails(event);
    setShowModal(true);
  };
  const filterAvailableTeachers = (start, end) => {
    const selectedDay = moment(start).format("dddd"); // Obtenez le jour de la semaine au format "Monday", "Tuesday", etc.
    const selectedStartTime = moment(start).format("HH:mm"); // Obtenez l'heure de début au format "HH:mm"
    const selectedEndTime = moment(end).format("HH:mm"); // Obtenez l'heure de fin au format "HH:mm"
  
    // Filtrer les enseignants en fonction de leur disponibilité pour le jour sélectionné et l'intervalle de temps
    const availableTeachers = teachers.filter((teacher) => {
      return teacher.disponibilite.some((slot) => {
        return slot.day === selectedDay && slot.startTime <= selectedStartTime && slot.endTime >= selectedEndTime;
      });
    });
  
    return availableTeachers;
  };
  
  const updateEvent = async (event) => {
    try {
      // Envoyer la requête de mise à jour à l'API
      const response = await axios.put(
        `http://localhost:3001/planning/${selectedEventId}`,
        event
      );

      // Extraire les données mises à jour de la réponse de l'API
      const updatedEventData = response.data;

      // Convertir les valeurs de start et end en objets Date JavaScript si nécessaire
      updatedEventData.start = new Date(updatedEventData.start);
      updatedEventData.end = new Date(updatedEventData.end);

      // Mettre à jour l'état des événements avec les données mises à jour
      setEvents(
        events.map((evt) =>
          evt._id === updatedEventData._id ? updatedEventData : evt
        )
      );

      console.log("Event updated successfully:", updatedEventData);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };
   // Définissez vos styles CSS directement ici
   const calendarStyles = {
    width: "800px", // Définissez la largeur des cases selon vos préférences
  };

  const timeSlotStyles = {
    width: "50px", // Définissez la largeur des cases individuelles
  };
  const generateTimeSlots = (selectedDate) => {
    const slots = [];
    const currentDate = moment(selectedDate);
  
    // Définir l'heure de début et de fin de la journée en fonction de la date sélectionnée
    const startOfDay = moment(selectedDate).startOf('day');
    const endOfDay = moment(selectedDate).endOf('day');
  
    let currentHour = moment(startOfDay);
  
    // Générer les créneaux horaires pour chaque heure de la journée
    while (currentHour.isBefore(endOfDay)) {
      const startHour = moment(currentHour);
      const endHour = moment(currentHour).add(1, "hour");
  
      slots.push({
        title: `${startHour.format("HH[h]")} - ${endHour.format("HH[h]mm")}`,
        start: startHour.toDate(),
        end: endHour.toDate(),
      });
  
      currentHour.add(1, 'hour');
    }
  
    return slots;
  };
  
  
  
  
  
  
  
  
  
  
  

  const MyEvent = ({ event }) => {
    // Vérifier d'abord si les noms des enseignants et des étudiants sont disponibles
    const teacher = teachers.find((t) => t._id === event.teacherId);
    const student = students.find((s) => s._id === event.studentId);
    const course = courses.data.find((s) => s._id === event.courseId);

    const classe = Array.isArray(classes)
      ? classes.find((s) => s._id === event.classId)
      : null;

    // Si les noms des enseignants et des étudiants ne sont pas disponibles, affichez "Loading..."
    const courseName = course ? `${course.title}` : "";

    const className = classe ? `${classe.className}` : "";

    // Les noms des enseignants et des étudiants sont disponibles, construisez le composant avec les noms
    //  const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "";
    //  const studentName = student ? `${student.firstName} ${student.lastName}` : "";
    // const displayStudent = event.studentId && studentName ? `Student: ${studentName}` : "";

    // Afficher "Teacher :" si l'enseignant est sélectionné, sinon afficher "Student :"
    //  const displayLabel = event.teacherId ? "Teacher :" : "Student :";

    // Afficher "Classe :" uniquement lorsque l'étudiant est sélectionné et que la classe est disponible
    // const displayClass = event.classId && className ? `Classe: ${className}` : "";

    return (
      <div>
        <strong>{courseName}</strong>
        {/* Commentaire: */}
        {/* <div>{displayLabel} {event.teacherId ? teacherName : studentName}</div>
  
          {displayClass && <div>{displayClass}</div>}
          {displayStudent && <div>{displayStudent}</div>} */}
      </div>
    );
  };

  // Effect hook pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      setOpen(true);

      try {
        const [teachersResponse, studentsResponse] = await Promise.all([
          axios.get("http://localhost:3001/auth/teachers"),
          axios.get("http://localhost:3001/auth/students"),
        ]);

        setTeachersData(teachersResponse.data);
        setStudentsData(studentsResponse.data);

        const eventsResponse = await axios.get(
          "http://localhost:3001/planning/all"
        );
        const loadedEvents = eventsResponse.data.map((event) => {
          const teacher = teachersResponse.data.find(
            (t) => t._id === event.teacherId
          );
          const student = studentsResponse.data.find(
            (s) => s._id === event.studentId
          );
          return {
            ...event,

            title: `${event.title}`,
            start: new Date(event.start),
            end: new Date(event.end),
          };
        });
        setOpen(false);

        setEvents(loadedEvents);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoadingTeachers(false);
        setLoadingStudents(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/auth/teachers"),
      axios.get("http://localhost:3001/auth/students"),
    ])
      .then(([teachersResponse, studentsResponse]) => {
        setTeachers(teachersResponse.data);
        setStudents(studentsResponse.data);
        setLoadingTeachers(false);
        setLoadingStudents(false);
      })
      .catch((error) => {
        console.error("Error fetching teachers and students", error);
      });
    axiosPrivate
      .get("http://localhost:3001/classes/getAll") // Récupérez la liste des cours
      .then((response) => {
        setClasses(response.data); // Stockez les cours dans l'état
        console.log("claaassssss", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
    axios
      .get("http://localhost:3001/salle")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooms", error);
      });
    axiosPrivate
      .get("http://localhost:3001/course/all") // Récupérez la liste des cours
      .then((response) => {
        setCourses(response.data); // Stockez les cours dans l'état
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
    // Appel de l'API pour obtenir les informations de l'enseignant
    axios
      .get(`http://localhost:3001/auth/getAllUserByRole/teacher`)
      .then((response) => {
        // Une fois la réponse reçue, extrayez les classes enseignées par l'enseignant
        const teacher = response.data;
        const classesTaught = teacher.teacherInfo.classesTeaching;
        // Stockez les classes dans l'état ou faites tout autre traitement nécessaire
        setClasses(classesTaught);
        console.log("Classes enseignées par l'enseignant:", classesTaught);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des informations de l'enseignant",
          error
        );
      });
      axios
      .get(`http://localhost:3001/auth/getAllUserByRole/teacher`)
      .then((response) => {
        // Une fois la réponse reçue, extrayez les classes enseignées par l'enseignant
        const teacher = response.data;
        const studentsTaught = teacher.teacherInfo.studentsTaught;
        // Stockez les classes dans l'état ou faites tout autre traitement nécessaire
        setStudents(studentsTaught);
        console.log("Classes enseignées par l'enseignant:", studentsTaught);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des informations de l'enseignant",
          error
        );
      });
    axios
      .get("http://localhost:3001/planning/all")
      .then((response) => {
        const loadedEvents = response.data.map((event) => {
          // Assurez-vous que chaque événement a un ID unique.
          const color = event.color; // Utilisez l'ID de l'événement pour récupérer sa couleur
          const selectedCourse = courses.data.find(
            (course) => course._id === event.courseId
          );
          return {
            ...event,
            title: `${event.title} `,

            start: new Date(event.start),
            end: new Date(event.end),
            resourceId: event.resourceId,
            color, // Stockez la couleur avec l'événement
            teacherId: event.selectedTeacherId,
            studentId: event.selectedStudentId,
            id: event._id,
            courseId: event.courseId || null,
          };
        });

        const timeSlots = generateTimeSlots(new Date()); // Utiliser la date sélectionnée
        setEvents([...timeSlots, ...loadedEvents]);
             console.log("Événements mis à jour pour le calendrier:", [
          ...timeSlots,
          ...loadedEvents,
        ]);
      })
      .catch((error) => {
        console.error("There was an error fetching the events", error);
      });
  }, []);

  const deleteEvent = async (eventId) => {
    try {
      await axiosPrivate.delete(
        `http://localhost:3001/planning/${selectedEventId}`
      );

      const eventIndex = events.findIndex((evt) => evt._id === selectedEventId);
      if (eventIndex !== -1) {
        const updatedEvents = [...events];
        updatedEvents.splice(eventIndex, 1); // Supprimer l'événement à l'index trouvé
        setEvents(updatedEvents); // Mettre à jour l'état des événements avec la liste mise à jour
        console.log("Event deleted successfully:", selectedEventId);
      } else {
        console.warn("Event not found:", selectedEventId);
      }
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const handleSelectSlot = ({ start, end, resourceId }) => {
    setSelectedEvent({ start, end, resourceId });
    setShowModal(true);

    const filteredTeachers = filterAvailableTeachers(start, end);

    if (filteredTeachers.length === 0) {
      setErrorMessage("No teachers available at this time.");
      setShowModal(false); // Close the modal
      // Display error message in a popup
      toast.error("No teachers available at this time.", {
        autoClose: 3000,
      });
    } else {
      setAvailableTeachers(filteredTeachers);
    }
  };
  
const addNewEvent = (event) => {
  setShowModal(false);
  const roomId = event.roomId;
  const roomExists = rooms.some((room) => room._id === roomId);
  const selectedCourse = courses.data.find(
    (course) => course._id === event.courseId
  );

  // Vérifiez si selectedCourse est défini avant d'accéder à sa propriété title
  const courseTitle = selectedCourse
    ? selectedCourse.title
    : "Titre de cours non trouvé";

  const newEvent = {
    id: events.length + 1, // Assurez-vous de donner un ID unique à chaque événement
    title: `${event.title} `,
    start: event.start, // Utilisez l'heure de début de l'événement fournie
    end: event.end, // Utilisez l'heure de fin de l'événement fournie
    resourceId: roomId,
    color: event.color, // Utiliser la couleur sélectionnée du Modal
    teacherId: event.teacherId || null,
    classId: event.classId || null,
    studentId: event.studentId || null,
    courseId: event.courseId || null,
  };

  console.log("New event added :", newEvent);

  // Fusionner le nouvel événement avec les événements existants
  const updatedEvents = [...events, newEvent];

  console.log("Evénements avant la sauvegarde :", events);

  // Mettre à jour les événements dans le state
  setEvents(updatedEvents);

  const response = axios.post("http://localhost:3001/planning/add", newEvent);
  const addedEvent = response.data;
  toast.success("Class added successfully !!", {
    autoClose: 1500,
    style: {
      color: 'green'
    }
  }); 
  setTimeout(() => {
    navigate('/Planning');
    window.location.reload(); // Rechargez la page après l'ajout réussi
  }, 2000);
  // Mise à jour de l'état avec le nouvel événement
  setEvents((prevEvents) => [...prevEvents, addedEvent]);
  console.log("Nouvel événement ajouté avec succès:", addedEvent);
};

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH[h]mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      let startTime = localizer.format(start, "HH[h]mm", culture);
      let endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      let startTime = localizer.format(start, "HH[h]mm", culture);
      let endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
  };

  const addOrUpdateEvent = async (event) => {
    setShowModal(false);
    const roomId = event.resourceId;
    const courseId = event.courseId; // Assurez-vous que cette ligne est présente et correcte

    if (editEventDetails) {
      await updateEvent(event); // Passer l'ID de l'événement ici
    } else {
      await addNewEvent({ ...event, id: Math.random().toString(), courseId });
    }
    setEditEventDetails(null);
  };
  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <ToastContainer />
          {open ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div className="">
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
          {/* Enveloppez votre contenu principal dans un div ou un autre conteneur pour le style */}
          <div className="page-content-wrapper border">
            {/* Enveloppez votre calendrier dans un div pour le style */}
            <div style={{ height: 900 }}>
              {/* Ajoutez ici votre composant de calendrier */}
              <Calendar
                components={{
                  event: MyEvent,
                }}
                key={events.length}
                localizer={localizer}
                events={events}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onSave={addOrUpdateEvent}
                
                selectable={true}
                resourceIdAccessor="resourceId"
                resourceTitleAccessor="resourceTitle"
                defaultView="day"
                min={new Date(0, 0, 0, 9, 0)}
                max={new Date(0, 0, 0, 21, 0)}
                step={30}
                timeslots={1}
                views={{ month: false, week: true, day: true }}
                resources={rooms.map((room) => ({
                  resourceId: room._id,
                  resourceTitle: room.name,
                  width: 8,
                }))}
                startAccessor="start"
                endAccessor="end"
                dayLayoutAlgorithm={"overlap"}
                style={{ height: "700px", width: "1000px", fontSize: "10px" }} // Ajoutez fontSize ici
                formats={formats}
                eventPropGetter={(event) => {
                  const color = event.color;
                  return {
                    style: {
                      backgroundColor: color,
                    },
                  };
                }}
                toolbar={(toolbar) => {
                  return {
                    ...toolbar,
                    next: null, // Supprime le bouton Next
                    prev: null, // Supprime le bouton Back
                  };
                }}
              />
              {/* Affichez le modal à l'intérieur du conteneur du calendrier */}
              {showModal && (
                <Modal
                  onClose={() => setShowModal(false)}
                  onSave={addOrUpdateEvent}
                  onDelete={deleteEvent}
                  eventDetails={{
                    ...selectedEvent,
                    rooms: rooms,
                    courses: courses,
                    classes: classes,
                    students: students,
                    teachers: availableTeachers,
                    resourceId: selectedEvent.resourceId,
                  }}
                  onSelectEvent={(event) => {
                    handleSelectEvent(event);
                  }}
                  courses={courses}
                  teachers={availableTeachers}
                  students={students}
                  classes={classes}
                />
              )}
            </div>
          </div>
        </div>
          )}
                  </div>

      </main>
    </div>
  );

};

export default MyCalendar;