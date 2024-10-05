import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course', // Référence au modèle Course
        },
        picturePath: {
            type: String,
        }, 
      
        description: {
            type: String
        }
    },
    { timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);

export default Assignment;
