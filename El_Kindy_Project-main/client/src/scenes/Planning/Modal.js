import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({
  onClose,
  onSave,
  onDelete,
  eventDetails,
  teachers,
  courses,
}) => {
  const isEditing = eventDetails._id; // Check if eventDetails has an id to determine if it's for editing
  const [selectedStudentId, setSelectedStudentId] = useState(
    eventDetails.studentId || ""
  );

  const [course, setCourse] = useState({
    id: eventDetails.id || null,
    title: eventDetails.title || "",
    courseId: eventDetails.courseId || "",
    roomId: eventDetails.resourceId || "",
  });
  const [formData, setFormData] = useState({
    title: eventDetails.title || "",
    start: null,
    end: null,
    resourceId: eventDetails.resourceId || null,
    teacherId: eventDetails.teacherId || null,
    courseId: eventDetails.courseId || null,
    classId: eventDetails.classId || null,
    studentId: eventDetails.studentId || null,
  });

  const [errors, setErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState(""); // State to track the selected option

  const [selectedClassId, setSelectedClassId] = useState(
    eventDetails.classId || ""
  );
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "courseId":
        // Validation for course selection field
        error = value === "" ? "Please select a course!" : "";
        break;
      case "teacherId":
        // Validation for teacher selection field
        error = value === "" ? "Please select a teacher!" : "";
        break;
      // Add more validation cases as needed
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Call the validation function for the modified field
    validateField(name, value);
  };

  const [color, setColor] = useState(eventDetails.color || "#000000");
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    eventDetails.teacherId || ""
  );

  const [selectedRoomId, setSelectedRoomId] = useState(
    eventDetails.resourceId || ""
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    eventDetails.courseId || ""
  );
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  
  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const rooms = eventDetails.rooms || []; // Retrieve the list of rooms from eventDetails
  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    const isValidRoom = rooms.find((room) => room._id === roomId);
    if (isValidRoom) {
      setSelectedRoomId(roomId);
    } else {
      alert(
        "The selected room does not exist. Please select a valid room."
      );
    }
  };
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const isValidCourse = courses.data.find(
      (course) => course._id === courseId
    );
    if (isValidCourse) {
      setSelectedCourseId(courseId);
    } else {
      alert(
        "The selected course does not exist. Please select a valid course."
      );
    }
  };

  const handleDelete = () => {
    console.log(eventDetails._id);
    onDelete(eventDetails.id); // Call the onDelete function with the event ID to delete
    onClose(); // Close the Modal after deletion
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourse((prevState) => ({
      ...prevState,
      courseId: value,
    }));
  };

  const handleTeacherChange = (e) => {
    const selectedTeacherId = e.target.value;
    setSelectedTeacherId(selectedTeacherId);
  
    // Validate the selected teacher ID
    const error = selectedTeacherId === "" ? "Please select a teacher!" : "";
    setErrors((prevErrors) => ({ ...prevErrors, teacherId: error }));
  
    // Call a function to fetch classes taught by the selected teacher
    getClassesByTeacher(selectedTeacherId);
    getStudentByTeacher(selectedTeacherId);
  };
  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  const getStudentByTeacher = (teacherId) => {
    axios
      .get(`http://localhost:3001/auth/getAllUserByRole/teacher`)
      .then((response) => {
        console.log("Response Data:", response.data);
        const teachers = response.data.data; // Assuming response.data contains the array of teachers

        // Find the selected teacher by their ID
        const selectedTeacher = teachers.find(
          (teacher) => teacher._id === teacherId
        );
        console.log("Selected Teacher:", selectedTeacher);

        // Check if the selected teacher is found
        if (selectedTeacher) {
          const studentsTaught = selectedTeacher.teacherInfo.studentsTaught;
          // Assuming studentsTaught is an array of student objects
          setStudents(studentsTaught); // Update the students state
          console.log(
            "Students taught by the selected teacher:",
            studentsTaught
          );
        } else {
          console.error("Selected teacher not found");
        }
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching teacher information",
          error
        );
      });
  };

  const getClassesByTeacher = (teacherId) => {
    axios
      .get(`http://localhost:3001/auth/getAllUserByRole/teacher`)
      .then((response) => {
        const teachers = response.data.data; // Assuming response.data contains the array of teachers

        // Find the selected teacher by their ID
        const selectedTeacher = teachers.find(
          (teacher) => teacher._id === teacherId
        );

        // Check if the selected teacher is found
        if (selectedTeacher) {
          const classesTaught = selectedTeacher.teacherInfo.classesTeaching;
          setClasses(classesTaught); // Update the classes state
          console.log("Classes taught by the selected teacher:", classesTaught);
        } else {
          console.error("Selected teacher not found");
        }
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching teacher information",
          error
        );
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    for (let [key, value] of Object.entries(formData)) {
      validateField(key, value);
    }
  
    // Check for errors
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }
  
    // Check if a course is selected
    if (!selectedCourseId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        courseId: "Please select a course!",
      }));
      return;
    }
  
    // Check if a teacher is selected
    if (!selectedTeacherId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        teacherId: "Please select a teacher!",
      }));
      return;
    }
  
    // Check if the selected room exists
    const isValidRoom = rooms.find((room) => room._id === selectedRoomId);
    if (!isValidRoom) {
      alert("The selected room does not exist. Please select a valid room.");
      return;
    }
  
    // Submit data
    const updatedEvent = {
      ...eventDetails,
      ...course,
      title: selectedCourseId.title,
      color,
      teacherId: selectedTeacherId,
      studentId: selectedStudentId || null,
      resourceId: selectedRoomId,
      courseId: selectedCourseId,
      classId: selectedClassId || null,
    };
  
    onSave(updatedEvent);
  };
  

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "400px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>
            {isEditing ? "Edit Schedule" : "Add Schedule"}
          </h2>
        </div>
       
       
       <label style={{ marginBottom: "16px", display: "block" }}>
  Select a course:
