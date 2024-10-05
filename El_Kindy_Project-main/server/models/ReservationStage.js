import mongoose from "mongoose";

const reservationStageSchema = new mongoose.Schema({
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: "Stage" },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  message: { type: String, required: true },
  status: { 
    type: String,  
    enum: ['pending', 'accepted', 'refused'], 
    default: 'pending' 
  },
  paymentId: { type: String }                                      // Payment ID from payment gateway

});

const ReservationStage = mongoose.model("ReservationStage", reservationStageSchema);
export default ReservationStage;
