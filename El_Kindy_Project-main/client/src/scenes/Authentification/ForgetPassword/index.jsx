import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";

//toast
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";

const forgotPassSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const initialValuesForgotPass = {
  email: "",
};
function Index() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  //toast
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#399ebf");

  const [open, setOpen] = useState(false);

  const toastShowError = (msg) => {
    toast.error(msg, {
      autoClose: 1700,
      style: {
        color: "red", // Text color
      },
    });
  };

  const toastShowSeccus = (msg) => {
    toast.success(msg, {
      autoClose: 1700,
      style: {
        color: "green", // Text color
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  const forgotPassword = async (values) => {
    setOpen(true);
    //console.log('values', values);

    const forgotPasswordResponse = await fetch(
      "http://localhost:3001/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const savedForgot = await forgotPasswordResponse.json();
    if (forgotPasswordResponse.status === 404) {
      toastShowError(savedForgot.message);
      setOpen(false);
    } else if (forgotPasswordResponse.status === 200) {
      setOpen(false);
      toastShowSeccus("Check your email for further instructions.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await forgotPassword(values);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <GridLoader color={color} loading={loading} size={20} />
      </Backdrop>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
          <div className="container-fluid">
            <div className="row">
              {/* left */}
              <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                <div className="p-3 p-lg-5">
                  {/* Title */}
                  <div className="text-center">
                    <h2 className="fw-bold">
                      Welcome to our largest community
                    </h2>
                    <p className="mb-0 h6 fw-light">
                      Let's learn something new today!
                    </p>
                  </div>
                  {/* SVG Image */}
                  <img
                    src="assets/images/element/02.svg"
                    className="mt-5"
                    alt
                  />
                  {/* Info */}
                  <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                    <ul className="avatar-group mb-2 mb-sm-0">
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="assets/images/avatar/01.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="assets/images/avatar/02.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="assets/images/avatar/03.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="assets/images/avatar/04.jpg"
                          alt="avatar"
                        />
                      </li>
                    </ul>
                    {/* Content */}
                    <p className="mb-0 h6 fw-light ms-0 ms-sm-3">
                      4k+ Students joined us, now it's your turn.
                    </p>
                  </div>
                </div>
              </div>
              {/* Right */}
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div className="row my-5">
                  <div className="col-sm-10 col-xl-12 m-auto">
                    {/* Title */}
                    <span className="mb-0 fs-1">🤔</span>
                    <h1 className="fs-2">Forgot Password?</h1>
                    <h5 className="fw-light mb-4">
                      To receive a new password, enter your email address below.
                    </h5>
                    {/* Form START */}
                    <Formik
                      initialValues={initialValuesForgotPass}
                      validationSchema={forgotPassSchema}
                      onSubmit={handleFormSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          {/* Email */}
                          <div className="mb-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Email address *
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                <i className="bi bi-envelope-fill" />
                              </span>
                              <input
                                type="email"
                                className="form-control border-0 bg-light rounded-end ps-1"
                                placeholder="E-mail"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                              />
                            </div>
                            {errors.email && touched.email && (
                              <div className="text-danger">{errors.email}</div>
                            )}
                          </div>
                          {/* Button */}
                          <div className="align-items-center">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary mb-0"
                                type="submit"
                              >
                                Reset password
                              </button>
                            </div>
                          </div>
                          <div
                            style={{ display: "grid", justifyContent: "end" }}
                          >
                            <div
                              className="text-primary-hover  mt-3"
                              style={{ fontSize: "1rem" }}
                            >
                              <Link to="/" className="text-secondary">
                                <u>Back to Login !</u>
                              </Link>
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                    {/* Form END */}
                  </div>
                </div>{" "}
                {/* Row END */}
              </div>
            </div>{" "}
            {/* Row END */}
          </div>
        </section>
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;