</label>
<select
  className={`form-select ${errors.courseId ? 'is-invalid' : ''}`}
  value={selectedCourseId}
  onChange={handleCourseChange}
  style={{
    marginBottom: "16px",
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  }}
>
  <option value="">-- Select a course --</option>
  {courses.data.map((course) => (
    <option key={course._id} value={course._id}>
      {course.title}
    </option>
  ))}
</select>


        <label style={{ marginBottom: "16px", display: "block" }}>
          Select a room:
        </label>
        <select
          value={selectedRoomId}
          onChange={handleRoomChange}
          style={{
            marginBottom: "16px",
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">-- Select a room --</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name}
            </option>
          ))}
        </select>

        <select
  className={`form-select ${errors.teacherId ? 'is-invalid' : ''}`}
  value={selectedTeacherId}
  onChange={handleTeacherChange}
  style={{
    marginBottom: "16px",
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  }}
>
  <option value="">-- Choose a teacher --</option>
  {teachers.map((teacher) => (
    <option key={teacher._id} value={teacher._id}>
      {teacher.firstName} {teacher.lastName}
    </option>
  ))}
</select>


        <label style={{ marginBottom: "16px", display: "block" }}>
          Select a student:
        </label>

        <div style={{ marginBottom: "16px" }}></div>

        <div>
          <input
            type="radio"
            id="classOption"
            value="class"
            checked={selectedOption === "class"}
            onChange={handleOptionChange}
            className={`form-check-input ${errors ? 'is-invalid' : ''}`}
          />
          <label htmlFor="classOption" style={{ marginLeft: "4px" }}>
            Select by class
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="studentOption"
            value="student"
            checked={selectedOption === "student"}
            onChange={handleOptionChange}
            className={`form-check-input ${errors ? 'is-invalid' : ''}`}
          />
          <label htmlFor="studentOption" style={{ marginLeft: "4px" }}>
            Select by student
          </label>
        </div>
        <div style={{ color: "red", marginTop: "8px" }}>
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>

        <div style={{ marginBottom: "16px" }}></div>

        {selectedOption === "class" && (
          <select
            value={selectedClassId}
            onChange={handleClassChange}
            style={{
              marginBottom: "16px",
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Select a class --</option>
            {classes.map((classe) => (
              <option key={classe._id} value={classe._id}>
                {classe.className}
              </option>
            ))}
          </select>
        )}

        {selectedOption === "student" && (
          <select
            value={selectedStudentId}
            onChange={handleStudentChange}
            style={{
              marginBottom: "16px",
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Choose a student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        )}

        <label style={{ marginTop: "16px", display: "block" }}>
          Choose a color:
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginTop: "8px", display: "block" }}
        />
        <div style={{ marginTop: "8px" }}></div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            marginRight: "8px",
          }}
        >
          {isEditing ? "Edit" : "Add"}
        </button>

        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            marginRight: "8px",
          }}
        >
          Cancel
        </button>

        {isEditing && (
          <button
            onClick={handleDelete}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              marginRight: "8px",
            }}
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
};

export default Modal;
