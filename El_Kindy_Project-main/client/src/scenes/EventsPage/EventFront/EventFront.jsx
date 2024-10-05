import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BannerStart from 'components/BannerStart';
import kendy from "../../../../src/assetss/images/kendy.png";
import Navbar  from "components/NavBar";
import Footer from "components/Footer";
import '../../Style.css';
import BannerStartHome from "components/BannerStartHome";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

function ListEventUser() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch events when the component mounts
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/event/events");
        console.log('Response Data:', response.data);
        const filteredEvents = response.data.filter(event => {
          // Convert event start date and current date to Date objects
          const eventStartDate = new Date(event.dateDebut);
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

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const userRoles = accessToken ? jwtDecode(accessToken).roles : [];

  

  const navigateToDetailPage = (eventId) => {

    console.log("User Roles:", userRoles);

    // If user is authenticated and has required roles, render the element
  if (accessToken && userRoles.some(role => ["admin", "superAdmin"].includes(role))) {
    navigate(`/events/reservation/${eventId}`);
  } else {
    navigate(`/detailEvent/${eventId}`);
  }}



  return ( 
    <div>
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
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
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
  {/* Top header END */}
  {/* Header START */}
 {/* =======================
        Page Banner START */}
       
        {/* =======================
        Page Banner END */}
  {/* Header END */}
  {/* **************** MAIN CONTENT START **************** */}
  <main>
  <BannerStartHome
          title="All Events"
          description="Find and book the best events happening around you."
        />

    {/* =======================
About START */}


    {/* =======================
About END */}
    {/* =======================
Trending courses START */}
<section className="pt-0 pt-md-5">
<div className="container">
  <div className="row">
    <div className="col-lg-8 mb-4">
      <h2 className="mb-0">Discover Our <span className="text-warning">Trending</span> Events</h2>
      <p>Explore the hottest events happening now!</p>
    </div>
  </div>
  <div className="row g-4">
    {events.map(event => (
      <div className="col-md-6 col-xl-4" key={event._id} onClick={() => navigateToDetailPage(event._id)}>
        <article className="event-card">
          <div className="cardd shadow-hover h-100">
            {/* Wrap the image inside a div and apply background color to the div */}
            <div style={{ background: 'linear-gradient(rgba(236, 231, 225, 0.25), rgba(18, 91, 193, 0.93))' }}>
              <img
                src={event.picturePath ? `http://localhost:3001/assets/${event.picturePath}` : "assets/images/default-event.jpg"}
                alt={event.title}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="card-content p-3">
  <div className="text-center">
    <h5 className="card-title mt-2">{event.title}</h5>
    <p className="event-dates mb-2">
      <i className="fas fa-calendar-alt"></i> {new Date(event.dateDebut).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} - {new Date(event.dateFin).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
    </p>
    <div className="event-details mb-3">
      <p className="event-place mb-1">
        <i className="fas fa-map-marker-alt"></i> {event.place}
      </p>
    </div>
    <div className="cardd-layer my-2">
      <a href="#" className="btn btn-primary btn-sm">View more</a>
    </div>
  </div>
</div>

            <p className="event-price text-center my-2">
    {event.price ? (
      <span className="badge bg-primary">{event.price} TND</span>
    ) : (
      <span className="badge bg-success">Free Event</span>
    )}
  </p>
          </div>
        </article>
      </div>
    ))}
  </div>
{/*   <div className="text-center mt-5">
    <button className="btn btn-primary">View More Events</button>
  </div> */}
</div>

</section>

<section>
  <div className="container ">
    <div className="row g-4 align-items-center">
      <div className="col-lg-5">
        {/* Title */}
        <h2>Immerse in Our<span className="text-warning"> Flourishing Conservatory Life.</span></h2>
        {/* Image */}
        <img src="assets/images/about/03.jpg" className="rounded-2" alt="conservatory events" />
      </div>
      <div className="col-lg-7">
        <div className="row g-4">
          <br></br>
          {/* Item */}
          <div className="col-sm-6">
            <div className="icon-lg bg-orange bg-opacity-10 text-orange rounded-2"><i className="fas fa-chalkboard-teacher fs-5"></i></div>
            <h5 className="mt-2">Masterclasses with Maestros</h5>
            <p className="mb-0">Engage directly with virtuosos and seasoned performers. Expand your musical prowess and be inspired by experts.</p>
          </div>
          {/* Item */}
          <div className="col-sm-6">
            <div className="icon-lg bg-info bg-opacity-10 text-info rounded-2"><i className="fas fa-music fs-5"></i></div>
            <h5 className="mt-2">A Symphony of Events</h5>
            <p className="mb-0">Our calendar is a composition of various events—recitals, workshops, and seasonal concerts. There’s a perfect harmony for everyone.</p>
          </div>
          {/* Item */}
          <div className="col-sm-6">
            <div className="icon-lg bg-success bg-opacity-10 text-success rounded-2"><i className="fas fa-clock fs-5"></i></div>
            <h5 className="mt-2">Harmonious Flexibility</h5>
            <p className="mb-0">We offer a variety of events that cater to different schedules and learning paces, ensuring that you can enjoy the beauty of music at your convenience.</p>
          </div>
          {/* Item */}
          <div className="col-sm-6">
            <div className="icon-lg bg-purple bg-opacity-10 text-purple rounded-2"><i className="fas fa-palette fs-5"></i></div>
            <h5 className="mt-2">Elevated Artistic Standards</h5>
            <p className="mb-0">Partake in events that epitomize excellence and creativity, designed to resonate with aficionados and newcomers alike.</p>
          </div>		
        </div>
      </div>
    </div>
  </div>
</section>


    {/* =======================
Trending courses END */}
    {/* =======================
Video divider START */}
    <section className="bg-light position-relative">
      {/* SVG decoration */}
      <figure className="position-absolute bottom-0 start-0 d-none d-lg-block">
        <svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
          <path className="fill-warning" d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z" />
        </svg>
      </figure>
      {/* SVG decoration */}
      <figure className="position-absolute top-0 end-0">
        <svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
          <path className="fill-primary" d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z" />
        </svg>
      </figure>
      {/* SVG decoration */}
      <figure className="position-absolute bottom-0 start-50 translate-middle-x ms-n9 mb-5">
        <svg width="23px" height="23px">
          <path className="fill-primary" d="M23.003,11.501 C23.003,17.854 17.853,23.003 11.501,23.003 C5.149,23.003 -0.001,17.854 -0.001,11.501 C-0.001,5.149 5.149,-0.000 11.501,-0.000 C17.853,-0.000 23.003,5.149 23.003,11.501 Z" />
        </svg>
      </figure>
      {/* SVG decoration */}
      <figure className="position-absolute bottom-0 end-0 me-5 mb-5">
        <svg width="22px" height="22px">
          <path className="fill-warning" d="M22.003,11.001 C22.003,17.078 17.077,22.003 11.001,22.003 C4.925,22.003 -0.001,17.078 -0.001,11.001 C-0.001,4.925 4.925,-0.000 11.001,-0.000 C17.077,-0.000 22.003,4.925 22.003,11.001 Z" />
        </svg>
      </figure>



      <div className="container position-relative">
        <div className="row justify-content-between align-items-center my-5">
          <div className="col-lg-5 position-relative">
            {/* SVG decoration */}
            <figure className="position-absolute top-0 start-0 translate-middle mt-n5">
              <svg width="29px" height="29px">
                <path className="fill-orange" d="M29.004,14.502 C29.004,22.512 22.511,29.004 14.502,29.004 C6.492,29.004 -0.001,22.512 -0.001,14.502 C-0.001,6.492 6.492,-0.001 14.502,-0.001 C22.511,-0.001 29.004,6.492 29.004,14.502 Z" />
              </svg>
            </figure>
            {/* Title */}
            <h2 className="h1">Checkout our Last Event</h2>
          </div>
          <div className="col-lg-5 position-relative mt-4 mt-lg-0">
            {/* Image */}
            <img src={kendy} className="border border-5 border-white rounded-2" alt />
            <div className="position-absolute top-50 start-50 translate-middle">
              {/* Video link */}
              <a href="https://www.facebook.com/watch/?v=1108461359291863" className="btn text-danger btn-round btn-white-shadow btn-lg mb-0" data-glightbox data-gallery="video-tour">
                <i className="fas fa-play" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =======================
Video divider END */}
    {/* =======================

    {/* =======================
Event END */}
    {/* =======================
Newsletter START */}

    {/* =======================
Newsletter END */}
  </main>
  {/* **************** MAIN CONTENT END **************** */}
  {/* =======================
Footer START */}
  <Footer />
  
  {/* =======================
Footer END */}

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

    </div>
  );
  
}

export default ListEventUser;
