import mongoose from "mongoose";

const AssignmentStudentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Référence au modèle User
        },
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment', // Référence au modèle Assignment
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course', // Référence au modèle Course
        },
        picturePath: {
            type: String,
        }
    },
    { timestamps: true }
);

const AssignmentStudent = mongoose.model("AssignmentStudent", AssignmentStudentSchema);

export default AssignmentStudent;
