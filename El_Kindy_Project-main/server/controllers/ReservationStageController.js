import Reservation from "../models/ReservationStage.js";
import { sendSms } from "../index.js";
import Stage from "../models/Stage.js";
import axios from 'axios';

export const createReservation = async (req, res) => {
  console.log("Initiating reservation:", req.params, req.body);
  const stageId = req.params.stageId;
  const { userName, userEmail, phoneNumber, message } = req.body;

  try {
    const stageDetails = await Stage.findById(stageId);
    if (!stageDetails) {
      return res.status(404).json({ message: "Stage not found" });
    }

    let paymentId; // Declare paymentId variable to store the generated payment ID

    if (!stageDetails.price) {
      const newReservation = new Reservation({ stageId, userName, userEmail, phoneNumber, message });
      const savedReservation = await newReservation.save();
      return res.status(201).json({ reservation: savedReservation });
    } else {
      const amountinMillimes = stageDetails.price * 1000;
      const paymentPayload = { amount: amountinMillimes };

      const paymentResponse = await axios.post('http://localhost:3001/payment/paymentStage', paymentPayload);
      console.log("Payment link generated:", paymentResponse.data.result.developer_tracking_id);

      // Save the payment ID
      paymentId = paymentResponse.data.result.developer_tracking_id;
      const newReservation = new Reservation({ stageId, userName, userEmail, phoneNumber, message, paymentId });
      const savedReservation = await newReservation.save();
      
      res.redirect(paymentResponse.data.result.link);
    }
  } catch (error) {
    console.error("Failed to create reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}



export const listReservationsByid = async (req, res) => {
  const { stageId } = req.params;
  try{
    const reservation = await Reservation.find({ stageId });
    res.json(reservation);
  }catch{
    res.status(500).send({ message: "Error fetching reservation", error: error.message });
  }
}

// Get All Stages
export const listReservations = async (req, res) => {
 try{
  let reservations = await Reservation.find({}).populate('stageId');
  console.log(JSON.stringify(reservations, null, 2));
  res.json(reservations);
 }catch (err) {
  console.error(err);
  res
    .status(500)
    .json({
      error: "Internal Server Error",
      message: "Could not retrieve events",
    });
}
}

  export const updateReservationStatus = async (req, res) => {
    const { reservationstageId } = req.params;
    const { status } = req.body;

    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationstageId,
        { status },
        { new: true } // This option returns the document as it looks after update was applied.
      );

      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found." });
      }

      if (status === 'accepted') {
        sendSms(updatedReservation.phoneNumber).then(() => {
            console.log("SMS notification sent.");
        }).catch(err => {
            console.error("Failed to send SMS notification:", err);
        });
    }

      res.json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      res.status(500).json({ message: "Error updating reservation status", error: error.message });
    }
  };


