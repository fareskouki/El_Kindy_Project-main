import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";

//toast
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";

const resetPassSchema = yup.object().shape({
  password: yup.string().required("required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("required"),
});

const initialValuesResetPass = {
  password: "",
  confirmPassword: "",
};

function Index() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //toast
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#399ebf");

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
      autoClose: 2200,
      style: {
        color: "green", // Text color
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const { id, token } = useParams();

  const resetPassword = async (values) => {
    //console.log("values", values);
    setOpen(true);
    const resetPasswordResponse = await fetch(
      `http://localhost:3001/auth/reset-password/${id}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );
    const savedReset = await resetPasswordResponse.json();
      
    if (savedReset.status === "Success") {
      console.log("Password changed successfully!!");
      console.log("Res", savedReset);
      setOpen(false);
      navigate("/");
    } else {
      console.log("Res", savedReset.message);
    }

    /*
     if (resetPasswordResponse.status === 403) {
      toastShowError("Access denied !");
      setOpen(false);
    } else if (resetPasswordResponse.status === 401) {
      toastShowWarning("Token expired !");
      setOpen(false);
    } else if (resetPasswordResponse.status === 400) {
      toastShowError(savedReset.message);
      setOpen(false);
    } else if (resetPasswordResponse.status === 200) {
      setOpen(false);
      toastShowSeccus("Password changed successfully !");
    }
    */
  };

  const handleFormSubmit = async (values) => {
    try {
      await resetPassword(values);
      console.log(values);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
          <div className="container-fluid">
            <div className="row">
              {/* left */}
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <div className="row my-5">
                  <div className="col-sm-10 col-xl-12 m-auto">
                    {/* Title */}
                    <span className="mb-0 fs-1">🤔</span>
                    <h1 className="fs-2">Reset Password?</h1>
                    <h5 className="fw-light mb-4">
                      To change your password, enter your new password below.
                    </h5>
                    <Formik
                      initialValues={initialValuesResetPass}
                      validationSchema={resetPassSchema}
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
                  </div>
                </div>{" "}
                {/* Row END */}
              </div>

              {/* Right */}
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
                    src="/assets/images/element/02.svg"
                    className="mt-5"
                    alt=""
                  />
                  {/* Info */}
                  <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                    <ul className="avatar-group mb-2 mb-sm-0">
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="/assets/images/avatar/01.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="/assets/images/avatar/02.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="/assets/images/avatar/03.jpg"
                          alt="avatar"
                        />
                      </li>
                      <li className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          src="/assets/images/avatar/04.jpg"
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
