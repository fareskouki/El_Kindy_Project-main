import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  date: {  // Add the new 'date' attribute
    type: Date,
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  students: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inscription'  // Référence à la table des inscriptions (utilisateurs)
    }],
    default: []
  }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
