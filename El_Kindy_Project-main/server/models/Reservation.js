import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },  
  userName: { type: String, required: true },                      
  userEmail: { type: String, required: true },                     
  phoneNumber: { type: Number, required: true },                   
  reservationDate: { type: Date, default: Date.now },              
  status: { 
    type: String,  
    enum: ['pending', 'accepted', 'refused'],                      
    default: 'pending' 
  },
  paymentId: { type: String }, 
  numberOfReservations: { type: Number, required: true, min: 1 },                                    
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
