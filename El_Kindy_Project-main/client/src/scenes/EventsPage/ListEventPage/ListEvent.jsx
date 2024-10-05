import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BannerStart from 'components/BannerStart';
import kendy from "../../../../src/assetss/images/kendy.png";
import Navbar  from "components/NavBar";
import Footer from "components/Footer";
import '../../Style.css';
import BannerStartHome from "components/BannerStartHome";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";

function ListEventUser() {
  const [events, setEvents] = useState([]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events when the component mounts
    const fetchEvents = async () => {
            setOpen(true);

      try {
        const response = await axios.get("http://localhost:3001/event/events");
        console.log('Response Data:', response.data);
        const filteredEvents = response.data.filter(event => {
          // Convert event start date and current date to Date objects
          const eventStartDate = new Date(event.dateDebut);
          setOpen(false);

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          // Return true if the event's start date is today or in the future
          return eventStartDate >= currentDate;
        });
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const navigate = useNavigate();

  const navigateToDetailPage = (eventId) => {
    navigate(`/detailEvent/${eventId}`);
  };
  
    return (
      <div>
        <title>Eduport - LMS, Education and Course Theme</title>
        {/* Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="author" content="Webestica.com" />
        <meta name="description" content="Eduport- LMS, Education and Course Theme" />
        {/* Favicon */}
        <link rel="shortcut icon" href="assets/images/favicon.ico" />
        {/* Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" />
        {/* Plugins CSS */}
        <link rel="stylesheet" type="text/css" href="assets/vendor/font-awesome/css/all.min.css" />
        <link rel="stylesheet" type="text/css" href="assets/vendor/bootstrap-icons/bootstrap-icons.css" />
        <link rel="stylesheet" type="text/css" href="assets/vendor/tiny-slider/tiny-slider.css" />
        <link rel="stylesheet" type="text/css" href="assets/vendor/glightbox/css/glightbox.css" />
        {/* Theme CSS */}
        <link id="style-switch" rel="stylesheet" type="text/css" href="assets/css/style.css" />
        {/* Top header START */}
        <Navbar />
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
            <main>
              <BannerStartHome
                title="All Events"
                description="Find and book the best events happening around you."
              />
              {/* Votre contenu */}
            </main>
            {/* Footer START */}
            <Footer />
            {/* Footer END */}
            {/* Cookie alert box START */}
            <div className="alert alert-light fade show position-fixed start-0 bottom-0 z-index-99 rounded-3 shadow p-4 ms-3 mb-3 col-10 col-md-4 col-lg-3 col-xxl-2" role="alert">
              <div className="text-dark text-center">	
                {/* Image */}
                <img src="assets/images/element/27.svg" className="h-50px mb-3" alt="cookie" />
                {/* Content */}
                <p className="mb-0">This website stores cookies on your computer. To find out more about the cookies we use, see our <a className="text-dark" href="#"><u> Privacy Policy</u></a></p>
                {/* Buttons */}
                <div className="mt-3">
                  <button type="button" className="btn btn-success-soft btn-sm mb-0" data-bs-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">Accept</span>
                  </button>
                  <button type="button" className="btn btn-danger-soft btn-sm mb-0" data-bs-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">Decline</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Cookie alert box END */}
            {/* Back to top */}
            <div className="back-top"><i className="bi bi-arrow-up-short position-absolute top-50 start-50 translate-middle" /></div>
            {/* Bootstrap JS */}
            {/* Vendors */}
            {/* Template Functions */}
          </div>
        )}
      </div>
    );
  }
  
  export default ListEventUser;
  