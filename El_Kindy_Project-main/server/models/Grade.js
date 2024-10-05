import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        grade: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        classId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
        }
    },
    { timestamps: true }
);
const Grade = mongoose.model("Grade", GradeSchema);
export default Grade;
