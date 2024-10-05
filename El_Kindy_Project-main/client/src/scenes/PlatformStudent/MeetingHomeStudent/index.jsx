import React, { useEffect, useState } from 'react';
import Footer from 'components/Footer';
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from 'components/NavBar';

function Index() {
  const [meetings, setMeetings] = useState([]);
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/meeting/getAll');
        console.log('Réponse de l\'API :', response.data);
        setMeetings(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réunions :', error);
      }
    };

    fetchMeetings();
  }, []);

  // Obtenez la date d'aujourd'hui au format YYYY-MM-DD
  const todayDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  console.log('todayDate:', todayDate);

  // Filtrez les réunions dont la date est égale à la date d'aujourd'hui
  const todayMeetings = meetings
    .map((meeting) => ({ ...meeting, date: new Date(meeting.date) }))
    .filter((meeting) => {
      const today = new Date();
      const isSameDate = meeting.date.getDate() === today.getDate() &&
        meeting.date.getMonth() === today.getMonth() &&
        meeting.date.getFullYear() === today.getFullYear();

      console.log('Réunion:', meeting);
      console.log('Même date que aujourd\'hui:', isSameDate);

      return isSameDate;
    });


  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <NavBar />
        {/* hedha l partie l fou9aneya  */}
        <NavBar />

        <TopBarTeacherStudent />
        {/* =======================
                Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarStudent />

              <div className="col-xl-9">
                {/* Student review START */}
                <div className="card border bg-transparent rounded-3">
                  {/* Reviews START */}
                  <div className="card-body mt-2 mt-sm-4 d-flex justify-content-center align-items-center ">
                    {/* Category item */}
                    <div className="col-sm-9 ">
                      <div className="card card-body shadow h-100 d-flex justify-content-center align-items-center  ">
                        {/* Title and image */}
                        <div className="d-flex align-items-center">
                          <img src="assets/images/element/meeting.png" className="h-60px mb-2" alt />
                          <div className="ms-3">
                            <h5 className="mb-0"><a href="#">Welcome to our online meeting!</a></h5>
                            <p className="mb-0 small">Use this area to ask questions, share ideas and interact with your fellow students</p>
                          </div>
                        </div>
                        {/* List */}
                        <ul className="list-group list-group-borderless small mt-2">
                          {todayMeetings.length > 0 ? (
                            todayMeetings.map((meeting) => (
                              <li className="list-group-item text-body pb-0" key={meeting._id}>
                                {/* <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" />Date (from API): {meeting.date.toISOString()}</li>*/}
                                <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" />Date (todayDate): {todayDate} </li>

                                <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" />Heure de début : {new Date(meeting.startTime).toLocaleTimeString()}</li>

                                <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" />Heure de fin : {new Date(meeting.endTime).toLocaleTimeString()}</li>
                                <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" />Lien : <Link to={meeting.meetingLink}>{meeting.meetingLink}</Link></li>
                              </li>
                            ))
                          ) : (
                            <p>Aucune réunion aujourd'hui.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                    {/* Category item */}

                  </div>
                </div>
              </div>
            </div>
            {/* Row END */}
          </div>
        </section>
        {/* =======================
                  Page content END */}
        <Footer />
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;

