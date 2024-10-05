import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    text: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
    text: true,
  },
  price: {
    type: Number,
  },
  picturePath: {
    type: String,
    default: "",
  }, 
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  place: {
    type: String, 
    required: true
  },
  timeFrom: {
    type: String, 
    required: true
  },
  timeTo: {
    type: String, 
    required: true
  },
}, { timestamps: true }); 

const Event = mongoose.model('Event', eventSchema);
export default Event;