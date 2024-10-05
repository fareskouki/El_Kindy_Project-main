import useAxiosPrivate from 'hooks/useAxiosPrivate';
import React, { useEffect, useState } from 'react';
import { getAllClasses } from 'services/classesService/api';
import { getAllCourses } from 'services/courseService/api';
import { addTeacher, getUsers } from 'services/usersService/api';

function AddTeacher({ onClose, fetchData }) {

  const axiosPrivate = useAxiosPrivate();

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    coursesTaught: [],
    classesTeaching: [], // Add classesTeaching
    studentsTaught: [], // Add studentsTaught field
    dateOfBirth: '',
    address: '',
    gender: '',
    phoneNumber1: '',
    phoneNumber2: '',
    qualifications: '',
    experienceYears: 0,
    disponibilite: [],
  });

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  // State to hold the list of students
  const [students, setStudents] = useState([]);
  // Validation errors state
  const [errors, setErrors] = useState({});

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

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Make an API call to fetch students data
         const response = await getUsers("student");
        // Set the fetched students data to the state
        setStudents(response.data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  


  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'coursesTaught') {
      const selectedCourseId = value;
      const isChecked = checked;
      if (isChecked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesTaught: [...prevFormData.coursesTaught, selectedCourseId],
        }));
        validateField(name, value);

        
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesTaught: prevFormData.coursesTaught.filter((id) => id !== selectedCourseId),
        }));
        validateField(name, value);

      }
    } else if (name === 'classesTeaching') {
      const selectedClassId = value;
      const isChecked = checked;
      if (isChecked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          classesTeaching: [...prevFormData.classesTeaching, selectedClassId],
        }));
        validateField(name, value);

      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          classesTeaching: prevFormData.classesTeaching.filter((id) => id !== selectedClassId),
        }));
        validateField(name, value);

      }
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  // Function to handle changes in selected students
  const handleStudentChange = (e) => {
    const { value, checked } = e.target;
    const selectedStudentId = value;

    if (checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        studentsTaught: [...prevFormData.studentsTaught, selectedStudentId],
      }));
      
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        studentsTaught: prevFormData.studentsTaught.filter(
          (id) => id !== selectedStudentId
        ),
      }));
    }
  };
  
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = value.trim() === '' ? 'Please enter teacher first name !' : '';
        break;
      case 'lastName':
        error = value.trim() === '' ? 'Please enter teacher last name !' : '';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address !';
        break;
      case 'password':
        error = value.length < 6 ? 'Password must be at least 6 characters long !' : '';
        break;
      case 'address':
        error = value.trim() === '' || value.length < 6 ? 'Please enter teacher full address !' : '';
        break;
      case 'gender':
        error = value === '' ? 'Please select teacher gender !' : '';
        break;
      case 'phoneNumber1':
        error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number !';
        break;
      case 'phoneNumber2':
        // Validate phone number 2 only if a value is provided
        if (value.trim() !== '') {
          error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number !';
        }
        break;
      case 'dateOfBirth':
        // Calculate 3 years ago date
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 3);
        const selectedDate = new Date(value);
        error = selectedDate > minDate ? 'Date of birth must be at least 3 years ago!' : '';
        break;
      case 'qualifications':
        error = value < 6 ? 'Please select teacher qualifications !' : '';
        break;
      case 'experienceYears':
        error = value < 0 ? 'Please select teacher experience years !' : '';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.disponibilite = selectedTimeSlots;
    //console.log("formData : ",formData);

    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        formErrors[key] = errors[key];
      }
    });
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    else{

    try {
      // Make API call to add teacher
      const response = await addTeacher(formData);
      if (response.status === 201) {
        console.log('Teacher added successfully!');
        // Close the form
        onClose();
        // Fetch data
        fetchData();
      } else {
        console.error('Error adding teacher:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
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

   // State for controlling the visibility of modals
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

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
                          {/* Courses taught */}
                    <div className="col-12">
                      <div className="row g-xl-0 align-items-center">
                        <div className="col-lg-4">
                          <h6 className="mb-lg-0">
                            Courses Taught{' '}
                            <span className="text-danger">*</span>
                          </h6>
                        </div>
                        <div className="col-lg-8">
                          <div className="row row-cols-3">
                            {courses.map((course) => (
                              <div key={course._id} className="col">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={course._id}
                                    name="coursesTaught"
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
                    {/* Classes Teaching */}
                    <div className="col-12">
                      <div className="row g-xl-0 align-items-center">
                        <div className="col-lg-4">
                          <h6 className="mb-lg-0">
                            Classes Teaching{' '}
                            <span className="text-danger">*</span>
                          </h6>
                        </div>
                        <div className="col-lg-8">
                          {classes.map((classItem) => (
                              <div key={classItem._id} className="form-check form-check-inline">
                                  <input
                                      type="checkbox"
                                      name="classesTeaching"
                                      value={classItem._id}
                                      checked={formData.classesTeaching.includes(classItem._id)}
                                      onChange={handleChange}
                                      className="form-check-input"
                                      id={classItem._id}
                                  />
                                  <label className="form-check-label" htmlFor={classItem._id}>
                                      {classItem.className}
                                  </label>
                              </div>
                          ))}
                      </div>

                      </div>
                    </div>

                    {/* Students taught */}
        <div className="col-12">
          <div className="row g-xl-0 align-items-center">
            <div className="col-lg-4">
              <h6 className="mb-lg-0">
                Students Taught{' '}
                <span className="text-danger">*</span>
              </h6>
            </div>
            <div className="col-lg-8">
              {students.map((student) => (
                <div key={student._id} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    name="studentsTaught"
                    value={student._id}
                    checked={formData.studentsTaught.includes(student._id)}
                    onChange={handleStudentChange}
                    className="form-check-input"
                    id={student._id}
                  />
                  <label className="form-check-label" htmlFor={student._id}>
                    {student.firstName} {student.lastName}
                  </label>
                </div>
              ))}
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
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
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
                  {/* Qualifications */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Qualifications</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleChange}
                          className={`form-control ${errors.qualifications ? 'is-invalid' : ''}`}
                        />
                        {errors.qualifications && <div className="invalid-feedback">{errors.qualifications}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Experience Years */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Experience Years</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="number"
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className={`form-control ${errors.experienceYears ? 'is-invalid' : ''}`}
                        />
                        {errors.experienceYears && <div className="invalid-feedback">{errors.experienceYears}</div>}
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
                  {/* Add other necessary fields here */}
                </div>
              </div>
            </div>
          </div>
          {/* Submit button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeacher;
