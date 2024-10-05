import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useSelector } from 'react-redux';
import NavBar from 'components/NavBar';
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import Footer from 'components/Footer';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AssignmentsComponent = () => {
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    courseId: '',
    picturePath: null,
    description: '',
    type: '', // Ajoutez le champ type
    courseLevel: '', // Ajoutez le champ courseLevel
    deadline: 'withDeadline' // Ajoutez le champ deadline avec une valeur par défaut
});
  const accessToken = useSelector((state) => state.accessToken); // Récupérez le jeton d'accès du store Redux
  const decodeToken = accessToken ? jwtDecode(accessToken) : "";
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseImages, setCourseImages] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null); 
  const [deadlineInfo, setDeadlineInfo] = useState({ date: null, isPassed: false }); // Ajout de l'état pour la date de deadline

  const handleFileSelection = (e) => {
    setSelectedFile(e.target.files[0]); // Ensure this correctly sets the selected file
};

  const handleRemettreClick = (assignmentId, deadlineDate) => {
    setSelectedAssignmentId(assignmentId);
    const currentDateTime = new Date();
  
    // Convertir la date de la deadline en objet Date
    const deadlineDateTime = new Date(deadlineDate);
  
    if (currentDateTime < deadlineDateTime) {
      setDeadlineInfo({ date: deadlineDateTime, isPassed: false });
    } else {
      setDeadlineInfo({ date: deadlineDateTime, isPassed: true });
    }
  
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentsResponse = await axios.get(`http://localhost:3001/auth/assignments/${decodeToken.course}/${decodeToken.id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        setAssignments(assignmentsResponse.data);

        const teachersResponse = await axios.get('http://localhost:3001/auth/teachers');
        setTeachers(teachersResponse.data);

        const coursesResponse = await axios.get(`http://localhost:3001/auth/course/${decodeToken.id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        setCourses(coursesResponse.data);

        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, decodeToken.course, decodeToken.id]);

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const handleDownloadFile = async (filePath) => {
    try {
      const response = await axios.get(`http://localhost:3001/${filePath}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const handleFileChange = (e) => {
    setNewAssignment(prevState => ({
        ...prevState,
        picturePath: e.target.files[0]
    }));
};
const handleSubmitFile = async (assignmentId) => {
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  if (!assignment) {
    console.error("Assignment not found");
    return;
  }

  try {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append('picturePath', selectedFile); // Ensure correct field name
    formData.append('studentId', decodeToken.id); // Add studentId to the formData
console.log("asa",decodeToken.id)
    console.log("Assignment ID:", assignmentId);
    const response = await axios.post(`http://localhost:3001/api/submit/${assignmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set Content-Type explicitly
        'Authorization': `Bearer ${accessToken}`, // Add Authorization header
      },
    });

    console.log("Submit file response:", response);

    if (response.status === 200) {
      toast.success("File submitted successfully.");
      setSelectedFile(null);
      setShowModal(false);
    } else {
      console.error("Unexpected response status:", response.status);
      alert("Unexpected response from server. Please try again later.");
    }
  } catch (error) {
    console.error("Error submitting file:", error);
    alert("Failed to submit file. Please try again later.");
  }
};



  
  
  
  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption.value);
  };

  const courseOptions = courses.map(course => ({
    value: course._id,
    label: course.title
  }));

  const filteredAssignments = selectedCourse ? assignments.filter(assignment => assignment.courseId === selectedCourse) : assignments;

  return (
    <div>
      <NavBar />
      <TopBarTeacherStudent />
      <section className="pt-4">
        <div className="container">
          <div className="row">
            <SideBarStudent />
            <div className="col-xl-9">
              <Select
                options={courseOptions}
                onChange={handleCourseChange}
                value={courseOptions.find(option => option.value === selectedCourse)}
                placeholder="Sélect a course"
              />
              {filteredAssignments.map((assignment, index) => (
                <div key={assignment.id} className="assignment-section row align-items-center mb-4 border p-3">
                  <div className="col-md-3">
                    <div style={{ background: 'linear-gradient(rgba(236, 231, 225, 0.25), rgba(18, 91, 193, 0.93))' }}>
                      <img
                        src={courseImages[assignment.courseId] ? `http://localhost:3001/assets/${courseImages[assignment.courseId]}` : "assets/images/default-event.jpg"}
                        alt="Assignment image"
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div>
                      <h3 className="card-title"><a href={`http://localhost:3001/${assignment.picturePath}`} target="_blank">{assignment.title}</a></h3>
                      <ul className="list-inline mb-2">
                        <li className="list-inline-item h6 fw-light mb-1 mb-sm-0"><i className="far fa-clock text-danger me-2"></i>{new Date(assignment.createdAt).toLocaleString()}</li>
                        <li className="list-inline-item h6 fw-light"><i className="fas fa-signal text-success me-2"></i>{assignment.courseLevel}</li>
                        <li className="list-inline-item h6 fw-light">
                          {decodeToken.role === 'teacher' ? (
                            <i className="fas fa-chalkboard-teacher text-primary me-2"></i>
                          ) : (
                            assignment.deadline === 'withDeadline' && (
                              assignment.type === 'course' ? (
                                <i className="far fa-calendar-alt text-primary me-2"></i>
                              ) : (
                                <i className="fas fa-calendar-alt text-primary me-2"></i>
                              )
                            )
                          )}
                          {assignment.type === 'course' ? 'Course' : 'TP'}
                          {assignment.deadline === 'withDeadline' && assignment.type === 'tp' && (
                            <>
                              <span className="me-2">Deadline:</span>
                              <span>{new Date(assignment.deadlineDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <span className="me-2">Deadline Time:</span>
                              <span>{assignment.deadlineTime}</span>
                            </>
                          )}
                        </li>
                      </ul>
                      <div>
                        {assignment.type === 'tp' && (
                          <div>
                            <button onClick={() => handleRemettreClick(assignment._id, assignment.deadlineDate)} className="btn btn-primary-soft btn-sm mb-0">Remettre</button>
                            {/* Afficher le lien de téléchargement */}
                          {assignment.file && (
    <a href={`http://localhost:3001/assets/${assignment.file}`} download className="btn btn-primary-soft btn-sm mb-0 ms-2">Télécharger à nouveau</a>
)}

                          </div>
                        )}
                      </div>
                      <p>{assignment.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remettre un fichier</Modal.Title>
          <div className="deadline-info">
            {deadlineInfo.date && (
              <p>
                Deadline: {deadlineInfo.date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                {deadlineInfo.isPassed ? ' (Remis en retard)' : ' (Remettre)'}
              </p>
            )}
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Sélectionnez un fichier à soumettre</Form.Label>
              <div className="mb-3">
                            <label htmlFor="picture" className="form-label">Upload Assignment File (PDF)</label>
                            <input
    id="picture"
    className="form-control"
    type="file"
    name="picturePath"
    accept=".pdf" // Ensure this attribute is present
    onChange={handleFileSelection} // Check that the onChange event is correctly bound
/>
                        </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => handleSubmitFile(selectedAssignmentId)}>
            Soumettre
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
}

export default AssignmentsComponent;
