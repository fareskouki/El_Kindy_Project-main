import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";


const EmailVerify = () => {
    const navigate = useNavigate();
    const { id, token } = useParams();
    useEffect(() => {

    const verifyAccount = async () => {
    
        const verifyAccountResponse = await fetch(
          `http://localhost:3001/auth/verify-account/${id}/verify`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const savedReset = await verifyAccountResponse.json();
    
        if (savedReset) {
          console.log("Account verified successfully!!");
          console.log("Res", savedReset);
          navigate("/");
        } else{
            console.log("error");
        }
      };

      verifyAccount();
      }, []);
  return (
    <>
    
    </>
  )
}

export default EmailVerify