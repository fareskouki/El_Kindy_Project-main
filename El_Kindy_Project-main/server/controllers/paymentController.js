import axios from "axios";
import Reservation from "../models/Reservation.js";
import ReservationStage from "../models/ReservationStage.js";
import Stage from "../models/Stage.js";


// Add a new reservation
export async function Add(req, res) {
    const { eventId, userName, userEmail, phoneNumber, amount , numberOfReservations} = req.body;
    console.log("Received request body:", req.body);
    const payload = {
        "app_token": "a1e02adf-ac26-42dd-ac2c-bcce4039c770",
        "app_secret": process.env.flouci_secret,
        "amount": amount,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link": "http://localhost:3000/success",
        "fail_link": "http://localhost:3000/fail",
        "developer_tracking_id": "84cb42aa-8358-4818-9c6c-42499e99be1e",
    };

    try {
        const response = await axios.post("https://developers.flouci.com/api/generate_payment", payload);
        const paymentId = response.data.result.payment_id;

        // Store the reservation data temporarily in the database
        const tempReservation = new Reservation({
            eventId,
            userName,
            userEmail,
            phoneNumber,
            status: 'pending',
            paymentId,
            numberOfReservations
        });
        console.log("Payload to save reservation:", { eventId, userName, userEmail, phoneNumber, paymentId,numberOfReservations });
        await tempReservation.save();


        res.json({ paymentLink: response.data.result.link, paymentId });
    } catch (error) {
        console.error("Failed to initiate payment:", error);
        res.status(500).json({ message: "Error initiating payment", error: error.message });
    }
}



// Verify payment and update reservation status
export async function Verify(req, res) {
    const paymentId = req.params.id;

    try {
        // Find the reservation with the given paymentId
        const reservation = await Reservation.findOne({ paymentId });

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found for this paymentId." });
        }

        // Make a request to verify the payment
        const verifyUrl = `https://developers.flouci.com/api/verify_payment/${paymentId}`;
        const verifyResponse = await axios.get(verifyUrl, {
            headers: {
                'apppublic': 'a1e02adf-ac26-42dd-ac2c-bcce4039c770',
                'appsecret': process.env.flouci_secret
            }
        });

        // Assuming payment verification is successful
        console.log("Payment verification response:", verifyResponse.data);

        // Update reservation status to 'accepted' upon successful payment verification
        reservation.status = 'accepted';
        await reservation.save();

        res.json({ message: "Payment verified successfully. Reservation status updated." });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
}

export async function AddStage(req, res) {
    const { stageId, userName, userEmail, phoneNumber, amount,message } = req.body;
    const payload = {
        "app_token": "a1e02adf-ac26-42dd-ac2c-bcce4039c770",
        "app_secret": process.env.flouci_secret,
        "amount": amount,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link": "http://localhost:3000/SuccessStage",
        "fail_link": "http://localhost:3000/fail",
        "developer_tracking_id": "84cb42aa-8358-4818-9c6c-42499e99be1e",
    };

    try {
        const response = await axios.post("https://developers.flouci.com/api/generate_payment", payload);
        const paymentId = response.data.result.payment_id;

        // Store the reservation data temporarily in the database
        const tempReservation = new ReservationStage({
            stageId,
            userName,
            userEmail,
            phoneNumber,
            status: 'pending',
            message,
            paymentId
        });
        await tempReservation.save();


        res.json({ paymentLink: response.data.result.link, paymentId });
    } catch (error) {
        console.error("Failed to initiate payment:", error);
        res.status(500).json({ message: "Error initiating payment", error: error.message });
    }
}


  export async function VerifyStage(req, res) {
    const paymentId = req.params.id;

    try {
        // Find the reservation with the given paymentId
        const reservation = await ReservationStage.findOne({ paymentId });

        if (!reservation) {
            return res.status(404).json({ message: "ReservationStage not found for this paymentId." });
        }

        // Make a request to verify the payment
        const verifyUrl = `https://developers.flouci.com/api/verify_payment/${paymentId}`;
        const verifyResponse = await axios.get(verifyUrl, {
            headers: {
                'apppublic': 'a1e02adf-ac26-42dd-ac2c-bcce4039c770',
                'appsecret': process.env.flouci_secret
            }
        });

        // Assuming payment verification is successful
        console.log("Payment verification response:", verifyResponse.data);

        // Update reservation status to 'accepted' upon successful payment verification
        reservation.status = 'accepted';
        await reservation.save();

        res.json({ message: "Payment verified successfully. Reservation status updated." });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
}