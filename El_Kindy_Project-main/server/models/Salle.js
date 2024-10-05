import mongoose from "mongoose";

const salleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            max:50,
        }, 
        capacity: {
            type: Number,
            required: true,
            min: 2,
            max:50,
        }, 
        status: {
            type: String,
            required: true,
            enum: ["available", "occupied", "maintenance"],
        }, 
       
    },
    { timestamps: true}
    );

const Salle = mongoose.model("Salle",salleSchema);
export default Salle;