import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from 'components/NavBar';
import { Link, useNavigate } from 'react-router-dom'
import TopBarTeacherStudent from "components/TopBarTeacherStudent";
import SideBarTeacher from "components/SideBarTeacher";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";

function TeacherView() {
    const navigate = useNavigate();
    const [studentSubmissions, setStudentSubmissions] = useState([]);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [courseImages, setCourseImages] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [courseLevels, setCourseLevels] = useState([]);
    const [isTpSelected, setIsTpSelected] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const accessToken = useSelector((state) => state.accessToken);
  const decodeToken = accessToken ? jwtDecode(accessToken) : "";
  const StudentSubmissionDetails = ({ submission }) => {
    const [studentDetails, setStudentDetails] = useState(null);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (!submission) {
                    // If submission is undefined, return early
                    return;
                }
    
                console.log("hi", submission);
    
                // Utilize Promise.all to make requests for each student ID
                const detailsPromises = submission.map(async (sub) => {
                    console.log("hi", sub.studentId);
                    // Fetch student details
                    const studentDetails = await fetchStudentDetails(sub.studentId);
                    // Return an object containing both student details and the picture path
                    return {
                        ...studentDetails,
                        picturePath: sub.picturePath
                    };
                });
    
                // Wait for all requests to finish
                const details = await Promise.all(detailsPromises);
    
                console.log("Student IDs:", details);
    
                setStudentDetails(details);
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };
    
        fetchDetails();
    }, [submission]);
    

    return (
        <>
            <p>Student Name: {studentDetails ? `${studentDetails.map(student => `${student.firstName} ${student.lastName}`).join(', ')}` : 'Unknown'}</p>
            {/* Map over each submission and render a download link for each picturePath */}
            {submission.map((sub, index) => (
                <a key={index} href={`http://localhost:3001/assets/${sub.picturePath ? sub.picturePath.split('/').slice(-1)[0] : ''}`} download> Télécharger {index + 1}</a>
            ))}
        </>
    );
    
};

    // Créez une fonction de gestionnaire pour mettre à jour la date sélectionnée
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Créez une fonction de gestionnaire pour mettre à jour l'heure sélectionnée
    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };
    const handleStudentSubmissionsClick = async (assignmentId) => {
        try {
            const response = await fetchStudentSubmissions(assignmentId);
            if (Array.isArray(response)) {
                // La réponse est un tableau, donc nous l'utilisons directement
                setStudentSubmissions(response);
            } else if (typeof response === 'object') {
                // La réponse est un objet, donc nous le transformons en tableau
                setStudentSubmissions([response]);
            } else {
                // La réponse est invalide, nous affichons un message d'erreur
                console.error('Invalid response format:', response);
                toast.error('Invalid response format. Please try again.');
            }
            setShowSubmissionModal(true); // Ouvrez le modèle d'affichage des soumissions d'étudiants
        } catch (error) {
            console.error('Error fetching student submissions:', error);
            toast.error('Error fetching student submissions. Please try again.');
        }
    };
    
    
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        courseId: '',
        picturePath: null,
        description: '',
        type: '', // Ajoutez le champ type
        courseLevel: '', // Ajoutez le champ courseLevel
        deadline: 'withDeadline' // Ajoutez le champ deadline avec une valeur par défaut
    });

    useEffect(() => {
        fetchAssignments();
        fetchCourses();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };
    const fetchStudentSubmissions = async (assignmentId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/assignment/${assignmentId}`);
            if (response.data && typeof response.data === 'object') {
                // Si la réponse est un objet, transformez-la en tableau
                return [response.data];
            } else if (Array.isArray(response.data)) {
                // Si la réponse est déjà un tableau, utilisez-la directement
                return response.data;
            } else {
                // Si la réponse n'est ni un objet ni un tableau, renvoyez un tableau vide
                console.error('Invalid response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching student submissions:', error);
            return [];
        }
    };
    
    
    

    
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/course/all');
            const data = response.data.data;
            if (Array.isArray(data)) {
                setCourses(data);

                // Extract course levels from the courses data
                const levels = data.reduce((acc, course) => {
                    if (course.courseLevel && !acc.includes(course.courseLevel)) {
                        acc.push(course.courseLevel);
                    }
                    return acc;
                }, []);

                // Set courseLevels state with unique course levels
                setCourseLevels(levels);

                const images = {};
                data.forEach(course => {
                    images[course._id] = course.picturePath;
                });
                setCourseImages(images);
            } else {
                console.error('Data returned from API is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    const fetchStudentDetails = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:3001/auth/students/${studentId}`);
            console.log("sss",response.data)

            return response.data;
        } catch (error) {
            console.error('Error fetching student details:', error);
            return null;
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAssignment(prevState => ({
                ...prevState,
                picturePath: file
            }));
        }
    };
    
    const handleTypeChange = (e) => {
        const { value } = e.target;
        setNewAssignment(prevState => ({
            ...prevState,
            type: value
        }));
        // Si l'utilisateur sélectionne "TP", affichez les options de deadline
        if (value === 'tp') {
            setIsTpSelected(true);
        } else {
            // Si l'utilisateur sélectionne "Cours", réinitialisez les options de deadline
            setIsTpSelected(false);
            setNewAssignment(prevState => ({
                ...prevState,
                deadline: 'withDeadline'
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if a file is selected
        if (!newAssignment.picturePath) {
            toast.error('Please select a file');
            return;
        }
    
        // Check if all required fields are filled
        if (!newAssignment.title || !newAssignment.courseId || !newAssignment.type || !newAssignment.courseLevel) {
            toast.error('Please fill in all required fields');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('title', newAssignment.title);
            formData.append('courseId', newAssignment.courseId);
            formData.append('picturePath', newAssignment.picturePath);
            formData.append('type', newAssignment.type);
            formData.append('courseLevel', newAssignment.courseLevel);
            formData.append('deadline', newAssignment.deadline);
            formData.append('deadlineDate', selectedDate.toISOString());
            formData.append('deadlineTime', selectedTime);
    
            const response = await axios.post('http://localhost:3001/api/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 201) {
                toast.success("Class added successfully !!", {
                    autoClose: 1500,
                    style: {
                      color: 'green'
                    }
                  }); 
                setTimeout(() => {
                    navigate('/assignments');
                }, 2000);
    
                setAssignments([...assignments, response.data]);
    
                setNewAssignment({
                    title: '',
                    courseId: '',
                    picturePath: null,
                    description: '',
                    type: '',
                    courseLevel: '',
                    deadline: 'withDeadline'
                });
    
            } else {
                toast.error("Failed to add class", {
                    autoClose: 5000,
                    style: {
                        color: 'red',
                    },
                });
            }
        } catch (error) {
            console.error("Error adding class:", error);
            toast.error("Error adding class");
        }
    };
    

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId);
    };
    const filteredAssignments = selectedCourse ? assignments.filter(assignment => assignment.courseId === selectedCourse) : assignments;

    return (
        <div>
            <NavBar />
            <TopBarTeacherStudent />
            <ToastContainer />

            <div className="container mt-3">
                <div className="row">
                    <SideBarTeacher />
                    <div className="col-xl-9">
                        <div className="card">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <h2>Add New Assignment</h2>
                                <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Assignment</button>
                            </div>
                        </div>
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
                            // Si l'utilisateur est un enseignant, affichez toujours le type de l'assignment
                            <i className="fas fa-chalkboard-teacher text-primary me-2"></i>
                        ) : (
                            // Si l'utilisateur est un étudiant, affichez le type de l'assignment uniquement s'il a une deadline
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
                                <span>{new Date(assignment.deadlineDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</span> {/* Afficher uniquement la date de la deadline */}
                                <span className="me-2">Deadline Time:</span>
                                <span>{assignment.deadlineTime}</span> {/* Afficher uniquement l'heure de la deadline */}
                            </>
                        )}
                        {assignment.deadline === 'withoutDeadline' && (
                            <span className="me-2">No Deadline</span>
                        )}
                    </li>
                </ul>
                <a href="#" className="btn btn-primary-soft btn-sm mb-0" onClick={() => handleStudentSubmissionsClick(assignment._id)}>Rendu student</a>
                <p>{assignment.description}</p>
            </div>
        </div>
    </div>
))}


                    </div>
                </div>
            </div>

            {/* Utilisez le composant de modal de react-bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">Type</label>
                            <select
                                className="form-select"
                                name="type"
                                value={newAssignment.type}
                                onChange={handleTypeChange}
                            >
                                <option value="">Select Type</option>
                                <option value="course">Cours</option>
                                <option value="tp">TP</option>
                            </select>
                        </div>

                        {isTpSelected && (
                            <div className="mb-3">
                                <label htmlFor="deadline">Deadline</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="deadline"
                                        id="withDeadline"
                                        value="withDeadline"
                                        checked={newAssignment.deadline === 'withDeadline'}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="withDeadline">
                                        With Deadline
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="deadline"
                                        id="withoutDeadline"
                                        value="withoutDeadline"
                                        checked={newAssignment.deadline === 'withoutDeadline'}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="withoutDeadline">
                                        Without Deadline
                                    </label>
                                </div>
                            </div>
                        )}
                        {isTpSelected && newAssignment.deadline === 'withDeadline' && (
                            <div className="mb-3">
                                <label htmlFor="deadlineDate">Deadline Date</label>
                                <input
                                    type="date"
                                    id="deadlineDate"
                                    name="deadlineDate"
                                    value={selectedDate.toISOString().substr(0, 10)} // Utilisez toISOString pour obtenir le format de date attendu par l'élément input de type date
                                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                                    className="form-control"
                                />
                            </div>
                        )}
                        {isTpSelected && newAssignment.deadline === 'withDeadline' && (
                            <div className="mb-3">
                                <label htmlFor="deadlineTime">Deadline Time</label>
                                <input
                                    type="time"
                                    id="deadlineTime"
                                    name="deadlineTime"
                                    value={selectedTime}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        )}

                        <select id="courseLevel" className="form-select" name="courseLevel" value={newAssignment.courseLevel} onChange={handleInputChange}>
                            <option value="">Select Course Level</option>
                            {/* Map over your course levels and render options */}
                            {courseLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input id="title" className="form-control" type="text" name="title" value={newAssignment.title} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="course" className="form-label">Select Course</label>
                            <select id="course" className="form-select" name="courseId" value={newAssignment.courseId} onChange={handleInputChange}>
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="picture" className="form-label">Upload Assignment File (PDF)</label>
                            <input id="picture" className="form-control" type="file" name="picturePath" accept=".pdf" onChange={handleFileChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea id="description" className="form-control" name="description" value={newAssignment.description} onChange={handleInputChange} />
                        </div>
                        <Button variant="primary" type="submit">Create Assignment</Button>
                    </form>
                </Modal.Body>
            </Modal>
         
            <Modal show={showSubmissionModal} onHide={() => setShowSubmissionModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Student Submissions</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {studentSubmissions.length === 0 ? (
            <p>No submissions available</p>
        ) : (
            <ul>
                {studentSubmissions.map((submission, index) => (
                    <li key={index}>
                        {/* Utilisez le composant StudentSubmissionDetails ici */}
                        <StudentSubmissionDetails submission={submission} />
                    </li>
                ))}
            </ul>
        )}
    </Modal.Body>
</Modal>








        </div>
    );
}

export default TeacherView;
