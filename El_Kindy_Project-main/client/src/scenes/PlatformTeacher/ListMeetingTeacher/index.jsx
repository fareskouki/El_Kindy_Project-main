import React, { useEffect, useState } from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from "components/Footer";
import NavBar from "components/NavBar";

const Index = () => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/meeting/getAll');
                console.log('Réponse de l\'API :', response.data);
                // Filtrer les réunions à partir de la date système
                const currentDate = new Date().toISOString().split('T')[0];
                const filteredMeetings = response.data.data.filter(meeting => meeting.date >= currentDate);
                setMeetings(filteredMeetings);
            } catch (error) {
                console.error('Erreur lors de la récupération des réunions :', error);
            }
        };

        fetchMeetings();
    }, []);

    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
            <main>
                <NavBar />
                <TopBarTeacherStudent />
                {/* =======================
                    Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarTeacher />
                            <div className="col-xl-9">
                                <div className="card border bg-transparent rounded-3">
                                    <div className="card card-body shadow h-100 d-flex justify-content-center align-items-center  ">
                                        <div className="card-header bg-transparent border-bottom">
                                            <div className="row justify-content-between align-middle">
                                                <div className="col-sm-12">
                                                    <h3 className="card-header-title mb-2 mb-sm-0">List Meeting</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="list-group list-group-borderless small mt-2">
                                            {meetings.map((meeting, index) => (
                                                <div key={meeting._id} className="meeting-item">
                                                    <h5 className="mb-1">{meeting.title}</h5>
                                                    <p className="text-muted mb-2">{meeting.description}</p>
                                                    <div className="meeting-details">
                                                        <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" /><strong>Date:</strong> {meeting.date}</li>
                                                        <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" /><strong>Heure de début:</strong> {meeting.startTime}</li>
                                                        <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" /><strong>Heure de fin:</strong> {meeting.endTime}</li>
                                                        <li className="list-group-item text-body pb-0"> <i className="bi bi-patch-check-fill text-success" /><strong>Lien:</strong>  <Link to={meeting.meetingLink}>{meeting.meetingLink}</Link></li>
                                                    </div>
                                                    {index !== meetings.length - 1 && <hr />}
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Page content END */}
                <Footer />
            </main>
            {/* MAIN CONTENT END */}
        </div>
    );
};

export default Index;
