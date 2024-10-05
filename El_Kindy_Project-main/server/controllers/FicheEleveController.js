import mongoose from 'mongoose';
import FicheEleve from '../models/FicheEleve.js';
//methode to affect FicheEleve to a user
export const affectFicheEleve = async (req, res) => {
  try {
    // Extract data from the request body
    const { student, course, classId, date, duration, content, observation } = req.body;

    // Validate input data
    if (!student || !course || !classId || !date || !duration || !content || !observation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new FicheEleve document
    const newFicheEleve = new FicheEleve({
      student: student,
      course: course,
      classId: classId,
      date: date,
      duration: duration,
      content: content,
      observation: observation
    });
    await newFicheEleve.save();
    
    return res.status(201).json({ message: 'Content control created successfully' });
  } catch (error) {
    console.error('Error affecting content control:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//methode to get the list of dicheEleve 
export const getFicheEleves = async (req, res) => {
  try {
    const ficheEleve = await FicheEleve.find();
    return res.status(200).json(ficheEleve);
  } catch (error) {
    console.error('Error getting content controls:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
//methode to get the list of dicheEleve by student id (find one)
export const getFicheElevesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const ficheEleve = await FicheEleve.find({ student: studentId });
    return res.status(200).json(ficheEleve);
  } catch (error) {
    console.error('Error getting content controls:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
//methode to get fiche eleve by class and course
export const getFicheElevesByClassAndCourse = async (req, res) => {
  try {
    const { classId, courseId } = req.params;
    const ficheEleve = await FicheEleve.find({ classId: classId, course: courseId });
    return res.status(200).json(ficheEleve);
  } catch (error) {
    console.error('Error getting content controls:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
//delete fiche eleve by id
export const deleteFicheEleve = async (req, res) => {
  try {
    const { ficheEleveId } = req.params;
    await FicheEleve.findByIdAndDelete(ficheEleveId);
    return res.status(200).json({ message: 'Content control deleted successfully' });
  } catch (error) {
    console.error('Error deleting content control:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
//get fiche eleve by student and course
export const getFicheEleveByStudentAndCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const ficheEleve = await FicheEleve.find({ student: studentId, course: courseId });
    return res.status(200).json(ficheEleve);
  } catch (error) {
    console.error('Error getting content controls:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
  