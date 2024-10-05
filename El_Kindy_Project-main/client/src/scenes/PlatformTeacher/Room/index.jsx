import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Link } from 'react-router-dom';
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import SideBarTeacher from "components/SideBarTeacher";
import { useSelector } from "react-redux";
import TopBarTeacherStudent from "components/TopBarTeacherStudent";
//import MeetingHomeStudent from '../src/scenes/PlatformStudent/MeetingHomeStudent';
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Room = () => {
  const { roomId } = useParams();
  const [loadin, setLoading] = useState(true);

  const [studentsList, setStudentsList] = useState([]);
  const accessToken = useSelector((state) => state.accessToken);
  const [popupData, setPopupData] = useState({
    startTime: "",
    endTime: "",
    meetingLink: "",
    students: "",
  });

  const decodeToken = accessToken ? jwtDecode(accessToken) : "";

  // const currentUser = useSelector(state => state.user);
  const [meetingLink, setMeetingLink] = useState(""); // Ajout de l'état local
  const [showLinkInterface, setShowLinkInterface] = useState(false);
  // const [setShowLinkInterfaceInMeetingHome] = useState(false);
  const [meetingLoaded, setMeetingLoaded] = useState(false);

  const myMeeting = (element) => {
    if (!meetingLoaded && decodeToken && decodeToken.fullName) {
      const appID = 601284725;
      const serverSecret = "6407863a0afd45265fe09958043e1193";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        decodeToken.fullName
      );
      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "copy Link",
            url: `http://localhost:3000/room/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
      });
      setMeetingLink(`http://localhost:3000/room/${roomId}`);
      setMeetingLoaded(true);
    }
  };

  const showLinkInterfaceHandler = () => {
    setShowLinkInterface(true);
    //  setShowLinkInterfaceInMeetingHome(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPopupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", popupData);

    try {
      // Convert string to Date
      const startTimeDate = new Date(`2022-01-01T${popupData.startTime}:00Z`);
      const endTimeDate = new Date(`2022-01-01T${popupData.endTime}:00Z`);

      const response = await fetch("http://localhost:3001/meeting/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: popupData.date,
          startTime: startTimeDate,
          endTime: endTimeDate,
          meetingLink: popupData.meetingLink,
          students: [popupData.students], // Assuming students is an array
        }),
      });
      toast.success("Class added successfully !!", {
        autoClose: 1500,
        style: {
          color: "green",
        },
      });
      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const responseData = await response.json();
        console.log("Meeting created successfully:", responseData);

        // Optionally, reset the form data and close the popup
        setPopupData({
          date: "",
          startTime: "",
          endTime: "",
          meetingLink: "",
          students: "",
        });
        setShowLinkInterface(false);

      } else {
        console.error("Error creating meeting:", response.statusText);
        
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      
    }
  };

  useEffect(() => {
    // Fetch all inscriptions from your backend API
    const fetchInscriptions = async () => {
      try {
        const response = await fetch("http://localhost:3001/inscription/all");
        if (response.ok) {
          const data = await response.json();
          setStudentsList(data.data);
        } else {
          console.error("Error fetching inscriptions:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching inscriptions:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
  }, []);
  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>   
         <NavBar />

        {/* hedha l partie l fou9aneya  */}
        <TopBarTeacherStudent />
        {/* =======================
  Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarTeacher />

              <div className="col-xl-9">
                {/* Student review START */}
                
                <div className="card border bg-transparent rounded-3">
                  
                  {/* Reviews START */}
                  <div className="card-body mt-2 mt-sm-4">
                    {/* Review item START */}
                    <div className="d-sm-flex">
                      <div>
                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                          {/* Title */}
                          <div>
                            
                            <h5 className="m-0">Communicate effectively with your students</h5>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="text-end">
                          <div ref={myMeeting} />
                        </div>
                      </div>
                    </div>
                    {/* Divider */}
                    <hr />
                    <div>
                      <button
                        className="btn btn-primary mb-0"
                        onClick={showLinkInterfaceHandler}
                      >
                        Spread the link
                      </button>

                      {showLinkInterface && (
                        <div className="popup">
                          {/* Form START */}
                          <form
                            className="row g-4 g-sm-3 mt-2 mb-0"
                            onSubmit={handleSubmit}
                          >
                            <div className="col-12">
                              <label className="form-label">Date:</label>
                              <input
                                type="date"
                                className="form-control"
                                aria-label="date"
                                name="date"
                                value={popupData.date}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            {/* Start Time */}
                            <div className="col-12">
                              <label className="form-label">Start Time:</label>
                              <input
                                type="time"
                                className="form-control"
                                aria-label="Start Time"
                                name="startTime"
                                value={popupData.startTime}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            {/* End Time */}
                            <div className="col-12">
                              <label className="form-label">End Time:</label>
                              <input
                                type="time"
                                className="form-control"
                                aria-label="End Time"
                                name="endTime"
                                value={popupData.endTime}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            {/* Meeting Link */}
                            <div className="col-12">
                              <label className="form-label">
                                Meeting Link:
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Meeting Link"
                                name="meetingLink"
                                value={popupData.meetingLink}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            {/* Students */}
                            <div className="col-12">
                              <label className="form-label">Students :</label>
                              <select
                                className="form-select js-choice"
                                aria-label=".form-select-sm"
                                name="students"
                                value={popupData.students}
                                onChange={handleChange}
                                required
                              >
                                <option value="Select class">
                                  Select class
                                </option>
                                {studentsList.map((student) => (
                                  <option key={student._id} value={student._id}>
                                    {student.firstName} {student.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* Button */}
                            <div className="col-12 d-grid">
                              <button
                                type="submit"
                                className="btn btn-lg btn-primary mb-0"
                              >
                                spread
                              </button>


                            </div>
                          </form>
                          {/* Form END */}
                        </div>
                      )}
                    </div>
                    {/* Divider */}

                    {/* Review item END */}
                  </div>
                  {/* Reviews END */}
                </div>
                {/* Student review END */}
              </div>
            </div>
          </div>
        </section>
        {/* =======================
  Page content END */}<Footer />
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
};

export default Room;