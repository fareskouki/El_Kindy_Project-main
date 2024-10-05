import express from 'express';
import Stage from '../models/Stage.js';

const router = express.Router();
// Route handler to create a new stage
export const createStage = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const {
            title,
            startDate,
            finishDate,
            description,
            picturePath,
            place,
            price
        } = req.body;

        const newStage = new Stage({
            title,
            startDate,
            finishDate,
            description,
            picturePath,
            place,
            price
        });

        const savedStage = await newStage.save();
        res.status(201).json({savedStage}); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET ALL STAGES */
export const getStages = async (req,res)=>{
    try{
        console.log('Request Body:', req.body);
        const stages = await Stage.find();
        res.status(200).json({stages});
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
 
}
/* GET STAGE BY ID */
export const getStage = async (req,res)=>{
    try{
        const stage = await Stage.findById(req.params.id);
        res.status(200).json(stage);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
 
}
/* UPDATE STAGE */
export const updateStage = async (req,res)=>{
    try{
        const updatedStage = await Stage.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({updatedStage});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}
/* DELETE STAGE */
export const deleteStage = async (req,res)=>{
    try{
        await Stage.findByIdAndDelete(req.params.id);
        res.status(200).json("Stage has been deleted...");
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}
