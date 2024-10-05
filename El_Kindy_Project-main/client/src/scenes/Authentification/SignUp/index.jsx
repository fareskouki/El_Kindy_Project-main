import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { Formik } from "formik";
import GridLoader from "react-spinners/GridLoader";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Index() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#399ebf");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toastShowError = (msg) => {
    toast.error(msg, {
      autoClose: 2000,
      style: {
        color: "red", // Text color
      },
    });
  };

  const toastShowSeccus = (msg) => {
    toast.success(msg, {
      autoClose: 2500,
      style: {
        color: "green", // Text color
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const register = async (values) => {
    setOpen(true);
    console.log("values", values);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    if (savedUserResponse.status === 500) {
      toastShowError("Account already exist !");
      setOpen(false);
    } else if (savedUserResponse.status === 201) {
      const savedUser = await savedUserResponse.json();
      //console.log('user', savedUser);
      setOpen(false);
      toastShowSeccus(savedUser.message);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await register(values);
    } catch (error) {
      setOpen(false);
      toastShowError(error.message);
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
                    alt=""
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
              <div className="col-12 col-lg-6 m-auto overflow-auto">
                <div className="row my-5">
                  <div className="col-sm-10 col-xl-8 m-auto">
                    {/* Title */}
                    <img
                      src="assets/images/element/03.svg"
                      className="h-40px mb-2"
                      alt=""
                    />
                    <h2>Sign up for your account!</h2>
                    <p className="lead mb-4">
                      Nice to see you! Please Sign up with your account.
                    </p>

                    <Formik
                      initialValues={initialValuesRegister}
                      validationSchema={registerSchema}
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
                          {/* firstName */}
                          <div className="mb-4">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              First Name *
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                <i className="bi bi-envelope-fill" />
                              </span>
                              <input
                                type="text"
                                name="firstName"
                                className={`form-control border-0 bg-light rounded-end ps-1 ${
                                  errors.firstName && touched.firstName
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder="First Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.firstName}
                              />
                            </div>
                            {errors.firstName && touched.firstName && (
                              <div className="text-danger">
                                {errors.firstName}
                              </div>
                            )}
                          </div>

                          {/* lastName */}
                          <div className="mb-4">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Last Name *
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                <i className="bi bi-envelope-fill" />
                              </span>
                              <input
                                type="text"
                                name="lastName"
                                className="form-control border-0 bg-light rounded-end ps-1"
                                placeholder="Last Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lastName}
                              />
                            </div>
                            {errors.lastName && touched.lastName && (
                              <div className="text-danger">
                                {errors.lastName}
                              </div>
                            )}
                          </div>
                          {/* Email */}
                          <div className="mb-4">
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
                                name="email"
                                className="form-control border-0 bg-light rounded-end ps-1"
                                placeholder="E-mail"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                              />
                            </div>
                            {errors.email && touched.email && (
                              <div className="text-danger">{errors.email}</div>
                            )}
                          </div>
                          <div>
                            {/* Password */}
                            <div className="mb-4">
                              <label
                                htmlFor="inputPassword5"
                                className="form-label"
                              >
                                Password *
                              </label>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                  <i className="fas fa-lock" />
                                </span>
                                <input
                                  type="password"
                                  name="password"
                                  className="form-control border-0 bg-light rounded-end ps-1"
                                  placeholder="*********"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.password}
                                />
                              </div>
                              {errors.password && touched.password && (
                                <div className="text-danger">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            {/* Confirm Password */}
                            <div className="mb-4">
                              <label
                                htmlFor="inputPassword6"
                                className="form-label"
                              >
                                Confirm Password *
                              </label>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                  <i className="fas fa-lock" />
                                </span>
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  className="form-control border-0 bg-light rounded-end ps-1"
                                  placeholder="*********"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.confirmPassword}
                                />
                              </div>
                              {errors.confirmPassword &&
                                touched.confirmPassword && (
                                  <div className="text-danger">
                                    {errors.confirmPassword}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Check box */}
                          <div className="mb-4">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="checkbox-1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="checkbox-1"
                              >
                                By signing up, you agree to the
                                <a href="#"> terms of service</a>
                              </label>
                            </div>
                          </div>
                          {/* Button */}
                          <div className="align-items-center mt-0">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary mb-0"
                                type="submit"
                              >
                                Sign Up
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                    {/* Social buttons */}
                    <div className="row">
                      {/* Divider with text */}
                      <div className="position-relative my-4">
                        <hr />
                        <p className="small position-absolute top-50 start-50 translate-middle bg-body px-5">
                          Or
                        </p>
                      </div>
                      {/* Social btn */}
                      <div className="col-xxl-6 d-grid">
                        <a href="#" className="btn bg-google mb-2 mb-xxl-0">
                          <i className="fab fa-fw fa-google text-white me-2" />
                          Signup with Google
                        </a>
                      </div>
                      {/* Social btn */}
                      <div className="col-xxl-6 d-grid">
                        <a href="#" className="btn bg-facebook mb-0">
                          <i className="fab fa-fw fa-facebook-f me-2" />
                          Signup with Facebook
                        </a>
                      </div>
                    </div>
                    {/* Sign up link */}
                    <div className="mt-4 text-center">
                      <span>
                        Already have an account?
                        <Link to="/"> Sign in here</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;