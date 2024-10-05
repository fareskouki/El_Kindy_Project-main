import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import NavBar from 'components/NavBar';
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import Footer from 'components/Footer';

function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const [showCourses, setShowCourses] = useState({});
  const [showGrades, setShowGrades] = useState({});

  const studentId = accessToken ? jwtDecode(accessToken).id : '';

  const fetchCourses = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/getCoursesByStudent/${studentId}`);
      setShowCourses((prevCourses) => ({ ...prevCourses, [studentId]: response.data }));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchGrades = async (studentId, courseId) => {
    try {
      const response = await axios.get(`http://localhost:3001/grades/getGradesByStudentAndCourse/${studentId}/${courseId}`);
      setShowGrades((prevGrades) => ({ ...prevGrades, [courseId]: response.data }));
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const toggleCourses = async (studentId) => {
    if (showCourses[studentId]) {
      setShowCourses((prevCourses) => ({ ...prevCourses, [studentId]: false }));
    } else {
      await fetchCourses(studentId);
    }
  };

  useEffect(() => {
    toggleCourses(studentId);
  }, [accessToken]);

  useEffect(() => {
    // Fetch grades for each course
    Object.keys(showCourses).forEach((studentId) => {
      showCourses[studentId].forEach((course) => {
        fetchGrades(studentId, course._id);
      });
    });
  }, [showCourses]); // Update grades when showCourses changes

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <NavBar />
        <TopBarTeacherStudent />
        {/* =======================
                    Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarStudent />
              <div className="container col-md-8 mt-3">
                <div className="col-xl-9">
                  <div className="card border bg-transparent rounded-3">
                    <div className="card-header bg-transparent border-bottom">
                      <h3 className="mb-0">Student Grade Dashboard</h3>
                      <div className="table-responsive border-0">
                        <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
<tbody>
  <tr>
    <th>Course</th>
    <th>Grade</th>
  </tr>
  {Object.keys(showCourses).map((studentId) =>
    showCourses[studentId] ? (
      showCourses[studentId].map((course) => (
        <tr key={course._id}>
          <td>{course.title}</td>
          <td>
            {showGrades[course._id] && showGrades[course._id].length > 0 ? (
              showGrades[course._id].map((grade) => (
                <span key={grade._id}>{grade.grade}</span>
              ))
            ) : (
              <span>Grade not available</span>
            )}
          </td>
        </tr>
      ))
    ) : null
  )}
</tbody>

                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
      <Footer />
    </div>
  );
}

export default Index;
