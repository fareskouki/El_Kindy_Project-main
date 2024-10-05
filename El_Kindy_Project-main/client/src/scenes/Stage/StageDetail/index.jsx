import React, { useEffect, useState } from "react";
import NavBar from 'components/NavBar'
import BannerStartHome from 'components/BannerStartHome'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from "components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Index() {
  const [stage, setStage] = useState([]);
  const [stageDetails, setStageDetails] = useState({});
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservation, setReservation] = useState({
    userName: "",
    userEmail: "",
    phoneNumber: "",
    message: "",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/stage/${id}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setStage(data);
          setStageDetails(data); // Assuming data contains the stage details
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching stage:", error);
        setError("Failed to load event details. Please try again later.");
      }
    };
  
    if (id) fetchData();
  }, [id]);
  useEffect(() => {
    if (reservationSuccess) {
      navigate("/stage");
    }
  }, [reservationSuccess, navigate]);



  const handleApplyClick = () => {
    setShowContactForm(prevState => !prevState);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (!stageDetails.price) {
        // Event is free, submit reservation directly
        await submitReservation();
      } else {
        // Event is paid, initiate payment process
        await initiatePayment();
      }
    } catch (error) {
      toast.error("Reservation failed. " + error.message);
      console.error("Reservation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReservation = async () => {
    try {
      const url = `http://localhost:3001/reservationStage/${id}/reservation`;
      const dataToSend = {
        userName: reservation.userName,
        userEmail: reservation.userEmail,
        phoneNumber: reservation.phoneNumber,
        message: reservation.message,
        amount: stageDetails.price,
      };
      
      console.log("Sending reservation data:", dataToSend);
  
      const response = await axios.post(url, dataToSend);
      console.log("Reservation response:", response.data);
      toast.success("Reservation successful!", {
        onClose: () => navigate("/stage"),
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Reservation failed:", error.response ? error.response.data : error.message);
      throw new Error("Failed to submit reservation.");
    }
  };
  
  
  const totalAmount = stageDetails.price  * 1000;

  const initiatePayment = async () => {
    try {
      const paymentData = {
        stageId: stageDetails._id,
        amount: totalAmount,
        userName: reservation.userName,
        userEmail: reservation.userEmail,
        phoneNumber: reservation.phoneNumber,
        message: reservation.message
      };
  
      const response = await axios.post(
        `http://localhost:3001/payment/paymentStage`,
        paymentData
      );
  
      console.log("Payment initiation response:", response.data);
  
      if (response.data && response.data.paymentLink) {
        const paymentLink = response.data.paymentLink;
  
        window.open(paymentLink, '_blank');
  
        const paymentId = response.data.paymentId;
      } else {
        console.error("Payment link not found in the response.");
      }
    } catch (error) {
      console.error("Failed to initiate payment.", error);
      // Handle error
    }
  };
  

  const verifyPayment = async (paymentId) => {
    try {
      // Make a request to your backend to verify the payment
      const verifyUrl = `https://developers.flouci.com/api/verify_payment/${paymentId}`;
      const verifyResponse = await axios.get(verifyUrl, {
        headers: {
          'apppublic': 'a1e02adf-ac26-42dd-ac2c-bcce4039c770',
          'appsecret': process.env.flouci_secret
        }
      });
  
      // Assuming payment verification is successful
      console.log("Payment verification response:", verifyResponse.data);
  
      // Proceed with reservation after payment verification
      submitReservation();
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((reservation) => ({
      ...reservation,
      [name]: value,
    }));
  };

  return (
    <div>
      <NavBar />
      <BannerStartHome
        title="Internship"
        description="Find Detail About Our Internship."
      />
      <section className="pt-5 pb-0">
        <div className="container">
          <div className="row g-0 g-lg-5">
            {/* Left sidebar START */}
            <div className="col-lg-4">
              <div className="row">
                <div className="col-md-6 col-lg-12">
                  {/* Instructor image START */}
                  <div className="card shadow p-2 mb-4 text-center">
                    <div className="rounded-3">
                      {/* Image */}
                      {stage.picturePath ? (
                        <img
                          src={`http://localhost:3001/assets/${stage.picturePath}`}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="card-img-top"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    {/* Card body */}
                    <div className="card-body px-3">
                      {/* Social media button */}
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <a className="btn px-2 btn-sm bg-facebook" href="https://www.facebook.com/ConservatoireElkindy">
                            <i className="fab fa-fw fa-facebook-f" />
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a className="btn px-2 btn-sm bg-instagram-gradient" href="https://www.instagram.com/conservatoireelkindy">
                            <i className="fab fa-fw fa-instagram" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Instructor image END */}
                </div>
              </div>
              {/* Row End */}
            </div>
            {/* Left sidebar END */}
            {/* Main content START */}
            <div className="col-lg-8">
              {/* Title */}
              <h5 className="mb-0">El Kindy Conservatory offers Internships for its students they can participate in </h5>
              <h1 className="mb-0">{stage.title}</h1>
              <p>El-kindy Conservatory Internship</p>
              <button className="btn btn-primary btn-sm btn-block" onClick={handleApplyClick}>
                {showContactForm ? "Hide Form" : "Apply"}
              </button>
              <div className="row">
                <h4 className="mb-0">{stage.price ? `${stage.price} TND` : "Free"}</h4>
                <h4 className="mb-0">Number of Places: {stage.place}</h4>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-4">{stage.description}</p>
                  {/* Personal info */}
                  <ul className="list-group list-group-borderless">
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-clock text-primary me-1 me-sm-3" />Start Date:</span>
                      <span>{stage.startDate}</span>
                    </li>
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-clock text-primary me-1 me-sm-3" />Finish Date:</span>
                      <span>{stage.finishDate}</span>
                    </li>
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-headphones text-primary me-1 me-sm-3" />Phone number:</span>
                      <span>+216 20 669 545</span>
                    </li>
                  </ul>
                </div>
                {/* Show contact form if applicable */}
                {showContactForm && (
                  <div className="col-md-6">
                    <form onSubmit={handleReservationSubmit}>
                      {/* Hidden input field for stage ID */}
                      <input type="hidden" name="stageId" value={id} />
                      {/* Name */}<h2>Internship Form</h2>
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="yourName" className="form-label">Your name </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={reservation.userName}
onChange={(e) =>
  setReservation({
    ...reservation,
    [e.target.name]: e.target.value,
  })
}
                          name="userName"  // Make sure this attribute is correct
                          id="yourName"
                        />

                      </div>
                      {/* Email */}
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="emailInput" className="form-label">Email address *</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          value={reservation.userEmail}
                          onChange={(e) => setReservation({ ...reservation, userEmail: e.target.value })}
                          id="emailInput"
                        />
                      </div>
                      {/* Message */}
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="phoneNumberareaBox" className="form-label">phoneNumber *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={reservation.phoneNumber}
                          onChange={(e) => setReservation({ ...reservation, phoneNumber: e.target.value })}
                          id="phoneNumberInput"
                        />
                      </div>

                      {/* PhoneNumber */}
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="textareaBox" className="form-label">Message *</label>
                        <textarea
                          className="form-control"
                          value={reservation.message}
                          onChange={(e) => setReservation({ ...reservation, message: e.target.value })}
                          id="textareaBox"
                          rows={4}
                        />
                      </div>

                      {/* Button */}
                      <div className="d-grid">
                      <div className="d-grid">
    <button
      type="submit"
      className="btn btn-primary btn-lg"
      disabled={isSubmitting}
    >
      Submit Reservation
    </button>
  </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            {/* Main content END */}
          </div>
          {/* Row END */}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Index;
