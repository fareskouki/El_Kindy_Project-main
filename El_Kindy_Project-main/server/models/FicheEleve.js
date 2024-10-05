import mongoose from "mongoose";

const FicheEleveSchema = new mongoose.Schema(
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
         classId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        observation: {
                type: [String], // Allow multiple roles for a user
                enum: ["mauvais", "assez bien", "bien", "tres bien","excellent"],
                required: true                    
        }
    },
    { timestamps: true }
);
const FicheEleve = mongoose.model("FicheEleve", FicheEleveSchema);
export default FicheEleve;
