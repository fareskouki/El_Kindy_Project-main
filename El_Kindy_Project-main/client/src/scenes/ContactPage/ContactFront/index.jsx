import { width } from "@mui/system";
import BannerStartHome from "components/BannerStartHome";
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Importez axios pour effectuer des requêtes HTTP
import Swal from "sweetalert2"; // Importez SweetAlert2
import { useTranslation } from "react-i18next";

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Vérifier manuellement si l'e-mail est valide
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    if (!isValidEmail) {
      // Afficher un message d'erreur avec SweetAlert2 si l'e-mail n'est pas valide
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return; // Arrêter l'exécution de la fonction si l'e-mail n'est pas valide
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/contact",
        formData
      );
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your message has been received.",
      });
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <NavBar />
      <main>
        {/* =======================
  Page Banner START */}
        <BannerStartHome
          title={t("contact.title")}
          description={t("contact.description")}
        />
        {/* =======================
  Page Banner END */}

        {/* =======================
  Contact Info START */}
        <section
          className="pt-5 pb-0"
          style={{
            backgroundImage: "url(assets/images/element/map.svg)",
            backgroundPosition: "center left",
            backgroundSize: "cover",
          }}
        >
          <div className="container">
            <div className="row g-4 g-md-5 mt-0 mt-lg-3">
              <div className="col-lg-6 mt-lg-0">
                <div className="card card-body bg-primary shadow py-5 text-center h-100">
                  <h5 className="text-white mb-3">
                    {t("contact.hours_title")}
                  </h5>
                  <ul className="list-inline mb-0">
                    <li className="list-item mb-3">
                      <a href="#" className="text-white">
                        {" "}
                        <i className="far fa-clock text-white me-2"></i>
                        {t("contact.hours_mon_fri")}
                      </a>
                    </li>
                    <li className="list-item mb-3">
                      <a href="#" className="text-white">
                        {" "}
                        <i className="far fa-clock text-white me-2"></i>
                        {t("contact.hours_sat_sun")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 mt-lg-0">
                <div className="card card-body shadow py-5 text-center h-100">
                  <h5 className="mb-3">{t("contact.address_title")}</h5>
                  <ul className="list-inline mb-0">
                    <li className="list-item mb-3 h6 fw-light">
                      <a href="#">
                        {" "}
                        <i className="fas fa-fw fa-map-marker-alt me-2 mt-1" />
                        {t("contact.address_line")}
                      </a>
                    </li>
                    <li className="list-item mb-3 h6 fw-light">
                      <i className="fas fa-fw fa-phone-alt me-2" />
                      {t("contact.phone")}
                    </li>
                    <li className="list-item mb-0 h6 fw-light">
                      <i className="far fa-fw fa-envelope me-2" />
                      {t("contact.email")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =======================
  Contact Info END */}

        {/* =======================
  Instructor START */}
        <section className="d-flex justify-content-center align-items-center">
          <div className="container d-flex justify-content-center align-items-center">
            <div className="col-md-8">
              <div className="d-sm-flex d-flex justify-content-center align-items-center">
                <h2 className="mb-0">{t("contact.team_title")}</h2>
              </div>
              <div className="tiny-slider arrow-round arrow-creative arrow-blur arrow-hover mt-2 mt-sm-5">
                <div
                  className="tiny-slider-inner"
                  data-autoplay="true"
                  data-arrow="true"
                  data-dots="false"
                  data-items={2}
                  data-items-lg={2}
                  data-items-md={2}
                >
                  <div className="text-center">
                    <div className=" mb-3">
                      <img
                        className="imgg rounded-circle shine-effect"
                        style={{ width: "200px", height: "200px" }}
                        src="assets/images/avatar/lotfi.jpg"
                        alt="avatar"
                      />
                    </div>
                    <h6 className="mb-0">
                      <a href="#">Lotfi Erraies</a>
                    </h6>
                    <p className="mb-0 small">
                      {t("contact.founder")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-3">
                      <img
                        className="imgg rounded-circle shine-effect"
                        style={{ width: "200px", height: "200px" }}
                        src="assets/images/avatar/amin.jpg"
                        alt="avatar"
                      />
                    </div>
                    <h6 className="mb-0">
                      <a href="#">Amin Ben Taher</a>
                    </h6>
                    <p className="mb-0 small">
                      {t("contact.general_supervisor")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =======================
  Instructor END */}

        {/* =======================
  Image and Contact Form START */}
        <section>
          <div className="container">
            <div className="row g-4 g-lg-0 align-items-center">
              <div className="col-md-6 align-items-center text-center">
                <img
                  src="assets/images/element/contact.svg"
                  className="h-400px"
                  alt
                />
                <div className="d-sm-flex align-items-center justify-content-center mt-2 mt-sm-4">
                  <h5 className="mb-0">{t("contact.follow_us")}</h5>
                  <ul className="list-inline mb-0 ms-sm-2">
                    <li className="list-inline-item">
                      {" "}
                      <Link
                        className="fs-5 me-1 text-facebook"
                        to="https://www.facebook.com/ConservatoireElkindy"
                      >
                        <i className="fab fa-fw fa-facebook-square" />
                      </Link>{" "}
                    </li>
                    <li className="list-inline-item">
                      {" "}
                      <Link
                        className="fs-5 me-1 text-instagram"
                        to="https://www.instagram.com/conservatoireelkindy/"
                      >
                        <i className="fab fa-fw fa-instagram" />
                      </Link>{" "}
                    </li>
                    <li className="list-inline-item">
                      {" "}
                      <Link
                        className="fs-5 me-1 text-youtube"
                        to="https://www.youtube.com/@conservatoireelkindy"
                      >
                        <i className="fab fa-fw fa-youtube" />
                      </Link>{" "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <h2 className="mt-4 mt-md-0">{t("contact.form_title")}</h2>
                <p>{t("contact.form_description")}</p>
                <form>
                  <div className="mb-4 bg-light-input">
                    <label htmlFor="yourName" className="form-label">
                      {t("contact.form_name")}
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      type="text"
                      className="form-control form-control-lg"
                      id="yourName"
                      required
                    />
                  </div>
                  <div className="mb-4 bg-light-input">
                    <label htmlFor="emailInput" className="form-label">
                      {t("contact.form_email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control form-control-lg"
                      id="emailInput"
                      required
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Add the pattern for email validation
                    />
                  </div>
                  <div className="mb-4 bg-light-input">
                    <label htmlFor="textareaBox" className="form-label">
                      {t("contact.form_message")}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control"
                      id="textareaBox"
                      rows={4}
                      defaultValue={""}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-lg btn-primary mb-0"
                      onClick={handleSubmit}
                      type="button"
                    >
                      {t("contact.send_message")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/* =======================
  Image and Contact Form END */}

        {/* =======================
  Map START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <iframe
                  className="w-100 h-400px grayscale rounded"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.2531227561085!2d10.19178487575112!3d36.836413472236906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34ea97b45431%3A0x9fa628e4f017bd3f!2sConservatoire%20Elkindy!5e0!3m2!1sen!2sin!4v1710088795447!5m2!1sen!2sin"
                  height={500}
                  style={{ border: 0 }}
                  aria-hidden="false"
                  tabIndex={0}
                />
              </div>
            </div>
          </div>
        </section>
        {/* =======================
  Map END */}
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;
