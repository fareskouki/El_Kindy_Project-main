import useAxiosPrivate from 'hooks/useAxiosPrivate';
import React, { useEffect, useState } from 'react';
import { getAllClasses } from 'services/classesService/api';
import { getAllCourses } from 'services/courseService/api';
import { addStudent } from 'services/usersService/api';

function AddStudent({ onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    classLevel: '', // Add classLevel for student
    coursesEnrolled: [],
    dateOfBirth: '',
    address: '',
    gender: '',
    phoneNumber1: '',
    phoneNumber2: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    disponibilite: [] // Availability slots
  });

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const axiosPrivate = useAxiosPrivate();



  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await getAllCourses(axiosPrivate);
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await getAllClasses(axiosPrivate);
        setClasses(classesData.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'coursesEnrolled') {
      const selectedCourseId = value;
      const isChecked = checked;
      if (isChecked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesEnrolled: [...prevFormData.coursesEnrolled, selectedCourseId],
        }));
        validateField(name, value);

      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesEnrolled: prevFormData.coursesEnrolled.filter((id) => id !== selectedCourseId),
        }));
        validateField(name, value);

      }
    } else if (name === 'classLevel') {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);

    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);

    }
  };

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
      case 'password':
        error = value.length < 6 ? 'Password must be at least 6 characters long!' : '';
        break;
      case 'address':
        error = value.trim() === '' || value.length < 6 ? 'Please enter student full address !' : '';
        break;
      case 'classLevel':
        error = formData.classLevel.length === 0 ? 'Please enter student class level !' : '';
        break;
      case 'dateOfBirth':
        // Calculate 3 years ago date
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 3);
        const selectedDate = new Date(value);
        error = selectedDate > minDate || value.trim() === '' ? 'Date of birth must be at least 3 years ago!' : '';
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
      case 'parentName':
        error = value.trim() === '' ? 'Please enter parent name!' : '';
        break;
      case 'parentEmail':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid parent email address!';
        break;
      case 'parentPhone':
        error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid parent phone number!';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
};


  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("formData : ",formData);
    formData.disponibilite = selectedTimeSlots;
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        formErrors[key] = errors[key];
      }
    });
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }else{

    
    try {
      // Make API call to add student
      const response = await addStudent(formData);
      if (response.status === 201) {
        console.log('Student added successfully!');
        // Close the form
        onClose();
        // Fetch data
        fetchData();
      } else {
        console.error('Error adding student:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error adding student:', error);
      // Handle error here, e.g., show error message to the user
    }

  }
  };

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
    if (day === "Saturday" || day === "Sunday") {
      return true; // Allow selection on Saturday and Sunday
    }

    const nonSelectableHours = [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
    ];
    const currentTime = `${hour}:${minute < 10 ? "0" : ""}${minute}`;

    return !nonSelectableHours.includes(currentTime);
  };
  return (
    <div className="page-content-wrapper border">
      <div className="container position-relative">
        {/* Close icon */}
        <button
          className="btn btn-link text-danger position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ fontSize: '1.3rem' }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        {/* Form content */}
        <form onSubmit={handleSubmit}>
          {/* Personal information */}
          <div className="mt-5">
            <h5 className=" font-base">Personal information</h5>
            <div>
              <div className="accordion-body mt-3">
                <div className="row g-4">
                  {/* First name */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          First name <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Last name */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Last name <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Email <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Password */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Password <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Courses enrolled */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Courses Enrolled{' '}
                          <span className="text-danger">*</span>
                        </h6>
                        <p>Please select at least one course!</p>
                      </div>
                      <div className="col-lg-8">
                        <div className="row row-cols-3">
                          {courses.map((course) => (
                            <div key={course._id} className="col">
                              <div className="form-check">
                                <input
                                  className={`form-check-input`}
                                  type="checkbox"
                                  id={course._id}
                                  name="coursesEnrolled"
                                  value={course._id}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor={course._id}>
                                  {course.title}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Class level */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Class Level{' '}
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="classLevel"
                          value={formData.classLevel}
                          onChange={handleChange}
                          className={`form-control ${errors.classLevel ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select class</option>
                          {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem._id}>
                              {classItem.className}
                            </option>
                          ))}
                        </select>
                        {errors.classLevel && <div className="invalid-feedback">{errors.classLevel}</div>}

                      </div>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Date of Birth {' '}
                            <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                        />
                        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Address{' '}
                            <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Gender{' '}
                            <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                          >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Phone Number 1 */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Phone Number 1 <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber1"
                          value={formData.phoneNumber1}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber1 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber1 && <div className="invalid-feedback">{errors.phoneNumber1}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Phone Number 2 */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Phone Number 2</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber2"
                          value={formData.phoneNumber2}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber2 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber2 && <div className="invalid-feedback">{errors.phoneNumber2}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Parent's information */}
                  <div className="col-12">
                    <h5 className=" font-base">Parent's information</h5>
                    <div>
                      <div className="accordion-body mt-3">
                        <div className="row g-4">
                          {/* Parent Name */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Name <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="text"
                                  name="parentName"
                                  value={formData.parentName}
                                  onChange={handleChange}
                                  className={`form-control ${errors.parentName ? 'is-invalid' : ''}`}
                        />
                        {errors.parentName && <div className="invalid-feedback">{errors.parentName}</div>}
                      </div>
                            </div>
                          </div>
                          {/* Parent Email */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Email <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="email"
                                  name="parentEmail"
                                  value={formData.parentEmail}
                                  onChange={handleChange}
                                  className={`form-control ${errors.parentEmail ? 'is-invalid' : ''}`}
                        />
                        {errors.parentEmail && <div className="invalid-feedback">{errors.parentEmail}</div>}
                      </div>
                            </div>
                          </div>
                          {/* Parent Phone */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Phone <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="text"
                                  name="parentPhone"
                                  value={formData.parentPhone}
                                  onChange={handleChange}
                                  className={`form-control ${errors.parentPhone ? 'is-invalid' : ''}`}
                        />
                        {errors.parentPhone && <div className="invalid-feedback">{errors.parentPhone}</div>}
                      </div>
                            </div>
                          </div>
                          {/* Add other necessary fields here */}
                        </div>
                      </div>
                    </div>
                  </div>
                   {/* Availability */}
                   <div className="mb-3">
                    <h6
                      className="mb-lg-0"
                      id="heading-3"
                    >
                      AVAILABLE TIME SLOTS
                    </h6>
                    <p>Please select at least 3 disponibilité !</p>
                    <div
                      
                    >
                      <div className=" mt-3">
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
                      ${
                        !isSelectable(day, startHour, parseInt(startMinute))
                          ? "non-selectable-cell"
                          : ""
                      }
                      ${
                        selectedTimeSlots.some(
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
                </div>
              </div>
            </div>
          </div>
          {/* Submit button */}
          <div className="mt-4 text-center">
            <button type="submit" className="btn btn-primary">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

