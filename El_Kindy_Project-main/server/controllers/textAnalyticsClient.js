// Importing required modules
import express from 'express';
import { TextAnalyticsClient, AzureKeyCredential } from '@azure/ai-text-analytics';
import Review from '../models/Review.js';
import moment from 'moment';


// Set up Azure Text Analytics
const endpoint = 'https://elkindy.cognitiveservices.azure.com/';
const apiKey =  '8fa4755ffaea4e0ea90a707815f72c7b';

const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

// Sentiment Analysis function
export async function textAnalytics(req, res) {
  try {
    const text = req.body.text;
    const [result] = await textAnalyticsClient.analyzeSentiment([text]);

    const reviewData = {
      instructorName: req.body.instructorName, // Add instructor name to the review
      reviewText: text,
      sentiment: result.sentiment,
      confidenceScores: result.confidenceScores,
    };

    const newReview = new Review(reviewData);
    await newReview.save();

    res.status(200).json({
      message: 'Sentiment analysis successful',
      sentiment: result.sentiment,
      confidenceScores: result.confidenceScores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error analyzing sentiment' });
  }
}

// Function to get the best instructor for a specific month
export async function getBestInstructorForMonth(req, res) {
  const { month } = req.params;

  // Calculate start and end dates for the specified month
  const startOfMonth = moment(month, 'YYYY-MM').startOf('month').toDate();
  const endOfMonth = moment(month, 'YYYY-MM').endOf('month').toDate();

  try {
    // Fetch reviews within the specified month
    const reviews = await Review.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Aggregate reviews by instructor and calculate average sentiment score
    const instructorScores = {};

    reviews.forEach((review) => {
      if (!instructorScores[review.instructorName]) {
        instructorScores[review.instructorName] = {
          totalScore: 0,
          count: 0,
        };
      }

      // Assuming positive sentiment represents the score
      instructorScores[review.instructorName].totalScore += review.confidenceScores.positive;
      instructorScores[review.instructorName].count += 1;
    });

    // Identify the best instructor with the highest average score
    const bestInstructor = Object.entries(instructorScores).reduce((best, current) => {
      const [instructorName, { totalScore, count }] = current;
      const avgScore = totalScore / count;

      return avgScore > best.avgScore
        ? { instructorName, avgScore }
        : best;
    }, { instructorName: '', avgScore: 0 });

    res.status(200).json(bestInstructor);
  } catch (error) {
    console.error('Error retrieving best instructor:', error);
    res.status(500).json({ error: 'Error retrieving best instructor' });
  }
}


// Endpoint to get all professors with their average scores and rankings
export async function professors (req, res) {
  try {
    // Group reviews by instructorName and calculate the average sentiment score
    const professorRankings = await Review.aggregate([
      {
        $group: {
          _id: '$instructorName',
          avgScore: { $avg: '$confidenceScores.positive' }, // calculate average of positive scores
        },
      },
      {
        $sort: { avgScore: -1 }, // sort in descending order to rank
      },
    ]);

    const professors = professorRankings.map((ranking, index) => ({
      name: ranking._id,
      rank: index + 1, // assign rank based on the sorted order
      avgScore: ranking.avgScore,
    }));

    res.status(200).json(professors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching professors with rankings' });
  }
};