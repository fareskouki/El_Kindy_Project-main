import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'react-calendar/dist/Calendar.css';
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";
function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    setOpen(true);

    try {
      const response = await axios.get('http://localhost:3001/api/birthdays');
      setBirthdays(response.data);
      setOpen(false);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      setError(error.message); // Définir l'erreur pour l'afficher
      setOpen(false); // Fermer le Backdrop en cas d'erreur
    }
  };

  const events = birthdays.map(user => ({
    title: `${user.firstName} ${user.lastName}`,
    date: user.dateOfBirth,
  }));

  return (
    <div className="app-container">
      <SideBar />
      <main>
        <TopBarBack />
        {/* Utilisation de Backdrop pour afficher un chargement */}
        {open ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <GridLoader color={color} loading={loading} size={20} />
          </Backdrop>
        ) : error ? (
          // Affichage de l'erreur
          <h2>Error: {error}</h2>
        ) : (
          <div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open2}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
            <div className="page-content">
              <h1>Birthday Calendar</h1>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
