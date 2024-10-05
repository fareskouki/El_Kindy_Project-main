import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal"; // Assurez-vous d'avoir un composant Modal
import NavBar from "components/NavBar";
import SideBarStudent from "components/SideBarStudent";
import TopBarTeacherStudent from "components/TopBarTeacherStudent";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Footer from "components/Footer";
import { useSelector } from "react-redux"; // Importez useSelector depuis React Redux
import { jwtDecode } from "jwt-decode";
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);
const MyCalendar = () => {
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [courses, setCourses] = useState({ data: [] });
  const [teachers, setTeachers] = useState([]); // Ajout d'un état pour les enseignants
  const [students, setStudents] = useState([]); // Ajout d'un état pour les étudiants
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [teachersData, setTeachersData] = useState([]); // Renommer l'état pour éviter la redondance
  const [studentsData, setStudentsData] = useState([]); // Renommer l'état pour éviter la redondance

  const axiosPrivate = useAxiosPrivate();

  const accessToken = useSelector((state) => state.accessToken); // Récupérez le jeton d'accès du store Redux
  const decodeToken = accessToken ? jwtDecode(accessToken) : "";
  const handleEventClick = async (event) => {
    console.log("handleEventClick called with event:", event);
    try {
      const response = await axios.get(`http://localhost:3001/planning/${event.id}/details`);
      const courseDetails = response.data;

        console.log("aaaa",event)

      const updatedEvent = { ...event}; // Add teacherId to the event object
      setSelectedEvent(updatedEvent);
      setShowModal(true); // Add this line
      console.log("showModal set to true");
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du cours", error);
    }
  };
  
  
  // Utilisez le jeton d'accès dans vos requêtes HTTP
  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/planning/student/${decodeToken.id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        setEvents(response.data.map((planning) => ({
          id: planning._id,
          courseId: planning.courseId,

          title: planning.title,
          start: new Date(planning.start),
          end: new Date(planning.end),
          resourceId: planning.resourceId,
          color: planning.color,
          teacherId: planning.teacherId,
          studentId: planning.studentId,
        })));
      } catch (error) {
        console.error('Erreur lors de la récupération des plannings', error);
        // Affichez un message d'erreur à l'utilisateur ou effectuez d'autres actions en cas d'erreur
      }
    };
  
    fetchPlannings();
  }, [accessToken, decodeToken.id]);
  



  useEffect(() => {
    axios
      .get("http://localhost:3001/salle")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooms", error);
      });
      axios
      .get("http://localhost:3001/course/all")
      .then((response) => {
        setCourses(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
  
  axios.get("http://localhost:3001/auth/teachers")
    .then((response) => {
      setTeachers(response.data);
      console.log(response.data); // Vérifiez les données de l'enseignant récupérées
    })
    .catch((error) => {
      console.error("There was an error fetching the teachers", error);
    });


    axios
      .get("http://localhost:3001/auth/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the students", error);
      });
  }, []); // Supprimer la redondance ici
  

  useEffect(() => {
    axios
      .get("http://localhost:3001/salle")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooms", error);
      });

      axios
      .get("http://localhost:3001/course/all")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
  }, []);

  const handleSelectSlot = ({ start, end, resourceId }) => {
    setSelectedEvent({ start, end, resourceId });
    setShowModal(true);
  };

  const addNewEvent = (event) => {
    setShowModal(false);
    const roomId = event.roomId;
    const roomExists = rooms.some((room) => room._id === roomId);
    const course = courses.data.find((s) => s._id === event.courseId);

    if (!roomExists) {
      console.error("L'ID de la salle spécifiée n'existe pas.");
      return;
    }

   
  };

  const formats = {
    timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH[h]mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      const startTime = localizer.format(start, "HH[h]mm", culture);
      const endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      const startTime = localizer.format(start, "HH[h]mm", culture);
      const endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
  };

  const MyEvent = ({ event }) => {
    const teacher = teachers.find((t) => t._id === event.teacherId);
    const student = students.find((s) => s._id === event.studentId);
    const course = courses.data.find((s) => s._id === event.courseId);

    const courseName = course ? `${course.title}` : "";

    return (
      <div>
        <strong>{courseName}</strong>
        {/*<div>Teacher: {teacherName}</div>*/}
      </div>
    );
  };

  return (
    <div>
      <main>
      <NavBar />

        <TopBarTeacherStudent />
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarStudent />
              <div className="col-xl-9">
                <div className="card border bg-transparent rounded-3">
                  <div className="card-body">
                    <div className="d-sm-flex">
                      <div>
                        <div className="mb-3 d-sm-flex justify-content-sm-between">
                          <div>
                            <Calendar
                              components={{
                                event: MyEvent,
                              }}
                              onSelectEvent={handleEventClick}
                              selectable={true}

                              key={events.length}
                              localizer={localizer}
                              events={events}
                              onSelectSlot={handleSelectSlot}
                              resourceIdAccessor="resourceId"
                              resourceTitleAccessor="resourceTitle"
                              defaultView="day"
                              min={new Date(0, 0, 0, 9, 0)}
                              max={new Date(0, 0, 0, 21, 0)}
                              step={30}
                              timeslots={1}
                              views={{ month: false, week: false, day: true }}
                              resources={rooms.map((room) => ({
                                resourceId: room._id,
                                resourceTitle: room.name,
                              }))}
                              startAccessor="start"
                              endAccessor="end"
                              dayLayoutAlgorithm={'overlap'} // Ajustez la taille des cases en fonction des événements qui se chevauchent
                              style={{ height: '700px', width: "101%"  }} // Augmentez la hauteur du calendrier pour afficher plus de cases
                                                        formats={formats}
                              eventPropGetter={(event) => ({
                                style: { backgroundColor: event.color },
                              })}
                            />
                           {console.log("Selected Event:", selectedEvent)}
                           {showModal && (
                            <EventDetailsModal
                              onClose={() => setShowModal(false)}
                              event={selectedEvent}
                              roomId={selectedEvent.resourceId}
                              courseId={selectedEvent.courseId}
                              teachers={teachers}
                              teacherId={selectedEvent.teacherId}

                              rooms={rooms}
                              courses={courses} // Pass courseName as prop
                            />
                          )}


                          </div>
                        </div>
                        <div className="text-end"></div>
                      </div>
                    </div>
                    <hr />
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />

      </main>
    </div>
  );
};

export default MyCalendar;