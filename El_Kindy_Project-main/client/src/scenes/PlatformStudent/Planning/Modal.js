import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Modal = ({ onClose, onSave, eventDetails, rooms, courses }) => {
  const [course, setCourse] = useState({
    title: eventDetails.title || '',
    courseId: '',
    roomId: eventDetails.resourceId || ''
  });

  // Initialiser la couleur avec la couleur de l'événement sélectionné, s'il y en a un
  const initialColor = eventDetails.color || '#000000';
  const [color, setColor] = useState(initialColor);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prevState => ({
      ...prevState,
      courseId: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomId = parseInt(course.roomId, 10);
    const { courseId } = course;

    if (isNaN(roomId)) {
      alert("Veuillez sélectionner une salle valide.");
      return;
    }
    if (!courseId) {
      alert("Veuillez sélectionner un cours.");
      return;
    }

    const courseArray = Array.isArray(courses) ? courses : (courses.data || []);
    const selectedCourse = courseArray.find(course => course._id === courseId);

    if (!selectedCourse) {
      alert("Le cours sélectionné n'est pas valide.");
      return;
    }

    const event = {
      ...course,
      title: selectedCourse.title,
      start: new Date(eventDetails.start),
      end: new Date(eventDetails.end),
      resourceId: roomId,
      color
    };

    onSave(event);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      border: '1px solid black',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px', // Ajout d'une largeur maximale pour un meilleur rendu sur les grands écrans
      width: '100%' // Assurez-vous que la pop-up s'adapte à la largeur de son conteneur
    }}>
      <form onSubmit={handleSubmit}>
        <label style={{ marginBottom: '8px', display: 'block' }}>Sélectionner un cours :</label>
        <select
          value={course.courseId}
          onChange={handleInputChange}
          style={{ marginBottom: '16px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Sélectionner un cours --</option>
          {Array.isArray(courses.data) && courses.data.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
        <div style={{ textAlign: 'right' }}>
          <button type="submit" style={{ marginRight: '8px', padding: '8px 16px', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Ajouter</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', border: 'none' }}>Annuler</button>
        </div>
        <label style={{ marginBottom: '8px', display: 'block' }}>Choisir une couleur :</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          style={{ marginBottom: '16px', display: 'block' }}
        />
      </form>
    </div>
  );
};

export default Modal;
