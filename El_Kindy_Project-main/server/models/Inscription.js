import mongoose from "mongoose";

const inscriptionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  niveauEtude: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentProfession: {
    type: String,
    required: true
  },
  phoneNumber1: {
    type: String,
    required: true
  },
  phoneNumber2: {
    type: String
  },
  likedCourses: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    default: []
  },
  disponibilite: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'not paid', 'confirmed', 'refused','active'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ""
  },
  paymentLink: {
    type: String,
    default: ""
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 100000  // Always set to 100 DT
  }

});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

export default Inscription;
