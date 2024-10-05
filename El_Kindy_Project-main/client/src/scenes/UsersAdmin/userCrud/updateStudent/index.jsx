import React, { useEffect, useState } from "react";
import { getAllClasses } from "services/classesService/api";
import { updateStudent } from "services/usersService/api";
import "../../../../App.css";
import { getAllCourses } from "services/courseService/api";
import { axiosPrivate } from "api/axios";

function UpdateStudent({ student, onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    classLevel: "", // Add classLevel for student
    coursesEnrolled: [],
    dateOfBirth: "",
    address: "",
    gender: "",
    phoneNumber1: "",
    phoneNumber2: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    disponibilite: [], // Availability slots
  });

  useEffect(() => {
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      password: student.passwordDecoded || "",
      classLevel: student.studentInfo?.classLevel?._id || "", // Add classLevel for student
      coursesEnrolled:
        student.studentInfo?.coursesEnrolled?.map((course) => course._id) || [],
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
      address: student.address || "",
      gender: student.gender || "",
      phoneNumber1: student.phoneNumber1 || "",
      phoneNumber2: student.phoneNumber2 || "",
      parentName: student.studentInfo?.parentName || "",
      parentEmail: student.studentInfo?.parentEmail || "",
      parentPhone: student.studentInfo?.parentPhone || "",
      disponibilite: student.disponibilite || [], // Availability slots
    });
    setSelectedTimeSlots(student.disponibilite || []);
    setFormChanged(false); // Reset form changed state
  }, [student]);

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

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses(axiosPrivate);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await getAllClasses(axiosPrivate);

        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchCourses();
    fetchClasses();
  }, []);

  console.log("classes",classes);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "coursesEnrolled") {
      const selectedValue = value;
      const isChecked = checked;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: isChecked
          ? [...prevFormData[name], selectedValue]
          : prevFormData[name].filter((id) => id !== selectedValue),
      }));
      setFormChanged(true); // Set form changed state to true
      validateField(name, value);

    } else {
      setFormData({ ...formData, [name]: value });
      setFormChanged(true); // Set form changed state to true
      validateField(name, value);

    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        error = value.trim() === "" ? "Please enter student first name!" : "";
        break;
      case "lastName":
        error = value.trim() === "" ? "Please enter student last name!" : "";
        break;
      case "email":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid email address!";
        break;
      case "password":
        error =
          value.length < 6
            ? "Password must be at least 6 characters long!"
            : "";
        break;
      case "address":
        error =
          value.trim() === "" || value.length < 6
            ? "Please enter student full address !"
            : "";
        break;
      case "classLevel":
        error =
          formData.classLevel.length === 0
            ? "Please enter student class level !"
            : "";
        break;
      case "dateOfBirth":
        // Calculate 3 years ago date
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 3);
        const selectedDate = new Date(value);
        error =
          selectedDate > minDate || value.trim() === ""
            ? "Date of birth must be at least 3 years ago!"
            : "";
        break;
      case "gender":
        error = value === "" ? "Please select student gender!" : "";
        break;
      case "phoneNumber1":
        error =
          /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(
            value
          )
            ? ""
            : "Please enter a valid phone number!";
        break;
      case "phoneNumber2":
        // Validate phone number 2 only if a value is provided
        if (value.trim() !== "") {
          error =
            /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(
              value
            )
              ? ""
              : "Please enter a valid phone number!";
        }
        break;
      case "parentName":
        error = value.trim() === "" ? "Please enter parent name!" : "";
        break;
      case "parentEmail":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid parent email address!";
        break;
      case "parentPhone":
        error =
          /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(
            value
          )
            ? ""
            : "Please enter a valid parent phone number!";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } else {
      try {
        const response = await updateStudent(student._id, formData);
        if (response.status === 200) {
          console.log("Student updated successfully!");
          onClose();
          fetchData();
        } else {
          console.error("Error updating student:", response.data);
        }
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  // Include the code for handling time slots here...
  const isFormDisabled = () => {
    // Check if any field in the form data is different from the corresponding field in the original user data
    return Object.keys(formData).every((key) => formData[key] === student[key]);
  };

  return (
    <div className="page-content-wrapper border">
      <div className="container position-relative">
        <button
          className="btn btn-link text-danger position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ fontSize: "1.3rem" }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <h5 className="font-base">Update Student Info</h5>
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
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">
                          {errors.firstName}
                        </div>
                      )}
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
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">
                          {errors.lastName}
                        </div>
                      )}
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
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
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
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Class Level */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">Class Level</h6>
                    </div>
                    <div className="col-lg-8">
                      <select
                        name="classLevel"
                        value={formData.classLevel}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.classLevel ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select class</option>
                        {classes?.map((classItem) => (
                          <option key={classItem?._id} value={classItem?._id}>
                            {classItem?.className}
                          </option>
                        ))}
                      </select>{" "}
                      {errors.classLevel && (
                        <div className="invalid-feedback">
                          {errors.classLevel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Courses Enrolled */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Courses Enrolled <span className="text-danger">*</span>
                      </h6>
                      <p>Please select at least one course!</p>
                    </div>
                    <div className="col-lg-8">
                      <div className="row row-cols-3">
                        {courses?.map((course) => (
                          <div key={course?._id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={course?._id}
                              value={course?._id}
                              checked={formData.coursesEnrolled?.includes(
                                course?._id
                              )}
                              onChange={handleChange}
                              name="coursesEnrolled"
                            />
                            <label
                              className="form-check-label"
                              htmlFor={course?._id}
                            >
                              {course?.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Date of Birth */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Date of Birth <span className="text-danger">*</span>
                      </h6>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.dateOfBirth ? "is-invalid" : ""
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <div className="invalid-feedback">
                          {errors.dateOfBirth}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Address <span className="text-danger">*</span>
                      </h6>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                      />
                      {errors.address && (
                        <div className="invalid-feedback">
                          {errors.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Gender */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Gender <span className="text-danger">*</span>
                      </h6>
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
                        className={`form-control ${
                          errors.phoneNumber1 ? "is-invalid" : ""
                        }`}
                      />
                      {errors.phoneNumber1 && (
                        <div className="invalid-feedback">
                          {errors.phoneNumber1}
                        </div>
                      )}
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
                        className={`form-control ${
                          errors.phoneNumber2 ? "is-invalid" : ""
                        }`}
                      />
                      {errors.phoneNumber2 && (
                        <div className="invalid-feedback">
                          {errors.phoneNumber2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Parent Name */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Parent Name <span className="text-danger">*</span>
                      </h6>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.parentName ? "is-invalid" : ""
                        }`}
                      />
                      {errors.parentName && (
                        <div className="invalid-feedback">
                          {errors.parentName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Parent Email */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Parent Email <span className="text-danger">*</span>
                      </h6>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.parentEmail ? "is-invalid" : ""
                        }`}
                      />
                      {errors.parentEmail && (
                        <div className="invalid-feedback">
                          {errors.parentEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Parent Phone */}
                <div className="col-12">
                  <div className="row g-xl-0 align-items-center">
                    <div className="col-lg-4">
                      <h6 className="mb-lg-0">
                        Parent Phone <span className="text-danger">*</span>
                      </h6>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="text"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.parentPhone ? "is-invalid" : ""
                        }`}
                      />
                      {errors.parentPhone && (
                        <div className="invalid-feedback">
                          {errors.parentPhone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Availability */}
                <div className="mb-3">
                  <h6 className="mb-lg-0" id="heading-3">
                    AVAILABLE TIME SLOTS <span className="text-danger">*</span>
                  </h6>
                  <p>Please select at least 3 disponibilité !</p>

                  <div>
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
                              const startHour = Math.floor(index / 2) + 10;
                              const startMinute = index % 2 === 0 ? "00" : "30";
                              const endHour = Math.floor((index + 1) / 2) + 10;
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
                                        handleCellClick(day, startTime, endTime)
                                      }
                                      onMouseEnter={() =>
                                        isSelectable(
                                          day,
                                          startHour,
                                          parseInt(startMinute)
                                        ) &&
                                        handleCellHover(day, startTime, endTime)
                                      }
                                      onMouseDown={() => setIsMouseDown(true)}
                                      onMouseUp={() => setIsMouseDown(false)}
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
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formChanged || isFormDisabled()}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateStudent;
