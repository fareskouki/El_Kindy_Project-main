
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    instructorName: { type: String, required: true },
    reviewText: { type: String, required: true },
    sentiment: { type: String, required: true },
    confidenceScores: {
      positive: { type: Number, required: true },
      neutral: { type: Number, required: true },
      negative: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Review = mongoose.model('Review', reviewSchema);
  
  export default Review;