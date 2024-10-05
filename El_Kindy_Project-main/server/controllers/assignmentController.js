import Assignment from "../models/Assignment.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AssignmentStudent from "../models/AssignmentStudent.js";

// Créer une nouvelle assignment
export const createAssignment = async (req, res) => {
    try {
        console.log("Request received to create assignment");
        
        const {
            title,
            courseId,
            description,
            type, // Ajoutez le champ type
            courseLevel ,// Ajoutez le champ courseLevel
            deadline,
            deadlineTime
        } = req.body;

        const picturePath = req.file.path; // Accédez au chemin du fichier téléchargé

        console.log("Creating new assignment with title:", title);
        
        // Convertir la date de la deadline en objet Date
        const deadlineDate = deadline === 'withDeadline' ? new Date() : null; // Replace null with the actual deadline date

        const newAssignment = new Assignment({
            title,
            courseId,
            picturePath,
            file: null,
            // Utilisez req.body.studentId pour récupérer l'ID de l'étudiant connecté
            uploadedBy: req.body.studentId,
            description,
            type,
            courseLevel,
            deadline,
            deadlineDate,
            deadlineTime
        });
        
        

        console.log("Saving new assignment to the database");
        
        const savedAssignment = await newAssignment.save();
        
        console.log("Assignment saved successfully:", savedAssignment);
        
        res.status(201).json(savedAssignment);
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Fonction pour télécharger un fichier pour une tâche spécifique
export const uploadAssignmentFileS = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        const picturePath = req.file.path; // Accédez au chemin du fichier téléchargé

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        const { studentId } = req.body; // Récupérer le studentId depuis la requête

        // Enregistrez le chemin du fichier et le studentId dans la nouvelle table pour les fichiers soumis
        const submittedFile = new AssignmentStudent({
            studentId,
            assignmentId,
            courseId: assignment.courseId,
            picturePath     
        });
        await submittedFile.save();

        res.status(200).json({ message: "File submitted successfully" });
    } catch (error) {
        console.error("Error uploading file for assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBirthdays = async (req, res) => {
    try {
        // Rechercher les utilisateurs dont la date de naissance n'est pas nulle
        const users = await User.find({ dateOfBirth: { $ne: null } }, 'firstName lastName dateOfBirth');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

// Fonction pour télécharger un fichier pour une tâche spécifique
export const uploadAssignmentFile = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        
        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        // Vérifiez s'il y a déjà un fichier associé à cette assignation
        if (assignment.filePath) {
            return res.status(400).json({ error: "A file is already uploaded for this assignment" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Enregistrez le chemin du fichier dans la base de données
        assignment.filePath = req.file.path;
        await assignment.save();

        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file for assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getAssignmentsS = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        // Utilisez l'ID du devoir pour trouver les soumissions des étudiants associées
        const submissions = await AssignmentStudent.find({ assignmentId: assignmentId });
        console.log(submissions);

        res.json(submissions);
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Obtenir toutes les assignments
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
