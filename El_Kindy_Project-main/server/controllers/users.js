import User from "../models/User.js"; // Import the User model
import bcrypt from "bcrypt";
import { sendEmail } from '../utils/sendMailer.js';
import jwt from "jsonwebtoken";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';



const addTeacher = async (req, res) => {
  try {
      // Extract required and optional teacher details from the request body
      const { 
          firstName, 
          lastName, 
          email, 
          password, 
          coursesTaught, 
          classesTeaching, // Updated field name
          studentsTaught,
          dateOfBirth, 
          address, 
          gender, 
          phoneNumber1, 
          phoneNumber2, 
          disponibilite, 
          qualifications, 
          experienceYears 
      } = req.body;

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a new user with the role of 'teacher' and provided details
      const newTeacher = new User({
          firstName,
          lastName,
          email,
          password: passwordHash,
          passwordDecoded: password,
          roles: ['teacher'],
          dateOfBirth,
          address,
          verified: true,
          gender,
          phoneNumber1,
          phoneNumber2,
          disponibilite,
          teacherInfo: {
              coursesTaught,
              classesTeaching, // Updated field name
              studentsTaught,
              qualifications,
              experienceYears
          }
      });

      // Save the new teacher to the database
      await newTeacher.save();

      const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Elkindy</title>
  <style>
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
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
      background-color: #4CAF50; /* Green color for the header */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-bottom: 5px solid #4CAF50; /* Matching the header */
      display: block;
      margin-bottom: 30px;
    }
    .content {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .content h2 {
      color: #4CAF50; /* Green color for the headings */
      margin-bottom: 20px;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .login-details {
      background-color: #E8F5E9; /* Light green for success */
      border-left: 3px solid #4CAF50; /* Green border for success */
      padding: 15px;
      margin: 25px 0;
      display: inline-block;
      transition: box-shadow 0.3s ease;
    }
    .login-details:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .footer {
      background-color: #4CAF50; /* Green color for the footer */
      color: #ffffff;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
      <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">

      <p>Dear ${newTeacher.firstName + " " + newTeacher.lastName},</p>
      <p>We are pleased to inform you that your preinscription has been approved. Welcome to Elkindy, your new home for musical excellence!</p>
      <div class="login-details" style="width: 90%;">
        <h4><strong>Your Account Details:</strong></h4>
        <p><strong>Email:</strong> ${newTeacher.email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
      <p>Welcome aboard,</p>
      <p><strong>The Elkindy Team</strong></p>
    </div>
    <div class="footer">
      © 2024 Elkindy. All rights reserved.
    </div>
  </div>
</body>
</html>`;

    await sendEmail(newTeacher.email, "Welcome to Elkindy", body);

      // Send success response
      res.status(201).json({ message: 'Teacher added successfully', teacher: newTeacher });
  } catch (error) {
      // If an error occurs, send error response
      console.error('Error adding teacher:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



// Define the route handler to add a student and their parent
const addStudentAndParent = async (req, res) => {
    try {
        // Extract student and parent details from the request body
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            dateOfBirth, 
            address, 
            gender, 
            phoneNumber1, 
            phoneNumber2,
            disponibilite,
            classLevel,
            coursesEnrolled,
            parentName,
            parentEmail,
            parentPhone
        } = req.body;

         // Check if all required fields are provided
         if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user document for the student
        const student = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            passwordDecoded: password,
            dateOfBirth,
            address,
            gender,
            verified: true,
            phoneNumber1,
            phoneNumber2,
            disponibilite,
            roles: ['student'], // Set role to student
            studentInfo: {
                classLevel,
                coursesEnrolled,
                parentName,
                parentEmail,
                parentPhone
                
            }
        });

        

        // Save the student document
        await student.save();

        
      const body = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Elkindy</title>
        <style>
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
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
            background-color: #4CAF50; /* Green color for the header */
            color: #ffffff;
            padding: 20px;
            text-align: center;
          }
          .content img {
            max-width: 100%;
            height: auto;
            border-bottom: 5px solid #4CAF50; /* Matching the header */
            display: block;
            margin-bottom: 30px;
          }
          .content {
            padding: 20px;
            color: #333333;
            text-align: center;
          }
          .content h2 {
            color: #4CAF50; /* Green color for the headings */
            margin-bottom: 20px;
          }
          .content p {
            line-height: 1.6;
            margin-bottom: 15px;
          }
          .login-details {
            background-color: #E8F5E9; /* Light green for success */
            border-left: 3px solid #4CAF50; /* Green border for success */
            padding: 15px;
            margin: 25px 0;
            display: inline-block;
            transition: box-shadow 0.3s ease;
          }
          .login-details:hover {
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }
          .footer {
            background-color: #4CAF50; /* Green color for the footer */
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="content">
            <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
            <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">
      
            <p>Dear ${student.firstName + " " + student.lastName},</p>
            <p>We are pleased to inform you that your preinscription has been approved. Welcome to Elkindy, your new home for musical excellence!</p>
            <div class="login-details" style="width: 90%;">
              <h4><strong>Your Account Details:</strong></h4>
              <p><strong>Email:</strong> ${student.email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
            <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
            <p>Welcome aboard,</p>
            <p><strong>The Elkindy Team</strong></p>
          </div>
          <div class="footer">
            © 2024 Elkindy. All rights reserved.
          </div>
        </div>
      </body>
      </html>`;
      
          await sendEmail(student.email, "Welcome to Elkindy", body);

        // Send success response
        res.status(201).json({ message: 'Student and parent added successfully' });
    } catch (error) {
        // If an error occurs, send error response
        console.error('Error adding student and parent:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Define the addAdmin function
const addAdmin = async (req, res) => {
    try {
        // Extract admin details from the request body
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            picturePath, 
            verified, 
            refreshToken, 
            authSource, 
            dateOfBirth, 
            address, 
            gender, 
            phoneNumber1, 
            phoneNumber2, 
            disponibilite 
            // Add any additional fields here as needed
        } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user with the role of 'admin' and provided details
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            passwordDecoded: password,
            picturePath: picturePath || "",
            verified: true,
            refreshToken: refreshToken || "",
            authSource: authSource || "local",
            roles: ['admin'],
            dateOfBirth: dateOfBirth || null,
            address: address || "",
            gender: gender || "",
            phoneNumber1: phoneNumber1 || "",
            phoneNumber2: phoneNumber2 || "",
            disponibilite: disponibilite || []
            // Add any additional fields here as needed
        });

        // Save the new admin to the database
        const savedUser = await newAdmin.save();
        const body = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Elkindy</title>
          <style>
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
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
              background-color: #4CAF50; /* Green color for the header */
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .content img {
              max-width: 100%;
              height: auto;
              border-bottom: 5px solid #4CAF50; /* Matching the header */
              display: block;
              margin-bottom: 30px;
            }
            .content {
              padding: 20px;
              color: #333333;
              text-align: center;
            }
            .content h2 {
              color: #4CAF50; /* Green color for the headings */
              margin-bottom: 20px;
            }
            .content p {
              line-height: 1.6;
              margin-bottom: 15px;
            }
            .login-details {
              background-color: #E8F5E9; /* Light green for success */
              border-left: 3px solid #4CAF50; /* Green border for success */
              padding: 15px;
              margin: 25px 0;
              display: inline-block;
              transition: box-shadow 0.3s ease;
            }
            .login-details:hover {
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .footer {
              background-color: #4CAF50; /* Green color for the footer */
              color: #ffffff;
              text-align: center;
              padding: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="content">
              <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
              <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">
        
              <p>Dear ${savedUser.firstName + " " + savedUser.lastName},</p>
              <p>We are pleased to inform you that your preinscription has been approved. Welcome to Elkindy, your new home for musical excellence!</p>
              <div class="login-details" style="width: 90%;">
                <h4><strong>Your Account Details:</strong></h4>
                <p><strong>Email:</strong> ${savedUser.email}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>
              <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
              <p>Welcome aboard,</p>
              <p><strong>The Elkindy Team</strong></p>
            </div>
            <div class="footer">
              © 2024 Elkindy. All rights reserved.
            </div>
          </div>
        </body>
        </html>`;
        
            await sendEmail(savedUser.email, "Welcome to Elkindy", body);
        // Send success response
        res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
    } catch (error) {
        // If an error occurs, send error response
        console.error('Error adding admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const removeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Logic to remove the user from the database (e.g., using Mongoose)
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  try {
    // Check if password is provided
    if (userData.password) {
      // If password is provided, hash it
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(userData.password, salt);
      // Set hashed password and decoded password in user data
      userData.passwordDecoded = userData.password; // Update decoded password
      userData.password = passwordHash;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  const teacherId = req.params.teacherId;
  const teacherData = req.body;

  try {
    // Check if password is provided
    if (teacherData.password) {
      // If password is provided, hash it
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(teacherData.password, salt);
      // Set hashed password and decoded password in teacher data
      teacherData.passwordDecoded = teacherData.password; // Update decoded password
      teacherData.password = passwordHash;
    }
    
    // Update user fields
    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      {
        $set: {
          'firstName': teacherData.firstName,
          'lastName': teacherData.lastName,
          'email': teacherData.email,
          'password': teacherData.password,
          'passwordDecoded': teacherData.passwordDecoded,
          'dateOfBirth': teacherData.dateOfBirth,
          'address': teacherData.address,
          'gender': teacherData.gender,
          'phoneNumber1': teacherData.phoneNumber1,
          'phoneNumber2': teacherData.phoneNumber2,
          'disponibilite': teacherData.disponibilite,
          'teacherInfo.coursesTaught': teacherData.coursesTaught,
          'teacherInfo.classesTeaching': teacherData.classesTeaching,
          'teacherInfo.studentsTaught': teacherData.studentsTaught,
          'teacherInfo.qualifications': teacherData.qualifications,
          'teacherInfo.experienceYears': teacherData.experienceYears
        }
      },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStudent = async (req, res) => {
  const studentId = req.params.studentId;
  const studentData = req.body;

  try {
      // Check if password is provided
      if (studentData.password) {
          // If password is provided, hash it
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const passwordHash = await bcrypt.hash(studentData.password, salt);
          // Set hashed password and decoded password in student data
          studentData.passwordDecoded = studentData.password; // Update decoded password
          studentData.password = passwordHash;
      }

      // Update user fields
      const updatedStudent = await User.findByIdAndUpdate(
          studentId,
          {
              $set: {
                  'firstName': studentData.firstName,
                  'lastName': studentData.lastName,
                  'email': studentData.email,
                  'password': studentData.password,
                  'passwordDecoded': studentData.passwordDecoded,
                  'dateOfBirth': studentData.dateOfBirth,
                  'address': studentData.address,
                  'gender': studentData.gender,
                  'phoneNumber1': studentData.phoneNumber1,
                  'phoneNumber2': studentData.phoneNumber2,
                  'disponibilite': studentData.disponibilite,
                  'studentInfo.classLevel': studentData.classLevel,
                  'studentInfo.coursesEnrolled': studentData.coursesEnrolled,
                  'studentInfo.parentName': studentData.parentName,
                  'studentInfo.parentEmail': studentData.parentEmail,
                  'studentInfo.parentPhone': studentData.parentPhone
              }
          },
          { new: true }
      );

      if (!updatedStudent) {
          return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};








// Define the blockUser function
const blockUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Logic to update user data to mark as blocked in the database
    // Example:
    const blockedUser = await User.findByIdAndUpdate(userId, { blocked: true }, { new: true });
    
    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const body = `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Elkindy</title>
              <style>
                @keyframes fadeIn {
                  0% { opacity: 0; }
                  100% { opacity: 1; }
                }
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
                    background-color: #ff6347; /* Coral color for the header */
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                  }
                  
                  .content img {
                    max-width: 100%;
                    height: auto;
                    border-bottom: 5px solid #ff6347; /* Matching the header */
                    display: block;
                    margin-bottom: 30px;
                  }
                  
                  .content {
                    padding: 20px;
                    color: #333333;
                    text-align: center;
                  }
                  
                  .content h2 {
                    color: #ff6347; /* Coral color for the headings */
                    margin-bottom: 20px;
                  }
                  
                  .content p {
                    line-height: 1.6;
                    margin-bottom: 15px;
                  }
                  
                  .login-details {
                    background-color: #f8d7da; /* Light red for error */
                    border-left: 3px solid #dc3545; /* Red border for error */
                    padding: 15px;
                    margin: 25px 0;
                    display: inline-block;
                    transition: box-shadow 0.3s ease;
                  }
                  
                  .login-details:hover {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                  }
                  
                  .footer {
                    background-color: #ff6347; /* Coral color for the footer */
                    color: #ffffff;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                  }
                  
                /* Additional styles if necessary */
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="content">
                  <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
                  <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">
            
                  <p>Dear ${
                    blockedUser.firstName + " " + blockedUser.lastName
                  },</p>
                  <p>We are thrilled to welcome you to Elkindy, your new home for musical excellence. At Elkindy, we embrace the diversity of age, experience, and nationality, providing a vibrant community where music education is both accessible and exceptional.</p>
                  <div class="login-details" style="width: 90%;">
                  <p>We regret to inform you that your account has been temporarily blocked.</p>
                  <p>This action has been taken due to a violation of our terms of service or community guidelines.</p>
                  <p>If you believe this is an error or if you have any questions, please don't hesitate to contact our support team for further assistance.</p>
                  <p>Thank you for your understanding.</p>                    </div>
                  <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
                  <p>Welcome aboard,</p>
                  <p><strong>The Elkindy Team</strong></p>
                </div>
                <div class="footer">
                  © 2024 Elkindy. All rights reserved.
                </div>
              </div>
            </body>
        </html>`;
    await sendEmail(blockedUser.email, "Notification: Your Account Has Been Blocked", body);

    res.status(200).json({ message: "User blocked successfully", user: blockedUser });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Define the unblockUser function
const unblockUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Logic to update user data to mark as unblocked in the database
    // Example:
    const unblockedUser = await User.findByIdAndUpdate(userId, { blocked: false }, { new: true });
    
    if (!unblockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Elkindy</title>
  <style>
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
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
      background-color: #4CAF50; /* Green color for the header */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-bottom: 5px solid #4CAF50; /* Matching the header */
      display: block;
      margin-bottom: 30px;
    }
    .content {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .content h2 {
      color: #4CAF50; /* Green color for the headings */
      margin-bottom: 20px;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .login-details {
      background-color: #E8F5E9; /* Light green for success */
      border-left: 3px solid #4CAF50; /* Green border for success */
      padding: 15px;
      margin: 25px 0;
      display: inline-block;
      transition: box-shadow 0.3s ease;
    }
    .login-details:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .footer {
      background-color: #4CAF50; /* Green color for the footer */
      color: #ffffff;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
      <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">

      <p>Dear ${unblockedUser.firstName + " " + unblockedUser.lastName},</p>
      <p>We are pleased to inform you that your preinscription has been approved. Welcome to Elkindy, your new home for musical excellence!</p>
      <div class="login-details" style="width: 90%;">
      <p>We are pleased to inform you that your account has been successfully unblocked. You now have full access to your Elkindy account.</p>
      <p>If you have any questions or concerns regarding your account status, please feel free to contact our support team for assistance.</p>
      <p>Thank you for your patience and understanding.</p>
      </div>
      <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
      <p>Welcome aboard,</p>
      <p><strong>The Elkindy Team</strong></p>
    </div>
    <div class="footer">
      © 2024 Elkindy. All rights reserved.
    </div>
  </div>
</body>
</html>`;
    await sendEmail(unblockedUser.email, "Notification: Your Account Has Been unblocked", body);

    res.status(200).json({ message: "User unblocked successfully", user: unblockedUser });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editUserProfile = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    
    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'firstName': userData.firstName,
          'lastName': userData.lastName,
          'email': userData.email,
          'dateOfBirth': userData.dateOfBirth,
          'address': userData.address,
          'picturePath': userData.picturePath,
          'gender': userData.gender,
          'phoneNumber1': userData.phoneNumber1,
          'phoneNumber2': userData.phoneNumber2,
          'teacherInfo.qualifications': userData.qualifications,
          'teacherInfo.experienceYears': userData.experienceYears,
          'studentInfo.parentName': userData.parentName,
          'studentInfo.parentProfession': userData.parentProfession,
          'studentInfo.parentEmail': userData.parentEmail,
          'studentInfo.parentPhone': userData.parentPhone
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update email address
const updateEmail = async (req, res) => {
  const userId = req.params.id; // Assuming you have middleware to extract user ID from JWT

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: req.body.email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Email updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update password
const updatePassword = async (req, res) => {
  const userId = req.params.id; // Assuming you have middleware to extract user ID from JWT
  const { currentPassword, newPassword } = req.body;

  try {
    // Validate current password - Example code, implement your own logic
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set: {
         password: hashedPassword,
      passwordDecoded: newPassword 
      }},
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTimeSlots = async (req, res) => {
  const userId = req.params.id;
  const { disponibilite } = req.body;

  try {
    // Find the user by ID and update the disponibilite field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { disponibilite } },
      { new: true }
    );

    // Check if the user exists and send the updated user object in the response
    if (updatedUser) {
      res.json({ message: 'Time slots updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating time slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const ajouter2FA = async (req, res) => {
  const { email } = req.params;
  let qrCodeUrl; // Define qrCodeUrl outside the try block

  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    try {
      qrCodeUrl = await new Promise((resolve, reject) => {
        QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(image_data);
          }
        });
      });
      console.log('qrcode', qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return res.status(500).send('Internal Server Error');
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        TwoFactorAuthentication: true,
        secret: secret.base32,
        qrCode: qrCodeUrl,
      },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('2FA reset successful for user:',email);
    //sendMailSecretCode2Fa(email,secret.base32);
    res.status(200).json({ message: '2FA réinitialisé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du 2FA' });
  }
};


// Define the route for getting teacher availability
const getDispo = async (req, res) => {
  try {
    // Find all teachers with their disponibilite
    const teachers = await User.find({ roles: "teacher" }, { disponibilite: 1 });

    // Extract disponibilite from each teacher and create a combined list
    const availabilityList = teachers.reduce((acc, teacher) => {
      acc.push(...teacher.disponibilite);
      return acc;
    }, []);

    // Remove duplicates from the availability list
    const uniqueAvailabilityList = Array.from(new Set(availabilityList.map(JSON.stringify)), JSON.parse);

    return res.status(200).json(uniqueAvailabilityList);
  } catch (error) {
    console.error("Error fetching teacher availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// Export the route handler
export { addStudentAndParent, addTeacher, addAdmin, removeUser, 
  updateUser, updateTeacher, updateStudent,  blockUser, unblockUser,
   editUserProfile, updateEmail, updatePassword, updateTimeSlots, ajouter2FA
  ,getDispo };

