import mongoose from "mongoose";

const planningSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  color: {
    type: String, 
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', 
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User pour les enseignants
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User pour les étudiants
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Référence au modèle User pour les étudiants
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe', // Référence à la classe
  },
});


const Planning = mongoose.model("Planning", planningSchema);

export default Planning;
