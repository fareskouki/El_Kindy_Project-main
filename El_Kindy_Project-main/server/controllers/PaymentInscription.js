import axios from "axios";
import Inscription from "../models/Inscription.js";
import { sendEmail } from "../utils/sendMailer.js";
import User from "../models/User.js";



// Add a new inscription with payment initialization
export async function addInscriptionWithPayment(req, res) {
  const { id } = req.params;

  try {
    const inscription = await Inscription.findById(id);
    if (!inscription) {
      return res.status(404).json({ message: "Inscription not found" });
    }

    const paymentAmount = 100000;

    // Prepare payload for payment API, assuming payment needs to be initiated
    const payload = {
      app_token: "a1e02adf-ac26-42dd-ac2c-bcce4039c770",
      app_secret: process.env.flouci_secret,
      amount: paymentAmount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: "http://localhost:3000/SuccessInscription",
      fail_link: "http://localhost:3000/fail",
      developer_tracking_id: "84cb42aa-8358-4818-9c6c-42499e99be1e",
    };

    // Call the payment API to generate the payment link
    const response = await axios.post(
      "https://developers.flouci.com/api/generate_payment",
      payload
    );
    const paymentId = response.data.result.payment_id;
    const paymentLink = response.data.result.link;

    await Inscription.findByIdAndUpdate(id, {
      paymentId: paymentId,
      paymentLink: paymentLink,
      status: "not paid",
    });

    const body = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Required - Elkindy</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border: 1px solid #cccccc;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          background-color: #FFC107; /* Yellow color for the header */
          color: #333333;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          color: #333333;
          text-align: center;
        }
        .content h2 {
          color: #FFC107; /* Yellow color for the headings */
          margin-bottom: 20px;
        }
        .content p {
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .payment-link {
          display: inline-block;
          background-color: #FFC107; /* Yellow color for the button */
          color: #333333;
          padding: 10px 20px;
          margin: 20px 0;
          border: none;
          text-decoration: none;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .payment-link:hover {
          background-color: #D99A05; /* Darker shade for hover effect */
        }
        .footer {
          background-color: #FFC107; /* Yellow color for the footer */
          color: #333333;
          text-align: center;
          padding: 10px;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Payment Required</h1>
        </div>
        <div class="content">
          <h2>Dear ${inscription.firstName} ${inscription.lastName},</h2>
          <p>Thank you for registering with us. Your registration has been approved, and you are just one step away from completing the process.</p>
          <p>Please complete your payment by clicking the link below:</p>
          <a href="${paymentLink}" class="payment-link">Complete Payment</a>
          <p>If you have any questions or need further assistance, feel free to contact us.</p>
        </div>
        <div class="footer">
          © 2024 Elkindy. All rights reserved.
        </div>
      </div>
    </body>
    </html>`;

    await sendEmail(inscription.email, "Welcome to Elkindy", body);

    // Send response with payment link
    res.json({
      paymentLink: paymentLink,
      paymentId: paymentId,
      message: "Payment initiated. Please complete the payment.",
    });
  } catch (error) {
    console.error("Failed to approve inscription and initiate payment:", error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
}

// Verify payment and update reservation status
export async function Verifyinscription(req, res) {
  const paymentId = req.params.id;

  try {
      // Find the inscription with the given paymentId
      const inscription = await Inscription.findOne({ paymentId });

      if (!inscription) {
          return res.status(404).json({ message: "inscription not found for this paymentId." });
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

      // Update inscription status to 'accepted' upon successful payment verification
      inscription.status = 'confirmed';
      inscription.paymentStatus = 'completed';
      await inscription.save();

      
  

      res.json({ message: "Payment verified successfully. inscription status updated." });
  } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
}



