import React, { useEffect, useState } from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import NavBar from "components/NavBar";
import axios from "api/axios";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import Footer from 'components/Footer';
import useAxiosPrivate from "hooks/useAxiosPrivate";
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"></script>

function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const [classes, setClasses] = useState([]);
  const [showCourses, setShowCourses] = useState({});
  const [showStudents, setShowStudents] = useState({});
  const [ficheEleves, setFicheEleves] = useState([]);
  const [showFicheEleve, setShowFicheEleve] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = accessToken ? jwtDecode(accessToken).id : "";
        const response = await axios.get(`/auth/getClassesTaughtByTeacher/${userId}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    if (accessToken) {
      fetchClasses();
    }
  }, [accessToken]);

  const fetchCourses = async (userId, classId) => {
    console.log('classId',classId);
    console.log('userId',userId);
    try {
      const response = await axios.get(`/auth/getCoursesTaughtByTeacherInClass/${userId}/${classId}`);
      console.log('ccccccccc',response.data);
      setClasses(prevClasses =>
        prevClasses.map(classItem =>
          classItem._id === classId ? { ...classItem, courses: response.data } : classItem
        )
      );
      setShowCourses(prevCourses => ({ ...prevCourses, [classId]: true }));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async (classId, courseId) => {
    try {
      const response = await axios.get(`/auth/getStudentsInClassByCourseAndClass/${classId}/${courseId}`);
      setShowStudents(prevStudents => ({
        ...prevStudents,
        [classId]: {
          ...prevStudents[classId],
          [courseId]: response.data
        }
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const affectFicheEleve = async (student, course, classId, date, duration, content, observation) => {
    try {
      // Check if the student already has 32 ficheeleve
      const response = await axios.get(`/ficheEleve/getFicheElevesByStudent/${student}`);
      if (response.data.length >= 32) {
        console.error('Error creating FicheEleve: Maximum number of ficheeleve reached for this student');
        // TODO: Show an error message to the user
        alert("Maximum number of ficheeleve reached for this student ");
        return; // Return early if the maximum number of ficheeleve is reached
      }
  
      // Make a POST request to your API endpoint
      const createResponse = await axios.post('/ficheEleve/affectFicheEleve', {
        student: student,
        course: course,
        classId: classId,
        date: date,
        duration: duration,
        content: content,
        observation: observation
      });
  
      // Check if the request was successful
      if (createResponse.status === 201) {
        console.log('FicheEleve created successfully');
      } else {
        console.error('Error creating FicheEleve:', createResponse.data.message);
      }
    } catch (error) {
      console.error('Error creating FicheEleve:', error);
    }
  };
  

  // Handle the form submission
// Handle the form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const student = formData.get('studentId');
  const courseId = formData.get('courseId');
  const classId = formData.get('classId');
  const date = formData.get('date');
  const duration = formData.get('duration');
  const content = formData.get('content');
  const observation = formData.get('observation');

  await affectFicheEleve(student, courseId, classId, date, duration, content, observation);
  setPopupVisible(false); // Hide the modal
  fetchFicheEleveByStudent(student,courseId); // Refresh the list of student grades
};

 //delete fiche eleve by id
 const deleteFicheEleve = async (ficheEleveId, studentId, courseId) => {
  try {
    const response = await axios.delete(`/ficheEleve/deleteFicheEleve/${ficheEleveId}`);
    console.log(response.data);
    
    // Update the state to remove the deleted ficheEleve
    setFicheEleves(prevFicheEleves =>
      prevFicheEleves.filter(ficheEleve => ficheEleve._id !== ficheEleveId)
    );

    // You may also want to fetch the updated list of ficheEleves here
     fetchFicheEleveByStudent(studentId, courseId);
  } catch (error) {
    console.error('Error deleting ficheEleve:', error);
  }
};



const fetchFicheEleveByStudent = async (studentId, courseId) => {
  try {
      const response = await axios.get(`/ficheEleve/getFicheEleveByStudentAndCourse/${studentId}/${courseId}`);
      setFicheEleves(response.data);
    } catch (error) {
      console.error('Error fetching ficheEleves:', error);
    }
  };

 


  const toggleCourses = async (userId, classId, courseId) => {
    if (showCourses[classId]) {
      // Close the currently open course if it's not the same as the one being clicked
      setShowCourses(prevCourses => ({ ...prevCourses, [classId]: false }));
    } else {
      // Close any other open courses
      Object.keys(showCourses).forEach(key => {
        if (showCourses[key]) {
          setShowCourses(prevCourses => ({ ...prevCourses, [key]: false }));
        }
      });
  
      await fetchCourses(userId, classId);
      fetchStudents(classId, courseId);
    }
  };
  
  const toggleStudents = async (userId, classId, courseId, studentId) => {
    if (showStudents[classId]) {
      setShowStudents(prevStudents => ({ ...prevStudents, [classId]: false }));
      setFicheEleves([]);
      setShowFicheEleve(false);
      setSelectedStudent(null); // Reset the selected student
    } else {
      fetchStudents(classId, courseId);
      await fetchFicheEleveByStudent(studentId ,courseId);
      setShowFicheEleve(true);
      setPopupVisible(true); // Show the modal
      setSelectedStudent(studentId); // Set the selected student
    }
  };
  

  const closeFicheEleve = () => {
    setShowFicheEleve(false);
    setFicheEleves([]);
    setSelectedStudent(null); // Reset the selected student
  };
  

  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
      <div className="container">
        <div className="row">
          <SideBarTeacher />
            <div class="col-xl-9">
              <div class="card border bg-transparent rounded-3">
                <div class="card-header bg-transparent border-bottom">
                  <h3 class="mb-0">Student Sheet Dashboard</h3>
                  <div class="table-responsive border-0">
                    <table class="table table-dark-gray align-middle p-4 mb-0 table-hover">
                      <thead>
                        <tr>
                          <th scope="col" className="border-0 rounded-start">Class Name </th>
                          <th scope="col" className="border-0">Show Courses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((classItem) => (
                          <tr key={classItem._id}>
                            <td>{classItem.className}</td>
                            <td>
                              <button className="btn btn-sm btn-success-soft btn-round me-1 mb-0 ml-3" onClick={() => toggleCourses(accessToken ? jwtDecode(accessToken).id : "", classItem._id, classItem.courseId)}>
                                <i className="fas fa-fw fa-eye"></i>
                                <span className="visually-hidden">
                                  {showCourses[classItem._id] ? 'Hide Courses' : 'Show Courses'}
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {Object.keys(showCourses).map((classId) => (
                      showCourses[classId] && (
                        <div key={classId}>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Course Name</th>
                                <th>Show Students</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classes.find((classItem) => classItem._id === classId).courses.map((course, index) => (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td><strong>{course.title}</strong></td>
                                    <td>
                                      <button className="btn btn-sm btn-success-soft btn-round me-1 mb-0" onClick={() => toggleStudents(accessToken ? jwtDecode(accessToken).id : "", classId, course._id)}>
                                        <span>
                                          <i className="fas fa-fw fa-eye"></i>
                                        </span>
                                        <span className="visually-hidden">
                                          {showStudents[classId] ? 'Hide Students' : 'Show Students'}
                                        </span>
                                      </button>
                                    </td>
                                  </tr>
                                  {showStudents && showStudents[classId] && showStudents[classId][course._id] && (
                                    <tr>
                                      <td colSpan="3">
                                        <table className="table table-striped">
                                          <thead>
                                            <tr>
                                              <th>First Name</th>
                                              <th>Last Name</th>
                                              <th>Student Sheets</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {showStudents[classId][course._id].map((student, index) => (
                                              <tr key={index}>
                                                <td>{student.firstName}</td>
                                                <td>{student.lastName}</td>
                                                <td>
                                                  <button
                                                    className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                                    onClick={() => fetchFicheEleveByStudent(student._id,course._id)}
                                                  >
                                                    <i className="fas fa-fw fa-eye"></i>
                                                  </button>

                                                  <a href="#" class="fas fa-fw fa-plus"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#addQuestion"
                                                    data-student-id="{studentId}"
                                                    data-course-id="{courseId}"
                                                    data-class-id="{classId}">
                                                  </a>
                                                  <div className="modal fade" id="addQuestion" tabIndex={-1} aria-labelledby="addQuestionLabel" aria-hidden="true" data-bs-backdrop="false">                                                  <div className="modal-dialog">
                                                  <div className="modal-content">
                                                    <div className="modal-header bg-dark">
                                                      <h5 className="modal-title text-white" id="addQuestionLabel">Add Student Sheet</h5>
                                                      <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                                                    </div>
                                                    <div className="modal-body">
                                                      <form onSubmit={handleFormSubmit} className="row text-start g-3">
                                                        <div className="col-6">
                                                          <h5> {student.lastName} {student.firstName}</h5>
                                                        </div>
                                                        <div className="col-6">
                                                          <h5>{course.title}</h5>
                                                        </div>
                                                        <input className="form-control" name="studentId" type="hidden" value={student._id} />
                                                        <input className="form-control" name="courseId" type="hidden" value={course._id} />
                                                        <input className="form-control" name="classId" type="hidden" value={classId} />

                                                        <div className="col-6">
                                                          <label className="form-label">Date</label>
                                                          <input className="form-control" name="date" type="date" placeholder="Enter Date" required />
                                                        </div>
                                                        <div className="col-6">
                                                          <label className="form-label">Duration</label>
                                                          <select className="form-select" name="duration" required>
                                                            <option value="" disabled selected>Select an option</option>
                                                            <option value="0.5">0.5h</option>
                                                            <option value="1">1h</option>
                                                            <option value="1.5">1.5h</option>
                                                            <option value="2">2h</option>
                                                            <option value="2.5">2.5h</option>
                                                            <option value="3">3h</option>
                                                          </select>
                                                        </div>

                                                        <div className="col-6">
                                                          <label className="form-label">Content</label>
                                                          <select className="form-select" name="content" required>
                                                            <option value="" disabled selected>Select an option</option>
                                                            <option value="Present">Present</option>
                                                            <option value="Absent">Absent</option>
                                                          </select>
                                                        </div>

                                                        <div className="col-6">
                                                          <label className="form-label">Observation</label>
                                                          <select className="form-select" name="observation" required>
                                                            <option value="" disabled selected>Select an option</option>
                                                            <option value="mauvais">Mauvais</option>
                                                            <option value="assez bien">Assez Bien</option>
                                                            <option value="bien">Bien</option>
                                                            <option value="tres bien">Très Bien</option>
                                                            <option value="excellent">Excellent</option>
                                                          </select>
                                                        </div>

                                                        <div className="modal-footer">
                                                          <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                                                          <button className="btn btn-success my-0" type="submit">Add Student Sheet</button>
                                                        </div>
                                                      </form>
                                                    </div>

                                                  </div>
                                                </div>
                                                </div>

                                                  <button
                                                    className="btn btn-sm btn-danger-soft btn-round ml-1 mb-0"
                                                    onClick={closeFicheEleve}
                                                  >
                                                    <i className="fas fa-fw fa-times"></i>
                                                  </button>
                                                 
                                                </td>
                                               
                                              </tr>

                                            ))}
                                          </tbody>
                                        </table>
                                        {ficheEleves.length > 0 && (
  <div className="col-lg-9">
    <div className="card bg-transparent border rounded-3">
      <div className="card-header bg-transparent border-bottom">
        <h5 className="card-header-title mb-0">Student Sheet </h5>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr className="card-header-title mb-0">
              <th>Date</th>
              <th>Duration</th>
              <th>Content</th>
              <th>Observation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ficheEleves.map((ficheEleve, index) => (
              <tr key={index}>
                <td>{ficheEleve.date}</td>
                <td>{ficheEleve.duration}</td>
                <td>{ficheEleve.content}</td>
                <td>{ficheEleve.observation}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger-soft btn-round ml-1 mb-0"
                    onClick={() => deleteFicheEleve(ficheEleve._id)}
                  >
                    <i className="fas fa-fw fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

                                      </td>
                                    </tr>

                                  )}
                                </React.Fragment>

                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    ))}
                </div>
                
              </div>
              
            </div>
          </div>
        </div>
        <Footer />
      </div>




    </div>
  );
}

export default Index;
