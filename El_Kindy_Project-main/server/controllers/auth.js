import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Classe from "../models/ClassModel.js";
import { sendEmail } from '../utils/sendMailer.js';
import speakeasy from "speakeasy";
import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {

        console.log('Request Body:', req.body);

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        
        
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {expiresIn:"1d"});
    
        const url = `http://localhost:3000/verify-account/${savedUser._id}/verify/${token}`;
        await sendEmail(email,"Verify your email", url); // sends verification link to user's email
       // console.log("Email send Successfully !");
        res.status(201).json({status: true, message: `Account created successfully !An email sent to your account please verify !`, data:savedUser});
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
      const { email, password, tokens } = req.body;
      const user = await User.findOne({ email: email });
      const isMatch = await bcrypt.compare(password, user.password);

      if (!user || !isMatch) return res.status(400).json({ message: "Email or password not match !" });


        
        //if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        // Generate refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();

        const accessToken = jwt.sign({ id: user._id, fullName: user.firstName + " " + user.lastName,
        roles: user.roles,  email : user.email, picturePath: user.picturePath, authSource: user.authSource, gender: user.gender  }, process.env.JWT_SECRET, {expiresIn:"10s"});
     

        if(!user.verified) {
            const url = `http://localhost:3000/verify-account/${user._id}/verify/${accessToken}`;
            const body =`<!DOCTYPE html>
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
                  background-color: #4e8098; /* A calming blue-grey */
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
                }
                .content img {
                  max-width: 100%;
                  height: auto;
                  border-bottom: 5px solid #4e8098; /* Matching the header */
                  display: block;
                  margin-bottom: 30px;
                }
                .content {
                  padding: 20px;
                  color: #333333;
                  text-align: center;
                }
                .content h2 {
                  color: #4e8098;
                  margin-bottom: 20px;
                }
                .content p {
                  line-height: 1.6;
                  margin-bottom: 15px;
                }
                .login-details {
                  background-color: #e8e8e8; /* A light grey for contrast */
                  border-left: 3px solid #4e8098;
                  padding: 15px;
                  margin: 25px 0;
                  display: inline-block;
                  transition: box-shadow 0.3s ease;

                }
                .login-details:hover {
                  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .footer {
                  background-color: #4e8098;
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
            
                  <p>Dear ${user.firstName + " " + user.lastName},</p>
                  <p>We are thrilled to welcome you to Elkindy, your new home for musical excellence. At Elkindy, we embrace the diversity of age, experience, and nationality, providing a vibrant community where music education is both accessible and exceptional.</p>
                  <div class="login-details" style="width: 90%;">
                    <h4><strong>Please verify your email:</strong></h4>
                    <a href="${url}" style="display: inline-block; background-color: #4e8098; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
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
            await sendEmail(email,"Verify your emaill", body); // sends verification link to user's email
            console.log("Email send Successfullyyyyyyyy !");
            return res.status(401).json({status: false, message: "An email sent to your account ! please verify !"});
        }

        // Check if TwoFactorAuthentication is enabled for the user
        
        
        if (user.TwoFactorAuthentication) {
          // Verify the user's token
          const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: tokens,
            window: 1,
          });

          if (!verified) {
            return res.status(401).json({ error: 'Invalid token for 2FA' });
          }
        }

       
        delete user.password;
        res.status(200).json({ accessToken, refreshToken: user.refreshToken });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });
        
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Check expiration date of refresh token
       

        const accessToken = jwt.sign({ id: user._id, fullName: user.firstName + " " + user.lastName,

        roles: user.roles,  email : user.email, picturePath : user.picturePath  }, process.env.JWT_SECRET, { expiresIn: "30s" });

        res.json({ accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("JWT expired:", error.message);
            return res.status(401).json({ message: "JWT expired" });
        } else {
            console.log("Error:", error.message);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    
    }
};

export const verifyAccount = async (req, res) => {
    try{
        const {id } = req.params;
        const user = await User.findOne({_id: id});
        if(!user) {
            return res.status(404).json({status: false, message: "User not existed !"});
        }
        if(user.verified) {
            return res.status(400).json({status: false, message: "This account has already been verified!"})
        }
        const updatedUser = await User.findByIdAndUpdate({_id: id}, {verified: true});
        if(!updatedUser)  {
            res.status(400).json({status : "Failed", msg :"Failed To verify account"})  
        } 
        res.status(200).json({status : "Success",message: "The account has been verified" })
        
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}


export const forgetPassord = async (req, res) => {
    const {
        email
    } = req.body;
    const user = await User.findOne({email: email});
    
    if(!user) {
        return res.status(404).json({status: false, message: "User not existed !"});
    }
    else{
    console.log("email : ", email)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn:"5m"});
    
    const url = `http://localhost:3000/reset-password/${user._id}/${token}`;
    await sendEmail(email, "Reset your password", url);
    res.status(200).json({status : "Success" })
    }     
}

