import mongoose from "mongoose";

const StageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 5,
            max:50
        }, 
        startDate: {
            type: String,
            required: true
           
        }, 
        finishDate: {
            type: String,
            required: true
        }, 
        description: {
            type: String,
            required: true,
            min:5
        },
        picturePath: {
            type: String,
            required: true
        },
        place:{
            type:Number,
            required:true,
        },
        price: {
          type: Number,
        }
    },
    { timestamps: true}
    );

    const Stage = mongoose.model("Stage",StageSchema);
    export default Stage;