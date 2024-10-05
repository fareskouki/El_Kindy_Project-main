import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../state";
import { ToastContainer } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";

const GoogleAuth = () => {
  const clientId =
    "96761309582-mtdj5s9a4n8jscpq0p2v8ju87ltvhpho.apps.googleusercontent.com";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);

  const login = async (values, onSubmitProps) => {
    setOpen(true);
    try {
      //console.log("Logging in...", values);
      const loggedInResponse = await fetch(
        "http://localhost:3001/auth/googleAuth",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const loggedIn = await loggedInResponse.json();
      console.log("LoggedIn", loggedIn);
      if (loggedIn.accessToken && loggedIn.refreshToken) {
      //  console.log("logged successfully!!");
        console.log("after LoggedIn", loggedIn);

        dispatch(
          setLogin({
            accessToken: loggedIn.accessToken,
            refreshToken: loggedIn.refreshToken,
          })
        );
        const accessTokenn = loggedIn.accessToken;
        const userRoles = accessTokenn ? jwtDecode(accessTokenn).roles : []; 
        
        if (userRoles.includes('admin')|| userRoles.includes('superAdmin')) {
          navigate("/dashboard-admin");
          //console.log("userRole 1: ",userRoles);
        }else if (userRoles.includes('teacher') )  {
          navigate('/dashbordTeacher');
          //console.log("userRole 2: ",userRoles);
        }
        
        else if(userRoles.includes('parent') || userRoles.includes('student')){
          //console.log("userRole 3: ",userRoles);
            navigate("/home");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setOpen(false);
    }
  };

  const handleSuccess = async (credentialResponse) => {
    //console.log("Success:", credentialResponse);
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    //console.log("User Object:", credentialResponseDecoded);

    // Prepare JSON object with decoded token data
    const userData = {
      email: credentialResponseDecoded.email,
      email_verified: credentialResponseDecoded.email_verified,
      given_name: credentialResponseDecoded.given_name,
      family_name: credentialResponseDecoded.family_name,
      picture: credentialResponseDecoded.picture,
    };
   // console.log("User Data:", userData);
    await login(userData);
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <GridLoader color={color} loading={loading} size={20} />
      </Backdrop>
    </>
  );
};

export default GoogleAuth;
