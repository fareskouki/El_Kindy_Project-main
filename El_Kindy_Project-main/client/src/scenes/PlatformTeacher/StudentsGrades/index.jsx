import React, { useEffect, useState } from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import NavBar from "components/NavBar";
import axios from "api/axios";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import Footer from 'components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

function Index() {

  const accessToken = useSelector((state) => state.accessToken);
  const [classes, setClasses] = useState([]);
  const [showCourses, setShowCourses] = useState({});
  const [showStudents, setShowStudents] = useState({});
  const [showGrades, setShowGrades] = useState({});
  const [editingGrade, setEditingGrade] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = accessToken ? jwtDecode(accessToken).id : "";
        const response = await axios.get(`/auth/getClassesTaughtByTeacher/${userId}`);
        console.log('Réponse de l\'API :', response.data);
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
    try {
      const response = await axios.get(`/auth/getCoursesTaughtByTeacherInClass/${userId}/${classId}`);
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

  const fetchGrades = async (courseId, classId) => {
    console.log("Fetching grades for courseId:", courseId, "and classId:", classId);
    try {
      const response = await axios.get(`/grades/getGradesByCourseAndClass/${courseId}/${classId}`);
      console.log("Grades response:", response.data);
      setShowGrades(prevGrades => ({
        ...prevGrades,
        [courseId]: {
          ...prevGrades[courseId],
          [classId]: response.data
        }
      }));

    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const affectGrade = async (studentId, courseId, grade, classId) => {
    console.log("Affect grade for studentId:", studentId, "courseId:", courseId, "grade:", grade, "classId:", classId);
    try {
      const response = await axios.post('/grades/affectGrade', { studentId, courseId, grade, classId });
      console.log("Grade affected successfully:", response.data);
      await fetchGrades(courseId, classId); // Fetch updated grades
      setEditingGrade(null); // Clear editing state
    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };

  const toggleCourses = async (userId, classId, courseId) => {
    if (showCourses[classId]) {
      setShowCourses(prevCourses => ({ ...prevCourses, [classId]: false }));
    } else {
      await fetchCourses(userId, classId);
      fetchStudents(classId, courseId);
    }
  };

  const toggleStudents = async (userId, classId, courseId) => {
    if (showStudents[classId]) {
      setShowStudents(prevStudents => ({ ...prevStudents, [classId]: false }));
    } else {
      fetchStudents(classId, courseId);
      await fetchGrades(courseId, classId);
    }
  };

  const handleFormSubmit = async (e, studentId, courseId, classId) => {
    e.preventDefault();
    try {
      // Your code to affect the grade
      await affectGrade(studentId, courseId, e.target.grade.value, classId);
      // Close the modal
      document.getElementById('addQuestion').classList.remove('show');
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < modalBackdrops.length; i++) {
        modalBackdrops[i].parentNode.removeChild(modalBackdrops[i]);
      }
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };
  


  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
      <div className="container">
        <div className="row">

          <SideBarTeacher />
          <div className=" col-md-9 mt-3">
            <div className="col-xl-9">
              <div className="card border bg-transparent rounded-3">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="mb-0">Student Grade Dashboard</h3>
                  <div className="table-responsive border-0">
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
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
                                              <th>Semester Grade</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {showStudents[classId][course._id].map((student, index) => {
                                              const grades = showGrades[course._id]?.[classId]?.filter(grade => grade.student === student._id);
                                              const grade = grades && grades.length > 0 ? grades[0].grade : 'N/A';
                                              return (
                                                <tr key={index}>
                                                  <td>{student.firstName}</td>
                                                  <td>{student.lastName}</td>
                                                  <td>
                                                    <span>{grade}</span>
                                                  </td>

                                                  <td>
                                                    <button
                                                      className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                                      data-bs-target="#addQuestion"
                                                      data-bs-toggle="modal"
                                                      onClick={() => {
                                                        if (editingGrade !== student._id) {
                                                          affectGrade(student._id, course._id, grade, classId);
                                                        }
                                                      }}
                                                    >
                                                      <i className="far fa-fw fa-edit"></i>
                                                    </button>
                                                    <div className="modal fade" id="addQuestion" tabIndex={-1} aria-labelledby="addQuestionLabel" aria-hidden="true" data-bs-backdrop="false">
                                                      <div className="modal-dialog">
                                                        <div className="modal-content">
                                                          <div className="modal-header bg-dark">
                                                            <h5 className="modal-title text-white" id="addQuestionLabel">Add Student Sheet</h5>
                                                            <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                                                          </div>
                                                          <div className="modal-body">
                                                            <form className="row text-start g-3" onSubmit={(e) => handleFormSubmit(e, student._id, course._id, classId)}>
                                                              <div className="col-6">
                                                                <h5>{student.lastName} {student.firstName}</h5>
                                                              </div>
                                                              <input className="form-control" name="studentId" type="hidden" value={student._id} />
                                                              <input className="form-control" name="courseId" type="hidden" value={course._id} />
                                                              <input className="form-control" name="classId" type="hidden" value={classId} />
                                                              <input type="text" name="grade" defaultValue={grade} />
                                                              <div className="modal-footer">
                                                                <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                                                                <button className="btn btn-success my-0" type="submit">Add Student Grade</button>
                                                              </div>
                                                            </form>
                                                          </div>

                                                        </div>
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
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
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Index;