export const resetPassord = async (req, res) => {
        const {id } = req.params;
        const { password} = req.body;
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
            
        const updatedUser = await User.findByIdAndUpdate({_id: id}, {password: passwordHash});
        if(!updatedUser)  {
           return res.status(400).json({status : "Failed", message :"Failed To Update Password"})  
        } 
        res.status(200).json({status : "Success" })

    }
                


/* Get All */
 export const getAllUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({users});
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
 
}
// Get a User
export const getUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findById(id);
      if (user) {
        const { password, ...otherDetails } = user._doc;
  
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json("No such User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

// Get a User
export const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (user) {

      res.status(200).json({user});
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getTeacherById = async (req, res) => {
  const id = req.params.teacherId;

  try {
    const user = await User.findById(id).populate("teacherInfo.classesTeaching");
    if (user) {

      res.status(200).json(user);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get all User by Role
export const getAllUserByRole = async (req, res) => {
  const role = req.params.role;
  try {
      let users;

      // Check if role is "admin"
      if (role === 'admin') {
          // Retrieve all users without populating any fields
          users = await User.find({ roles: role });
      } else {
          // For other roles, determine the fields to populate
          let populateFields = '';
          if (role === 'teacher') {
              populateFields = 'teacherInfo.coursesTaught teacherInfo.classesTeaching teacherInfo.studentsTaught';
          } else if (role === 'student') {
              populateFields = 'studentInfo.classLevel studentInfo.coursesEnrolled';
          }

          // Populate the specified fields
          users = await User.find({ roles: role }).populate(populateFields.split(' '));
      }

      res.status(200).json({ data: users });
  } catch (error) {
      res.status(500).json(error);
  }
};




//planning
export const getTeachers = async (req, res) => {
  try {
      const teachers = await User.find({ roles: 'teacher' });
      res.status(200).json(teachers);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Fonction pour récupérer tous les étudiants
export const getStudents = async (req, res) => {
  try {
      const students = await User.find({ roles: 'student' });
      res.status(200).json(students);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const getStudentById = async (req, res) => {
  const studentId = req.params.studentId;
  try {
      const student = await User.findById(studentId); // Recherchez l'étudiant par son ID dans la base de données
      if (!student) {
        // Si aucun étudiant n'est trouvé avec cet ID, renvoyez une réponse 404 (Not Found)
        return res.status(404).json({ message: 'Student not found' });
      }
      // Si un étudiant est trouvé, renvoyez ses détails dans la réponse
      res.status(200).json(student);
  } catch (error) {
      // Si une erreur se produit pendant la recherche, renvoyez une réponse 500 (Internal Server Error)
      res.status(500).json({ message: error.message });
  }
};
export const getAssignmentsByCourseIdForStudent = async (req, res) => {
  try {
    // Pas besoin de convertir studentId en ObjectId
    const studentId = req.params.studentId;
    const courseIds = req.params.courseId.split(','); // Diviser la chaîne en un tableau d'identifiants de cours
 
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
 
    // Vérifier que l'utilisateur est un étudiant
    if (!user.roles.includes('student')) {
      return res.status(403).json({ error: 'User is not a student' });
    }
 
    // Rechercher les affectations correspondant aux ID des cours
    const assignments = await Assignment.find({ courseId: { $in: courseIds } });
    
    // Renvoyer les affectations trouvées sous forme de réponse JSON
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments by course ID for student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 };

 export const getCoursesByStudentId = async (req, res) => {
  const studentId = req.params.studentId;
 
  try {
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
 
    const courses = user.studentInfo.coursesEnrolled;
 
    if (courses.length > 0) {
      // Utiliser une méthode de projection pour retourner uniquement l'ID et le nom du cours
      const coursesWithNames = await Course.find({ _id: { $in: courses } }, { _id: 1, title: 1 });
      return res.status(200).json(coursesWithNames);
    } else {
      return res.status(404).json({ message: "No courses found for this student" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
 };
 export const getClassByStudent = async (req, res) => {
   const studentId = req.params.studentId;
 
   try {
       const student = await User.findById(studentId).populate('studentInfo.classLevel');
       res.status(200).json(student.studentInfo.classLevel);
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
 };// FUNCTION TO GET THE CLASSES TAUGHT BY A TEACHER
 export const getClassesTaughtByTeacher = async (req, res) => {
   const teacherId = req.params.teacherId;
 
   try {
       const teacher = await User.findById(teacherId).populate('teacherInfo.classesTeaching');
       res.status(200).json(teacher.teacherInfo.classesTeaching);
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
 };
 // get courses by student
export const getCoursesByStudent = async (req, res) => {
  const studentId = req.params.studentId;

  try {
      const student = await User.findById(studentId).populate('studentInfo.coursesEnrolled');
      res.status(200).json(student.studentInfo.coursesEnrolled);  
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
//get Courses Taught By Teacher
export const getCoursesTaughtByTeacher = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
      const teacher = await User.findById(teacherId).populate('teacherInfo.coursesTaught');
      res.status(200).json(teacher.teacherInfo.coursesTaught);
  } catch (error) {   
      res.status(500).json({ message: error.message });
  }
};
// Function to get the list of courses in a class taught by a teacher getCoursesTaughtByTeacherInClass
export const getCoursesTaughtByTeacherInClass = async (req, res) => {
  const { teacherId, classId } = req.params;

  try {
    // Find the teacher by ID and populate their coursesTaught
    const teacher = await User.findById(teacherId).populate('teacherInfo.coursesTaught');

    // Check if teacher or teacherInfo is null or empty coursesTaught array is empty  
    if (!teacher || !teacher.teacherInfo || !teacher.teacherInfo.coursesTaught.length) {
      return res.status(404).json({ error: "Teacher not found or missing coursesTaught." });
    }

    // Find the class by ID and populate its courses
    const classe = await Classe.findById(classId).populate('courses');

    // Extract the courses taught by the teacher
    const teacherCourses = teacher.teacherInfo.coursesTaught.map(course => course._id.toString());

    // Filter the courses in the class by those taught by the teacher and return the list of courses taught by the teacher in the class 
    const coursesTaughtByTeacherInClass = classe.courses.filter(course =>
      teacherCourses.includes(course._id.toString())
    );

    res.json(coursesTaughtByTeacherInClass);
  } catch (error) {
    console.error("Error fetching courses taught by teacher in class:", error);
    res.status(500).json({ error: "Failed to fetch courses taught by teacher in class." });
  } 

}

//get students by class 
export const getStudentsEnrolledInClass = async (req, res) => {
  const classId = req.params.classId;

  try {
      const students = await User.find({ roles: 'student', 'studentInfo.classLevel': classId });
      res.status(200).json(students);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
//i wanta function to get the students enrolled in a class and in a specific course
export const getStudentsInClassByCourseAndClass = async (req, res) => {
  const { classId, courseId } = req.params;

  try {
    // Find the students enrolled in the class
    const students = await User.find({ roles: 'student', 'studentInfo.classLevel': classId });

    // Filter the students by those enrolled in the provided course
    const studentsByCourse = students.filter(student =>
      student.studentInfo.coursesEnrolled.includes(courseId)
    );

    res.status(200).json(studentsByCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get classes and students not inrolled in class by courrse and teacher 
export const getClassesAndStudentsNotEnrolledInClassByCourseAndTeacher = async (req, res) => {
  const { courseId, teacherId } = req.params;

  try {
    const teacher = await User.findById(teacherId).populate('teacherInfo.studentsTaught');
    const studentsTaught = teacher.teacherInfo.studentsTaught;
    const classesTaught = teacher.teacherInfo.classesTeaching.map(classe => classe._id.toString());
    const classesTaughtObjects = await Classe.find({ _id: { $in: classesTaught } });

    // Find students enrolled in the course
    const studentsEnrolled = await User.find({
      roles: 'student',
      'studentInfo.coursesEnrolled': courseId
    });

    // Filter out students who are already assigned to a class
    const studentsNotInClass = studentsEnrolled.filter(student => !student.studentInfo.classLevel);

    res.status(200).json({ classesTaught: classesTaughtObjects, studentsEnrolled: studentsTaught });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

