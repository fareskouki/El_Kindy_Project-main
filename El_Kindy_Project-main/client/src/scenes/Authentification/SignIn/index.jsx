import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setLogout } from "../../../state";
import { useSelector } from "react-redux";

//toast
import GridLoader from "react-spinners/GridLoader";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import GoogleAuth from "components/GoogleAuth";
import FacebookLogin from "components/FacebookLogin";
import { jwtDecode } from "jwt-decode";

function Index() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.accessToken);
  useEffect(() => {
    if (isAuth) {
      const userRoles = isAuth ? jwtDecode(isAuth).roles : []; 
        //console.log("userRole ",userRoles);
        if (userRoles.includes('admin') || userRoles.includes('superAdmin')) {
          navigate("/dashboard-admin");
        }else if (userRoles.includes('teacher') )  {
          navigate('/dashboard-teacher');
        }
         else if(userRoles.includes('parent') || userRoles.includes('student')){
            navigate("/dashboard-student");

        }
    }
    
  });

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#399ebf");

  const [open, setOpen] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false); // State to manage visibility of token input


  const toastShowError = (msg) => {
    toast.error(msg, {
      autoClose: 2000,
      style: {
        color: "red", // Text color
      },
    });
  };

  const toastShowWarning = (msg) => {
    toast.warning(msg, {
      autoClose: 1700,
      style: {
        color: "#f1c232", // Text color
      },
    });
  };

  const toastShowSeccus = (msg) => {
    toast.success(msg, {
      autoClose: 2000,
      style: {
        color: "green", // Text color
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };
  
  const login = async (values, onSubmitProps) => {
    setOpen(true);
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      if (loggedInResponse.status === 500) {
        toastShowError("Server error, please try again later.");
        setOpen(false);
      } else if (loggedInResponse.status === 400) {
        toastShowError(loggedIn.message);
        setOpen(false);
      } else if (loggedInResponse.status === 401) {
        if (loggedIn.error === "Invalid token for 2FA") {
          // If the error is due to invalid 2FA token, show the token input box
          setShowTokenInput(true);
          setOpen(false);
        } else {
          toastShowWarning(loggedIn.message);
          setOpen(false);
          dispatch(setLogout()); // Logout on refresh token error
        }
      } else if (loggedInResponse.status === 200) {
        console.log("accessToken", loggedIn.accessToken);
        console.log("logged successfully!!");
        setOpen(false);
        dispatch(
          setLogin({
            accessToken: loggedIn.accessToken,
            refreshToken: loggedIn.refreshToken,
          })
        );
        const accessTokenn = loggedIn.accessToken;
        const userRoles = accessTokenn ? jwtDecode(accessTokenn).roles : []; 


        //console.log("userRole ",userRoles);
        if (userRoles.includes('admin') || userRoles.includes('superAdmin')) {
          navigate("/dashboard-admin"); 

        }else if (userRoles.includes('teacher')){
          navigate('/dashboard-teacher');
        } 
        else if (userRoles.includes('student') || userRoles.includes('parent')) {

            navigate("/dashboard-student");
        }

      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    //console.log("Values",formValues);
    await login(formValues);
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

              <div className="col-12 col-lg-6 ">
                <img
                  className=""
                  src="/assets/images/logo/logo.png"
                  style={{
                    width: "150px",
                    height: "100px",
                  }}
                  alt
                />
                <div className="row my-5">
                  <div className="col-sm-10 col-xl-8 m-auto">
                  
                    {/* Title */}
                    <h1 className="fs-2">Login into EL KINDY <img
                      src="assets/images/element/music-notes-svgrepo-com.svg"
                      className="h-40px mb-2"
                      alt=""
                    /></h1>
                    <p className="lead mb-4">
                      Nice to see you! Please log in with your account.
                    </p>
                    {/* Form START */}
                    <form onSubmit={handleFormSubmit}>
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
                            id="exampleInputEmail1"
                          />
                        </div>
                      </div>
                      {/* Password */}
                      <div className="mb-4">
                        <label htmlFor="inputPassword5" className="form-label">
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
                            placeholder="password"
                            id="inputPassword5"
                          />
                        </div>
                        <div id="passwordHelpBlock" className="form-text">
                          Your password must be 8 characters at least
                        </div>
                      </div>
                      {/* Check box */}
                      <div className="mb-4 d-flex justify-content-between mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="text-primary-hover">
                          <Link
                            to="/forgot-password"
                            className="text-secondary"
                          >
                            <u>Forgot password?</u>
                          </Link>
                        </div>
                      </div>
                      {/* Token input box */}
                      {showTokenInput && (
                        <div className="mb-4">
                          <label htmlFor="inputToken" className="form-label">
                            2FA Token *
                          </label>
                          <input
                            type="text"
                            name="tokens"
                            className="form-control border-0 bg-light rounded-end ps-1"
                            placeholder="Enter 2FA token"
                            id="inputToken"
                          />
                        </div>
                      )}
                      {/* Button */}
                      <div className="align-items-center mt-0">
                        <div className="d-grid">
                          <button
                            className="btn btn-primary mb-0"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    </form>
                    {/* Form END */}
                    {/* Social buttons and divider */}
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
                        <GoogleAuth />
                      </div>
                      {/* Social btn */}
                     
                        <FacebookLogin />
                        

                    </div>
                    {/* Sign up link */}
                    <div className="mt-4 text-center">
                      <span>
                        Don't have an account?{" "}
                        <Link to="/sign-up">Signup here</Link>
                      </span>
                    </div>
                  </div>
                </div>{" "}
                {/* Row END */}
              </div>

              {/* Right */}
              <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                  
                <div className="p-3 p-lg-5">
                  {/* Title */}
                  <div className="text-center">
                    <h1 className="fw-bold">
                      Art has been in you ! 
                    </h1>
                    <h4 className="fw-bold">
                        For 20 years ...
                    </h4>
                    
                  </div>
                  {/* SVG Image */}
                  <img
                    src="assets/images/element/orchpreview.png"
                    className="mt-5"
                    alt
                  />
                  {/* Info */}
                  <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                    {/* Avatar group */}
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