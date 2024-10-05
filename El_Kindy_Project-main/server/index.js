import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from "url";
import { addNewCourse, updateCourse } from "./controllers/courseController.js";
import { addNewEvent,updateEvent } from "./controllers/event.js";
import  { createCategorie, updateCategorie }  from "./controllers/categorieController.js"; // Import des routes de catégorie
import  { createShop, updateShop }  from "./controllers/ShopController.js"; // Import des routes de shop
import shopRoute from "./routes/ShopRoute.js";
import eventRoutes from "./routes/Event.js";
import classRoute from "./routes/ClassRoutes.js";
import salleRoutes from "./routes/salle.js";
import ContactRoutes from "./routes/ContactRoute.js"
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import stageRouter  from "./routes/stageRoute.js";
import authRoutes from "./routes/auth.js";
import courseRoute from './routes/courseRoute.js'
import { register } from "./controllers/auth.js";
import { addMessage } from './controllers/MessageController.js';
import twilio from "twilio";
import User from './models/User.js';
import { users } from "./data/index.js";
import { createStage, updateStage } from "./controllers/stageController.js";
import router from "./routes/Event.js";
import googleAuth from "./controllers/googleAuth.js";
import { OAuth2Client } from 'google-auth-library'; // Use import instead of require
import jwt from "jsonwebtoken";
import categorieRoutes from "./routes/categorieRoutes.js"; // Import des routes de catégorie
import { verifyToken } from "./middleware/auth.js";
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'
import meetingRoutes from './routes/meetingRoutes.js';
import reservationRoutes  from "./routes/Reservation.js";

import gradeRoutes from "./routes/gradeRoutes.js";
import ficheEleveRoutes from "./routes/ficheEleveRoutes.js";
import paymentRouter from "./routes/paymentRouter.js";

import assignmentRoute from "./routes/assignmentRoutes.js";

import textAnalytics from "./routes/textAnalytics.js";

import planningRoutes from "./routes/planningRoutes.js";

import ReservationStage from "./routes/ReservationStage.js";
import { editUserProfile } from "./controllers/users.js";
import { createAssignment, uploadAssignmentFile } from "./controllers/assignmentController.js";
/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const client = new OAuth2Client();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));


// Configure CORS to allow requests from http://localhost:3000
app.use(cors({
    origin: ["http://localhost:3000","https://lh3.googleusercontent.com","http://localhost:3001", "http://localhost:8000"],
    credentials: true // Include credentials in CORS request
  }));
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,"public/assets");
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({ storage });


/* ROUTES WITH FILES*/
//app.post("/auth/register",upload.single("picture"),register);
app.post("/course/add",upload.single("picture"),addNewCourse);
app.patch("/course/update/:id",upload.single("picture"),verifyToken, updateCourse);

app.post("/event/add",upload.single("picture"),addNewEvent);
app.patch("/event/update/:id",upload.single("picture"),updateEvent);
app.use("/planning", planningRoutes);


app.post("/api/categories/add", verifyToken, upload.single("picture"), createCategorie);
app.put("/api/categories/update/:id", verifyToken, upload.single("picture"), updateCategorie);


app.post("/shops", upload.single("picture"), createShop);
app.put("/shops/:id", upload.single("picture"), updateShop);
app.use("/grades", gradeRoutes);
app.post("/api/categories", upload.single("picture"), createCategorie);
app.put("/api/categories/:id", upload.single("picture"), updateCategorie);

app.post("/api/stage", upload.single("picture"), createStage);
app.patch("/api/stage/:id", upload.single("picture"),verifyToken,updateStage );

app.post("/addMessage", upload.single("picture"), addMessage);

app.patch("/user/edit/:id", upload.single("picture"), verifyToken, editUserProfile);



app.post("/api/add", upload.single("picturePath"), createAssignment);
router.post('/api/upload/:assignmentId', upload.single('picturePath'), uploadAssignmentFile);




/*Twilio */
dotenv.config();
export const sendSms = (toPhoneNumber) => {
    const formattedPhoneNumber = `+216${toPhoneNumber}`; // E.164 format
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    return client.messages
        .create({
            body: 'Thank you, Your Event Participation has been Accepted !',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhoneNumber // Format to +216 ( tunisian Number)
        })
        .then(message => console.log("Message sent:", message.sid))
        .catch(err => console.error("Error sending message:", err));
};



/* ROUTES */


/* ROUTES */
app.use("/auth",authRoutes);
app.use("/api/categories", categorieRoutes); 
app.use("/stage",stageRouter);
app.use('/classes', classRoute);
app.use('/shops', shopRoute);

app.use('/event', eventRoutes);
app.use("/course",courseRoute);


app.use("/contact",ContactRoutes);
app.use("/salle",salleRoutes);
app.use("/inscription", inscriptionRoutes);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);
app.use('/meeting', meetingRoutes);
app.use("/events",reservationRoutes);
app.use("/ficheEleve",ficheEleveRoutes)
app.use("/payment",paymentRouter);


app.use('/api', assignmentRoute);


app.use("/reservationstage", ReservationStage);





// azure ai :
app.use("/azure",textAnalytics);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));

    /* ADD DATA ONE TIME*/
    // User.insertMany(users);
    //Post.insertMany(posts);
    
}).catch((error) => console.log(`${error} did not connect`));