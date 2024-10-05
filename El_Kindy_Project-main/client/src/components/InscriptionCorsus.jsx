import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { loadScripts } from "../scriptLoader";
import { Link, useNavigate } from "react-router-dom";
//toast
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CalendarInscription from "./CalendarInscription";
import BannerStartHome from "./BannerStartHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

function InscriptionCorsus(props) {
  const [coursesByCategories, setCoursesByCategories] = useState([]);
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [disponiliteTeacher, setDisponiliteTeacher] = useState([]);
  const [nonSelectableHours, setNonSelectableHours] = useState([]);

  const scriptsLoaded = useRef(false);
  const [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#399ebf");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    city: "",
    parentName: "",
    parentProfession: "",
    niveauEtude: "",
    phoneNumber1: "",
    phoneNumber2: "",
    likedCourses: [], // New field to hold the list of liked course IDs
    disponibilite: []
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = value.trim() === '' ? 'Please enter student first name!' : '';
        break;
      case 'lastName':
        error = value.trim() === '' ? 'Please enter student last name!' : '';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address!';
        break;
      case 'city':
        error = value.trim() === '' ? 'Please pick a city name!' : '';
        break;
      case 'parentName':
        error = value.trim() === '' ? 'Please enter Parent  name!' : '';
        break;
      case 'parentProfession':
        error = value.trim() === '' ? 'Please enter Parent  profession!' : '';
        break;

      case 'gender':
        error = value === '' ? 'Please select student gender!' : '';
        break;
      case 'phoneNumber1':
        error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number!';
        break;
      case 'phoneNumber2':
        // Validate phone number 2 only if a value is provided
        if (value.trim() !== '') {
          error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number!';
        }
        break;
      case 'niveauEtude':
        error = value.trim() === '' ? 'Please enter level of study!' : '';
        break;
      case 'likedCourses':
        error = value === '' ? 'Please select a course!' : '';
        break;
      case 'disponibilite':
        error = value === '' ? 'Please select your disponiblity !' : '';
        break;
        case 'dateOfBirth':
        error = value === '' ? 'Please select a stage finishDate!' : '';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleToggleFavorite = (courseId) => {
    if (formData.likedCourses.includes(courseId)) {
      // If the course is already liked, remove it from liked courses
      setFormData({
        ...formData,
        likedCourses: formData.likedCourses.filter((id) => id !== courseId),
      });
    } else {
      // If the course is not liked, add it to liked courses
      setFormData({
        ...formData,
        likedCourses: [...formData.likedCourses, courseId],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const toastShowError = (msg) => {
    toast.error(msg, {
      autoClose: 2000,
      style: {
        color: "red", // Text color
      },
    });
  };

  const toastShowSeccus = (msg) => {
    toast.success(msg, {
      autoClose: 2000,
      style: {
        color: "green", // Text color
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  useEffect(() => {
    // Fetch disponibilite from backend when component mounts
    const fetchDisponibilite = async () => {
      try {
        const response = await axios.get('/auth/teacher/disponibility');
        setDisponiliteTeacher(response.data);
      } catch (error) {
        console.error('Error fetching disponibilite:', error);
      }
    };

    fetchDisponibilite();

  }, []); // Empty dependency array ensures useEffect runs only once on mount


  const addInscription = async (values, onSubmitProps) => {
    setOpen(true);
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    try {
      const loggedInResponse = await fetch(
        "http://localhost:3001/inscription/add",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const loggedIn = await loggedInResponse.json();
      if (loggedInResponse.status === 500) {
        toastShowError("Server error, please try again later.");
        for (let [key, value] of Object.entries(formData)) {
          validateField(key, value);
        }
        setOpen(false);
      } else if (loggedInResponse.status === 201) {
        console.log("Inscription sent successfully!!");
        setOpen(false);
        toastShowSeccus("Inscription sent successfully !!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.disponibilite = selectedTimeSlots;
    await addInscription(formData);
    //console.log("formData : ",formData); // Log form data to console
  };

  //get all category
  const fetchCoursesByCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/course/getAllByCategories"
      );
      //console.log("response : ", response.data);
      setCoursesByCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    //Get all category
    fetchCoursesByCategories();
    const scripts = [
      "/assets/vendor/purecounterjs/dist/purecounter_vanilla.js",
    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []);


  //table time
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Function to handle cell click
  const handleCellClick = (day, startTime, endTime) => {
    const timeSlot = { day, startTime, endTime };
    // Check if the time slot is already selected
    const isSelected = selectedTimeSlots.some(
      (slot) =>
        slot.day === timeSlot.day &&
        slot.startTime === timeSlot.startTime &&
        slot.endTime === timeSlot.endTime
    );

    if (isSelected) {
      // Deselect the time slot
      setSelectedTimeSlots((prevSelected) =>
        prevSelected.filter(
          (slot) =>
            !(
              slot.day === timeSlot.day &&
              slot.startTime === timeSlot.startTime &&
              slot.endTime === timeSlot.endTime
            )
        )
      );
    } else {
      // Select the time slot
      setSelectedTimeSlots((prevSelected) => [...prevSelected, timeSlot]);
    }
  };

  // Function to handle cell hover
  const handleCellHover = (day, startTime, endTime) => {
    if (isMouseDown) {
      handleCellClick(day, startTime, endTime);
    }
  };

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const isSelectable = (day, hour, minute) => {
    // Check if the selected time slot matches any of the teacher's available time slots
    const currentTime = `${hour}:${minute < 10 ? '0' : ''}${minute}`;
    return disponiliteTeacher.some((slot) => slot.day === day && slot.startTime <= currentTime && slot.endTime > currentTime);
  };

  return (
    <div>
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <GridLoader color={color} loading={loading} size={20} />
      </Backdrop>
      {/* =======================
Page Banner START */}
      <BannerStartHome
        title="Pré-Inscription"
        description="Unlock your musical potential with us! Join our Conservatory Project today!"
      />
      {/* =======================
Page Banner END */}

      {/* =======================
Contact form START */}
      <section
        id="contact-form"
        className="position-relative bg-light overflow-hidden pt-0 pt-md-5"
      >
        {/* SVG decoration */}

        <div className="container">
          <div className="row g-4 g-sm-5 align-items-center justify-content-center">
            {/* Contact form START */}
            <div className="col-lg-10 d-flex">
              <div className="card card-body shadow p-4 p-sm-5 ">
                {/* SVG decoration */}
                <figure className="position-absolute top-0 start-100 mt-n5 ms-n7">
                  <svg enableBackground="new 0 0 167 107">
                    <path
                      className="fill-danger"
                      d="m87.1 1c-0.4 0.5-0.8 1-1.3 1.5l-3 2.7c-2.6 2.3-5.1 4.7-7.8 6.8-13.4 10.5-26.8 21-40.1 31.5l-25.8 20.4c-0.4 0.3-0.8 0.6-1.1 0.9-0.7 0.6-1.5 1-2.4 0.2-0.8-0.7-0.6-1.7-0.1-2.4 0.6-1 1.4-2 2.2-2.8 0.5-0.4 1-0.9 1.5-1.3 2.8-2.6 5.7-5.2 8.6-7.5 21.6-16.6 43.3-33.1 65.8-48.5 1.2-0.9 2.5-1.7 3.8-2.5 0 0 0.1 0.1 0.4 0.2-0.2 0.3-0.5 0.6-0.7 0.8zm78.9 20.9c-0.4 0.2-0.7 0.4-1.1 0.6-0.3 0.2-0.7 0.5-1.1 0.7-14.6 8.6-29 17.5-43.1 27-21.6 14.4-43 29.2-63.4 45.2-3.8 3-7.5 6-11.2 9-0.6 0.5-1.1 0.9-1.7 1.3-0.8 0.6-1.6 0.9-2.4 0.2s-0.6-1.7-0.1-2.4c0.6-1 1.3-2 2.2-2.8l0.1-0.1c2.5-2.3 5-4.6 7.7-6.6 30.4-23 61.6-44.5 94.9-63 3.8-2.1 7.7-4.1 11.6-6 1.9-1 3.9-2 5.8-3 0.5-0.2 1-0.4 1.4-0.6 0.2 0.1 0.3 0.3 0.4 0.5zm-66.1-13.4c0.7-0.5 1.3-1.1 1.9-1.7-0.1-0.1-0.2-0.2-0.5-0.3-0.7 0.5-1.4 1-2.1 1.6-0.7 0.5-1.4 1.1-2.1 1.6-4 2.9-8.1 5.8-12.1 8.7-19.3 13.8-38.6 27.7-57.8 41.8-5.4 3.9-10.5 8.1-15.6 12.3-2.1 1.7-4.2 3.5-6.3 5.2-1.5 1.2-2.8 2.6-4.1 4-0.5 0.5-1 1.1-1.2 1.8-0.1 0.5 0.1 1.2 0.4 1.5s1.1 0.4 1.5 0.2c0.8-0.4 1.5-0.9 2.2-1.5l7.2-6c4.2-3.6 8.5-7.1 12.8-10.5 10.6-8.2 21.3-16.4 31.9-24.5l23.4-18c6.9-5.4 13.7-10.8 20.5-16.2zm0.5 13.5c-1.1 1-2.2 2-3.4 2.9-3.3 2.6-6.7 5.2-10 7.8-11 8.5-22 17-32.9 25.6-6.4 5.1-12.8 10.3-19.1 15.4-3.5 2.8-7 5.7-10.5 8.5-0.8 0.7-1.6 1.4-2.5 1.9-0.5 0.3-1.6 0.3-1.9 0-0.4-0.4-0.5-1.4-0.2-1.9 0.4-0.8 1-1.6 1.7-2.3 0.7-0.6 1.4-1.3 2.1-1.9 1.7-1.6 3.4-3.2 5.2-4.7 20-15.8 40.2-31.3 61.3-45.6 2.3-1.6 4.7-3.1 7.1-4.6 0.5-0.3 1-0.7 1.5-1 0.4-0.2 0.8-0.4 1.2-0.7 0.1 0.1 0.1 0.2 0.2 0.3s0.2 0.2 0.2 0.3zm7 13.4 0.6-0.6c-0.3-0.2-0.4-0.3-0.4-0.3-1.5 1.1-3 2.2-4.5 3.2-16.7 11.1-32.8 23-48.7 35.1-4.7 3.5-9.3 7.1-13.9 10.7-0.9 0.7-1.7 1.5-2.4 2.3-0.6 0.7-0.9 1.6-0.2 2.4 0.7 0.9 1.6 0.8 2.4 0.3 1.1-0.6 2.2-1.3 3.2-2.1 1.8-1.4 3.5-2.8 5.2-4.3 1.7-1.4 3.5-2.8 5.2-4.3 12.1-9.5 24.3-19 36.5-28.4l15-12c0.6-0.4 1.3-1.2 2-2z"
                    />
                  </svg>
                </figure>
                <div className="text-center">
                  {/* Title */}
                  <div className="row position-relative z-index-9">
                    <div className="col-12 text-center mx-auto">
                      <h2 className="mb-0">{props.title}</h2>
                    </div>
                  </div>
                  {/* Form START */}
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="row ">
                      <div className="col-lg-10 mx-auto text-center position-relative">
                        {/* SVG decoration */}
                        <figure className="position-absolute top-0 start-0 translate-middle ms-8">
                          <svg
                            style={{ enableBackground: "new 0 0 141.7 143.9" }}
                          >
                            <path
                              stroke="#F99D2B"
                              fill="#F99D2B"
                              d="M137.7,53.1c9.6,29.3,1.8,64.7-20.2,80.7s-58.1,12.6-83.5-5.8C8.6,109.5-6.1,76.1,2.4,48.7 C10.8,21.1,42.2-0.7,71.5,0S128.1,23.8,137.7,53.1z"
                            />
                          </svg>
                        </figure>
                        {/* SVG decoration */}
                        <figure className="position-absolute bottom-0 end-0 me-n9 rotate-193">
                          <svg width="297.5px" height="295.9px">
                            <path
                              stroke="#F99D2B"
                              fill="none"
                              strokeWidth={13}
                              d="M286.2,165.5c-9.8,74.9-78.8,128.9-153.9,120.4c-76-8.6-131.4-78.2-122.8-154.2C18.2,55.8,87.8,0.3,163.7,9"
                            />
                          </svg>
                        </figure>
                        {/* FAQ START */}
                        <div
                          className="accordion accordion-icon accordion-shadow mt-4 text-start position-relative"
                          id="accordionExample2"
                        >
                          {/* Item */}
                          <div className="accordion-item mb-3 ">
                            <h6
                              className="accordion-header font-base "
                              id="heading-1"
                            >
                              <button
                                className="accordion-button fw-bold rounded collapsed pe-5"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-1"
                                aria-expanded="true"
                                aria-controls="collapse-1"
                              >
                                Personal information
                              </button>
                            </h6>
                            {/* Body */}
                            <div
                              id="collapse-1"
                              className="accordion-collapse collapse show"
                              aria-labelledby="heading-1"
                              data-bs-parent="#accordionExample2"
                            >
                              <div className="accordion-body mt-3">
                                <div className="row g-4">
                                  {/* First name */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Student first name{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                        name="firstName"
                        type="text"
                        placeholder="Enter firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                      )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Last name */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Student last name{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                        name="lastName"
                        type="text"
                        placeholder="Enter lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                      )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Gender */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Gender{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                        <div className="d-flex">
                                          <div className="form-check radio-bg-light me-4">
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name="gender"
                                              id="flexRadioDefault1"
                                              value="Male"
                                              checked={
                                                formData.gender === "Male"
                                              }
                                              onChange={handleChange}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="flexRadioDefault1"
                                            >
                                              Male
                                            </label>
                                          </div>
                                          <div className="form-check radio-bg-light">
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name="gender"
                                              id="flexRadioDefault2"
                                              value="Female"
                                              checked={
                                                formData.gender === "Female"
                                              }
                                              onChange={handleChange}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="flexRadioDefault2"
                                            >
                                              Female
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>


                                  {/* Date of birth */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Date of birth{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                        <div className="row g-2 g-sm-4 mx-0">
                                        <input
                        className={`form-control ${
                          errors.dateOfBirth ? "is-invalid" : ""
                        }`}
                        name="dateOfBirth"
                        type="date"
                        placeholder="Enter dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                      {errors.dateOfBirth && (
                        <div className="invalid-feedback">{errors.dateOfBirth}</div>
                      )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Email */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Email{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="dateOfBirth"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                                        </div>
                                      </div>
                                    </div>
                                  </div><br></br>
                                  {/* City */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Select city{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <select
                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      >{errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                                          <option value>Select city</option>
                                          <option>Ariana</option>
                                          <option>Beja</option>
                                          <option>Ben Arous</option>
                                          <option>Bizerte</option>
                                          <option>Gabes</option>
                                          <option>Gafsa</option>
                                          <option>Jendouba</option>
                                          <option>Kairouan</option>
                                          <option>Kasserine</option>
                                          <option>Kebili</option>
                                          <option>La Manouba</option>
                                          <option>Le Kef</option>
                                          <option>Mahdia</option>
                                          <option>Medenine</option>
                                          <option>Monastir</option>
                                          <option>Nabeul</option>
                                          <option>Sfax</option>
                                          <option>Sidi Bouzid</option>
                                          <option>Siliana</option>
                                          <option>Sousse</option>
                                          <option>Tataouine</option>
                                          <option>Tozeur</option>
                                          <option>Tunis</option>
                                          <option>Zaghouan</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div><br></br>
                                  {/* parent name */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Parent's name{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.parentName ? "is-invalid" : ""
                        }`}
                        name="parentName"
                        type="texte"
                        placeholder="Enter parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                      />
                      {errors.parentName && (
                        <div className="invalid-feedback">{errors.parentName}</div>
                      )}
                                      </div>
                                    </div>
                                  </div><br></br>
                                  {/* proffesion */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Parent's profession / Profession{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.parentProfession ? "is-invalid" : ""
                        }`}
                        name="parentProfession"
                        type="texte"
                        placeholder="Enter parentProfession"
                        value={formData.parentProfession}
                        onChange={handleChange}
                      />
                      {errors.parentProfession && (
                        <div className="invalid-feedback">{errors.parentProfession}</div>
                      )}
                                      </div>
                                    </div>
                                  </div><br></br>
                                  {/* niveauEtude */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Niveau d'étude{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.niveauEtude ? "is-invalid" : ""
                        }`}
                        name="niveauEtude"
                        type="texte"
                        placeholder="Enter niveauEtude"
                        value={formData.niveauEtude}
                        onChange={handleChange}
                      />
                      {errors.niveauEtude && (
                        <div className="invalid-feedback">{errors.niveauEtude}</div>
                      )}
                                      </div>
                                    </div>
                                  </div>
                                  <br></br>
                                  {/* Phone number */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Phone number N°1{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.phoneNumber1 ? "is-invalid" : ""
                        }`}
                        name="phoneNumber1"
                        type="Number"
                        placeholder="Enter phoneNumber1"
                        value={formData.phoneNumber1}
                        onChange={handleChange}
                      />
                      {errors.phoneNumber1 && (
                        <div className="invalid-feedback">{errors.phoneNumber1}</div>
                      )}
                                      </div>
                                    </div>
                                  </div>
                                  <br></br>
                                  {/* Phone number */}
                                  <div className="col-12">
                                    <div className="row g-xl-0 align-items-center">
                                      <div className="col-lg-4">
                                        <h6 className="mb-lg-0">
                                          Phone number N°2{" "}
                                          <span className="text-danger">*</span>
                                        </h6>
                                      </div>
                                      <div className="col-lg-8">
                                      <input
                        className={`form-control ${
                          errors.phoneNumber2 ? "is-invalid" : ""
                        }`}
                        name="phoneNumber2"
                        type="Number"
                        placeholder="Enter phoneNumber2"
                        value={formData.phoneNumber2}
                        onChange={handleChange}
                      />
                      {errors.phoneNumber2 && (
                        <div className="invalid-feedback">{errors.phoneNumber2}</div>
                      )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Item */}
                          <div className="accordion-item mb-3">
                            <h6
                              className="accordion-header font-base"
                              id="heading-2"
                            >
                              <button
                                className="accordion-button fw-bold rounded collapsed pe-5"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-2"
                                aria-expanded="false"
                                aria-controls="collapse-2"
                              >
                                DESIRED INSTRUMENTS ( Like what you want to
                                learn)
                              </button>
                            </h6>
                            {/* Body */}
                            <div
                              id="collapse-2"
                              className="accordion-collapse collapse"
                              aria-labelledby="heading-2"
                              data-bs-parent="#accordionExample2"
                            >
                              <div className="accordion-body">
                                {/* Form START */}
                                <div>
                                  {coursesByCategories.map(
                                    (category, index) => (
                                      <>
                                        {/* Title */}
                                        <div className="row mx-5 mb-4 mt-4">
                                          <h5 className="mb-0">
                                            <span className="position-relative z-index-1">
                                              {category.categoryName[0]}
                                              {/* SVG START */}
                                              <span className="position-absolute top-50 start-50 translate-middle z-index-n1">
                                                <svg
                                                  width="163.9px"
                                                  height="48.6px"
                                                >
                                                  <path
                                                    className="fill-warning"
                                                    d="M162.5,19.9c-0.1-0.4-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-0.5-0.4-0.7c-0.3-0.4-0.7-0.7-1.2-0.9l0.1,0l-0.1,0 c0.1-0.4-0.2-0.5-0.5-0.6c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.3,0-0.6-0.2-0.7c-0.1-0.1-0.3-0.2-0.6-0.2 c0-0.3-0.1-0.5-0.3-0.6c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.1,0-0.2,0c-0.5-0.4-1-0.8-1.4-1.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.3-0.2 c-0.9-0.5-1.8-1-2.6-1.5c-6-3.6-13.2-4.3-19.8-6.2c-4.1-1.2-8.4-1.4-12.6-2c-5.6-0.8-11.3-0.6-16.9-1.1c-2.3-0.2-4.6-0.3-6.8-0.3 c-1.2,0-2.4-0.2-3.5-0.1c-2.4,0.4-4.9,0.6-7.4,0.7c-0.8,0-1.7,0.1-2.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0 c-0.9,0-1.8,0.1-2.7,0.1c-0.9,0-1.8,0-2.7,0c-5.5-0.3-10.7,0.7-16,1.5c-2.5,0.4-5.1,1-7.6,1.5c-2.8,0.6-5.6,0.7-8.4,1.4 c-4.1,1-8.2,1.9-12.3,2.6c-4,0.7-8,1.6-11.9,2.7c-3.6,1-6.9,2.5-10.1,4.1c-1.9,0.9-3.8,1.7-5.2,3.2c-1.7,1.8-2.8,4-4.2,6 c-1,1.3-0.7,2.5,0.2,3.9c2,3.1,5.5,4.4,9,5.7c1.8,0.7,3.6,1,5.3,1.8c2.3,1.1,4.6,2.3,7.1,3.2c5.2,2,10.6,3.4,16.2,4.4 c3,0.6,6.2,0.9,9.2,1.1c4.8,0.3,9.5,1.1,14.3,0.8c0.3,0.3,0.6,0.3,0.9-0.1c0.7-0.3,1.4,0.1,2.1-0.1c3.7-0.6,7.6-0.3,11.3-0.3 c2.1,0,4.3,0.3,6.4,0.2c4-0.2,8-0.4,11.9-0.8c5.4-0.5,10.9-1,16.2-2.2c0.1,0.2,0.2,0.1,0.2,0c0.5-0.1,1-0.2,1.4-0.3 c0.1,0.1,0.2,0.1,0.3,0c0.5-0.1,1-0.3,1.6-0.3c3.3-0.3,6.7-0.6,10-1c2.1-0.3,4.1-0.8,6.2-1.2c0.2,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.1,0,0.2-0.1c0,0,0.1,0,0.1-0.1c0,0,0-0.1,0.1-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.3-0.2 c0,0,0,0,0,0l0,0c0,0,0,0,0,0c0.2,0,0.4-0.1,0.5-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.3c0.5-0.2,0.9-0.4,1.4-0.5 c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1,0c0,0,0.1,0,0.1,0c0.2,0.1,0.4,0.1,0.6,0 c0.1,0,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.1-0.3c0.5-0.2,1-0.4,1.6-0.7c1.5-0.7,3.1-1.4,4.7-1.9c4.8-1.5,9.1-3.4,12.8-6.3 c0.8-0.2,1.2-0.5,1.6-1c0.2-0.3,0.4-0.6,0.5-0.9c0.5-0.1,0.7-0.2,0.9-0.5c0.2-0.2,0.2-0.5,0.3-0.9c0-0.1,0-0.1,0.1-0.1 c0.5,0,0.6-0.3,0.8-0.5C162.3,24,163,22,162.5,19.9z M4.4,28.7c-0.2-0.4-0.3-0.9-0.1-1.2c1.8-2.9,3.4-6,6.8-8 c2.8-1.7,5.9-2.9,8.9-4.2c4.3-1.8,9-2.5,13.6-3.4c0,0.1,0,0.2,0,0.2l0,0c-1.1,0.4-2.2,0.7-3.2,1.1c-3.3,1.1-6.5,2.1-9.7,3.4 c-4.2,1.6-7.6,4.2-10.1,7.5c-0.5,0.7-1,1.3-1.6,2c-2.2,2.7-1,4.7,1.2,6.9c0.1,0.1,0.3,0.3,0.4,0.5C7.8,32.5,5.5,31.2,4.4,28.7z  M158.2,23.8c-1.7,2.8-4.1,5.1-7,6.8c-2,1.2-4.5,2.1-6.9,2.9c-3.3,1-6.4,2.4-9.5,3.7c-3.9,1.6-8.1,2.5-12.4,2.9 c-6,0.5-11.8,1.5-17.6,2.5c-4.8,0.8-9.8,1-14.7,1.5c-5.6,0.6-11.2,0.2-16.8,0.1c-3.1-0.1-6.3,0.3-9.4,0.5c-2.6,0.2-5.2,0.1-7.8-0.1 c-3.9-0.3-7.8-0.5-11.7-0.9c-2.8-0.3-5.5-0.7-8.2-1.4c-3.2-0.8-6.3-1.7-9.5-2.5c-0.5-0.1-1-0.3-1.4-0.5c-0.2-0.1-0.4-0.1-0.6-0.2 c0,0,0.1,0,0.1,0c0.3-0.1,0.5,0,0.7,0.1c0,0,0,0,0,0c3.4,0.5,6.9,1.2,10.3,1.4c0.5,0,1,0,1.5,0c0.5,0,1.3,0.2,1.3-0.3 c0-0.6-0.7-0.9-1.4-0.9c-2.1,0-4.2-0.2-6.3-0.5c-4.6-0.7-9.1-1.5-13.4-3c-2.9-1.1-5.4-2.7-6.9-5.2c-0.5-0.8-0.5-1.6-0.1-2.4 c3.2-6.2,9-9.8,16.3-12.2c6.7-2.2,13.2-4.5,20.2-6c5-1.1,10-1.8,15-2.9c8.5-1.9,17.2-2.4,26-2.7c3.6-0.1,7.1-0.8,10.8-0.6 c8.4,0.7,16.7,1.2,25,2.3c4.5,0.6,9,1.2,13.6,1.7c3.6,0.4,7.1,1.4,10.5,2.8c3.1,1.3,6,2.9,8.5,5C159.1,17.7,159.8,21.1,158.2,23.8z"
                                                  />
                                                </svg>
                                              </span>
                                              {/* SVG END */}
                                            </span>
                                          </h5>
                                        </div>
                                        {/* Course Grid START */}
                                        <div className="row g-4">
                                          {category.courses.map(
                                            (course, courseIndex) => (
                                              <>
                                                {/* Card item START */}
                                                <div className="col-sm-6 col-xl-4">
                                                  <div className="card shadow h-100">
                                                    {/* Image */}
                                                    <img
                                                      src={`http://localhost:3001/assets/${course.picturePath}`}
                                                      className="card-img-top"
                                                      alt="course image"
                                                      style={{
                                                        height: "150px",
                                                      }}
                                                    />
                                                    {/* Card body */}
                                                    <div className="card-body pb-0">
                                                      {/* Badge and favorite */}
                                                      <div className="d-flex justify-content-between mb-2">
                                                        {/* Render badge based on course level */}
                                                        {course.courseLevel ===
                                                          "Beginner" && (
                                                            <a
                                                              href="#"
                                                              className="badge bg-info bg-opacity-10 text-info"
                                                            >
                                                              {course.courseLevel}
                                                            </a>
                                                          )}
                                                        {course.courseLevel ===
                                                          "All level" && (
                                                            <a
                                                              href="#"
                                                              className="badge bg-info bg-opacity-10 text-info"
                                                            >
                                                              {course.courseLevel}
                                                            </a>
                                                          )}
                                                        {course.courseLevel ===
                                                          "Intermediate" && (
                                                            <a
                                                              href="#"
                                                              className="badge bg-warning bg-opacity-10 text-warning"
                                                            >
                                                              {course.courseLevel}
                                                            </a>
                                                          )}
                                                        {course.courseLevel ===
                                                          "Advance" && (
                                                            <a
                                                              href="#"
                                                              className="badge bg-danger bg-opacity-10 text-danger"
                                                            >
                                                              {course.courseLevel}
                                                            </a>
                                                          )}
                                                        {/* Favorite icon */}
                                                        <div
                                                          className={`icon-circle ${formData.likedCourses.includes(
                                                            course._id
                                                          )
                                                              ? "liked"
                                                              : ""
                                                            }`}
                                                          onClick={() =>
                                                            handleToggleFavorite(
                                                              course._id
                                                            )
                                                          }
                                                        >
                                                          {formData.likedCourses.includes(
                                                            course._id
                                                          ) ? (
                                                            <FontAwesomeIcon
                                                              icon={faCheck}
                                                              className="text-success"
                                                            /> // Checked icon
                                                          ) : (
                                                            <FontAwesomeIcon
                                                              icon={faPlus}
                                                              className="text-primary"
                                                            /> // Plus icon
                                                          )}
                                                        </div>
                                                      </div>
                                                      {/* Title */}
                                                      <h6 className="card-title">
                                                        <a href="#">
                                                          {course.title}
                                                        </a>
                                                      </h6>
                                                      <p className="mb-2 text-truncate-2">
                                                        {course.description}
                                                      </p>
                                                      {/* Rating star */}
                                                      <ul className="list-inline mb-2 ">
                                                        <li className="list-inline-item me-0 small">
                                                          <i className="fas fa-star text-warning" />
                                                        </li>
                                                        <li className="list-inline-item me-0 small">
                                                          <i className="fas fa-star text-warning" />
                                                        </li>
                                                        <li className="list-inline-item me-0 small">
                                                          <i className="fas fa-star text-warning" />
                                                        </li>
                                                        <li className="list-inline-item me-0 small">
                                                          <i className="fas fa-star text-warning" />
                                                        </li>
                                                        <li className="list-inline-item me-0 small">
                                                          <i className="far fa-star text-warning" />
                                                        </li>
                                                        <li className="list-inline-item ms-2 h6 fw-light mb-0">
                                                          4.0/5.0
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  </div>
                                                </div>
                                                {/* Card item END */}
                                              </>
                                            )
                                          )}
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                                {/* Form END */}
                              </div>
                            </div>
                          </div>
                          {/* Item */}
                          <div className="accordion-item mb-3">
                            <h6
                              className="accordion-header font-base"
                              id="heading-3"
                            >
                              <button
                                className="accordion-button fw-bold collapsed rounded pe-5"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-3"
                                aria-expanded="false"
                                aria-controls="collapse-3"
                              >
                                AVAILABLE TIME SLOTS
                              </button>
                            </h6>
                            <div
                              id="collapse-3"
                              className="accordion-collapse collapse"
                              aria-labelledby="heading-3"
                              data-bs-parent="#accordionExample2"
                            >
                              <div className="accordion-body mt-3">
                                <div className="table-responsive">
                                  <table className="calendar-table">
                                    <thead>
                                      <tr>
                                        <th className="time-column"></th>
                                        {dayNames.map((day) => (
                                          <th key={day}>{day}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[...Array(20)].map((_, index) => {
                                        const startHour =
                                          Math.floor(index / 2) + 10;
                                        const startMinute =
                                          index % 2 === 0 ? "00" : "30";
                                        const endHour =
                                          Math.floor((index + 1) / 2) + 10;
                                        const endMinute =
                                          (index + 1) % 2 === 0 ? "00" : "30";
                                        const startTime = `${startHour}:${startMinute}`;
                                        const endTime = `${endHour}:${endMinute}`;

                                        return (
                                          <tr key={index}>
                                            <td className="time-column">
                                              {startTime} - {endTime}
                                            </td>
                                            {dayNames.map((day, dayIndex) => (
                                              <td
                                                key={dayIndex}
                                                className={`
                        ${!isSelectable(day, startHour, parseInt(startMinute))
                                                    ? "non-selectable-cell"
                                                    : ""
                                                  }
                        ${selectedTimeSlots.some(
                                                    (slot) =>
                                                      slot.day === day &&
                                                      slot.startTime === startTime &&
                                                      slot.endTime === endTime
                                                  )
                                                    ? "selected"
                                                    : ""
                                                  }
                      `}
                                                onClick={() =>
                                                  isSelectable(
                                                    day,
                                                    startHour,
                                                    parseInt(startMinute)
                                                  ) &&
                                                  handleCellClick(
                                                    day,
                                                    startTime,
                                                    endTime
                                                  )
                                                }
                                                onMouseEnter={() =>
                                                  isSelectable(
                                                    day,
                                                    startHour,
                                                    parseInt(startMinute)
                                                  ) &&
                                                  handleCellHover(
                                                    day,
                                                    startTime,
                                                    endTime
                                                  )
                                                }
                                                onMouseDown={() =>
                                                  setIsMouseDown(true)
                                                }
                                                onMouseUp={() =>
                                                  setIsMouseDown(false)
                                                }
                                              ></td>
                                            ))}
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button */}
                          <div className="col-12 text-center mt-4">
                            <button
                              type="submit"
                              className="btn btn-primary mb-0"
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                        {/* FAQ END */}
                      </div>
                    
                  </form>
                </div>
              </div>
            </div>
            {/* Contact form END */}
          </div>
        </div>
      </section>
      {/* =======================
Contact form END */}
    </div>
  );
}

export default InscriptionCorsus;
