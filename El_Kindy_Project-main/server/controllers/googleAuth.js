// API for Google Authentication
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from '../utils/sendMailer.js';

const googleAuth = async (req, res) => {
  try {
    const { email, email_verified, given_name, family_name, picture } = req.body;
    console.log("Intercepted User Data:", { email, email_verified, given_name, family_name, picture });
    
    // Find the user by email
    let user = await User.findOne({ email });

    // If the user does not exist, create a new account
    if (!user) {
      console.log("User does not exist. Creating new account...");
      
      // Create a new user
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        password: "google",
        picturePath: picture,
        verified: email_verified,
        authSource: "google"
      });

      // Save the new user to the database
      user = await user.save();
      console.log("New User:", user);
    }

    // Generate tokens for the user
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = jwt.sign({ id: user._id, fullName: user.firstName + " " + user.lastName, roles: user.roles ,
      email : user.email, picturePath: user.picturePath, authSource: user.authSource , gender: user.gender}, process.env.JWT_SECRET, { expiresIn: "30m" });    

    // Return the tokens and user data
    return res.status(200).json({ accessToken, refreshToken: user.refreshToken, message: "Logged in successfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
};

  
  export default googleAuth;
  

