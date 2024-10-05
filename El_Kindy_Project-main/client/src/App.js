import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadScripts } from "./scriptLoader";
import React, { useEffect, useRef } from "react";
import AboutPage from "../src/scenes/AboutPage";
import HomePage from "../src/scenes/HomePage";
import SignUp from "./scenes/Authentification/SignUp";
import SignIn from "./scenes/Authentification/SignIn";
import ForgetPassword from "./scenes/Authentification/ForgetPassword";
import ResetPassword from "./scenes/Authentification/ResetPassword";
import EmailVerify from "./scenes/Authentification/EmailVerify";
import NotFound from "./scenes/NotFound";
import AdminHomePage from "../src/scenes/AdminHomePage";
import ListCoursesPage from "./scenes/Courses/backOffice/ListCoursesPage";
import Stage from "../src/scenes/Stage/StageHome";
import ListEventsPage from "./scenes/EventsPage/ListEventPage/ListEvent";
import AddEventPage from "./scenes/EventsPage/AddEventPage/AddEvent";
import AddCoursePage from "./scenes/Courses/backOffice/AddCoursePage";
import ListCategoryPage from "../src/scenes/Category/ListCategoryPage";
import AddCategoryPage from "../src/scenes/Category/AddCategoryPage";
import EditCategoryPage from "../src/scenes/Category/EditCategoryPage";
import ListStage from "../src/scenes/Stage/ListStage";
import AddStage from "../src/scenes/Stage/AddStage";
import EditStage from "../src/scenes/Stage/EditStage";
import ListClassPage from "../src/scenes/Classe/ListClassPage";
import EditClassPage from "../src/scenes/Classe/EditClassPage";
import AddClassPage from "../src/scenes/Classe/AddClassPage";
import Category from "../src/scenes/CategoryHome";
import InscriptionPage from "./scenes/Inscriptions/InscriptionPage";
import InscriptionList from "./scenes/Inscriptions/backOffice/listInscriptions";
import EditAllClass from "../src/scenes/AllClass/EditAllClass";
import ListAllClass from "../src/scenes/AllClass/ListAllClass";
import AddAllClass from "../src/scenes/AllClass/AddAllClass";

import ListShop from "../src/scenes/Shop/ShopHome/ListShop";
import MeetingHomeStudent from "./scenes/PlatformStudent/MeetingHomeStudent";
import DashbordTeacher from "./scenes/PlatformTeacher/DashbordTeacher";
import HomePagee from "../src/scenes/PlatformTeacher/HomePagee";
import DashbordStudent from "./scenes/PlatformStudent/DashbordStudent";
import Room from "../src/scenes/PlatformTeacher/Room";
import SuccessStage from "../src/scenes/Payment/SuccessStage";
import TeachersList from "../src/scenes/PlatformStudent/TeachersList";
import Chat from "../src/scenes/Chat/Chat";

import BackListShop from "../src/scenes/Shop/BackShop/BackListShop";
import BackDetailsShop from "../src/scenes/Shop/BackShop/BackDetailsShop"
import DetailShopFront from "../src/scenes/Shop/ShopHome/DetailShopFront"

import ListMeetingTeacher from 'scenes/PlatformTeacher/ListMeetingTeacher'
import MessageProf from '../src/scenes/PlatformTeacher/MessageProf'
import StudentsGrades from '../src/scenes/PlatformTeacher/StudentsGrades'

import AdminReservation from "./scenes/EventsPage/AdminReservation/AdminReservation";
import DetailEvents from "./scenes/EventsPage/DetailEventPage/DetailEvent";
import EditEventPage from "./scenes/EventsPage/EditEventPage/EditEvent";
import InscriptionDetails from "scenes/Inscriptions/backOffice/InscriptionDetails";
import StageDetail from "scenes/Stage/StageDetail";
import AdminReservationStage from "scenes/Stage/AdminReservationStage";
import FicheEleve from "scenes/PlatformTeacher/FicheEleve";

import EditCourse from "scenes/Courses/backOffice/EditCoursePage";


import ListEventUser from './scenes/EventsPage/EventFront/EventFront'
import Review from './scenes/ReviewPage/Review'
import Dashboard from './scenes/ReviewPage/Dashboard'
import Reservationbyid from './scenes/EventsPage/ReservationListbyId/ReservationListbyId'




import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import { setLogout } from "../src/state";
import ContactPage from "scenes/ContactPage/ContactFront";
import ContactBack from "scenes/ContactPage/ContactBack";

import AdminsDashboard from "scenes/UsersAdmin/Admins";
import TeachersDashboard from "scenes/UsersAdmin/Teachers";
import StudentsDashboard from "scenes/UsersAdmin/Students";
import ParentsDashboard from "scenes/UsersAdmin/Parents";
import ListCourses from "scenes/Courses/frontOffice/listCourses";
import GradeStudent from "scenes/PlatformStudent/GradeStudent";

import Success from "scenes/Payment/Success";
import SuccessInscription from "scenes/Payment/SucessInscription";

import Fail from "scenes/Payment/Fail";
import Payment from "scenes/Payment/Payment";
import Anniversaire from "../src/scenes/Anniversaire";

import DetailsCourse from "scenes/Courses/frontOffice/detailsCourse";
//Planning
import PlanningTeacher from "./scenes/PlatformTeacher/Planning";
import PlanningStudent from "./scenes/PlatformStudent/Planning";
import Planning from "./scenes/Planning";
import EditProfile from "scenes/PlatformTeacher/editProfileTeacher";
import TimeSlots from "scenes/PlatformTeacher/TimeSlots";
import TimeSlotsStudent from "./scenes/PlatformStudent/TimeSlots/index";
import EditProfileStudent from "scenes/PlatformStudent/editProfileStudent";
import Assignment from "./scenes/PlatformTeacher/Assignment";
import AssignmentStudent from "./scenes/PlatformStudent/Assignment";


function App() {
  const isAuth = Boolean(useSelector((state) => state.accessToken));

  const scriptsLoaded = useRef(false);
  /*'/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
      '/assets/vendor/bootstrap/dist/js/bootstrap.bundle.js',
      '/assets/vendor/tiny-slider/tiny-slider.js',
      '/assets/vendor/glightbox/js/glightbox.js',
      '/assets/vendor/purecounterjs/dist/purecounter_vanilla.js',
      '/assets/vendor/choices/js/choices.min.js',
      '/assets/vendor/aos/aos.js',
      '/assets/vendor/quill/js/quill.min.js',
      '/assets/vendor/stepper/js/bs-stepper.min.js', */

  useEffect(() => {
    const scripts = [
      "/assets/vendor/quill/js/quill.min.js",
      "/assets/vendor/glightbox/js/glightbox.js",
      "/assets/vendor/purecounterjs/dist/purecounter_vanilla.js",
      "/assets/js/functions.js",
      "/assets/vendor/sticky-js/sticky.min.js",
      "/assets/vendor/apexcharts/js/apexcharts.min.js"

    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []);

  return (
    <div>
      <Routes>
        {/* auth routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:id?/:token?"
          element={<ResetPassword />}
        />
        <Route
          path="/verify-account/:id/verify/:token"
          element={<EmailVerify />}
        />


        {/* public routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/contact-us" element={<ContactPage />} />

        <Route path="/category" element={<Category />} />

        <Route path="/courses" element={<ListCourses />} />
        <Route path="/StageDetail/:id" element={<StageDetail />} />
        <Route path="/courses" element={<ListCourses />} />
        <Route

          path="/StageDetail/:id"
          element={<StageDetail />}
        />
        <Route
          path="/courses"
          element={<ListCourses />}
        />
        <Route


          path="/TeachersList"
          element={isAuth ? <TeachersList /> : <Navigate to="/" />}
        />

        <Route path="/detail-course/:id" element={<DetailsCourse />} />

        <Route path="/inscription/:id?" element={<InscriptionPage />} />

        {/* PRIVATE ROUTE */}
        <Route
          path="/dashboard-admin"
          element={
            <PrivateRoute
              element={<AdminHomePage />}
              requiredRoles={["superAdmin", "admin"]}

            />
          }
        />

        <Route
          path="/inscriptionsList"
          element={
            <PrivateRoute
              element={<InscriptionList />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
<Route
          path="/ContactBack"
          element={
            <PrivateRoute
              element={<ContactBack />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
        <Route
          path="/inscriptionDetails/:id"
          element={
            <PrivateRoute
              element={<InscriptionDetails />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/listCourses"
          element={
            <PrivateRoute
              element={<ListCoursesPage />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }

        />
 <Route
          path="/anniversaire"
          element={
            <PrivateRoute
              element={<Anniversaire />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/teachers"
          element={
            <PrivateRoute
              element={<TeachersDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/students"
          element={
            <PrivateRoute
              element={<StudentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/parents"
          element={
            <PrivateRoute
              element={<ParentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />



        <Route
          path="/dashbordTeacher"
          element={
            <PrivateRoute
              element={<DashbordTeacher />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute
              element={<MessageProf />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />

        <Route
          path="/StudentsGrades"
          element={
            <PrivateRoute
              element={<StudentsGrades />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />
        <Route
          path="/category"
          element={<Category />}
        />

        <Route
          path="/courses"
          element={<ListCourses />}
        />

        <Route
          path="/admins"
          element={
            <PrivateRoute
              element={<AdminsDashboard />}
              requiredRoles={["superAdmin"]}
            />
          }
        />

        <Route
          path="/assignmentStudent"
          element={
            <PrivateRoute
              element={<AssignmentStudent />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute
              element={<Assignment />}
              requiredRoles={["superAdmin", "teacher", "student"]}
            />
          }
        />

        <Route
          path="/teachers"
          element={
            <PrivateRoute
              element={<TeachersDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/students"
          element={
            <PrivateRoute
              element={<StudentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/parents"
          element={
            <PrivateRoute
              element={<ParentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/dashbordTeacher"
          element={
            <PrivateRoute
              element={<DashbordTeacher />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute
              element={<MessageProf />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />

        <Route
          path="/StudentsGrades"
          element={
            <PrivateRoute
              element={<StudentsGrades />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />
        <Route path="/category" element={<Category />} />

        <Route path="/courses" element={<ListCourses />} />
        <Route
          path="/TeachersList"
          element={isAuth ? <TeachersList /> : <Navigate to="/" />}
/>
          
       

<Route
          path="/listReservation"
          element={
            <PrivateRoute
              element={<AdminReservation
                />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/inscriptionsList"
          element={
            <PrivateRoute
              element={<InscriptionList />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/inscriptionDetails/:id"
          element={
            <PrivateRoute
              element={<InscriptionDetails />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/listCourses"
          element={
            <PrivateRoute
              element={<ListCoursesPage />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        {/* PRIVATE ROUTE */}
        <Route
          path="/dashboard-admin"
          element={
            <PrivateRoute
              element={<AdminHomePage />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/inscriptionsList"
          element={
            <PrivateRoute
              element={<InscriptionList />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/inscriptionDetails/:id"
          element={
            <PrivateRoute
              element={<InscriptionDetails />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />


        <Route
          path="/admins"
          element={
            <PrivateRoute
              element={<AdminsDashboard />}
              requiredRoles={["superAdmin"]}
            />
          }
        />

        <Route
          path="/teachers"
          element={
            <PrivateRoute
              element={<TeachersDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute
              element={<StudentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/parents"
          element={
            <PrivateRoute
              element={<ParentsDashboard />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />


<Route
          path="/GradeStudent"
          element={
            <PrivateRoute
              element={<GradeStudent />}
              requiredRoles={["superAdmin", "admin", "student"]}
            />
          }
        />


        <Route
          path="/dashboard-teacher"
          element={
            <PrivateRoute
              element={<DashbordTeacher />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />

<Route
          path="/FicheEleve"
          element={
            <PrivateRoute
              element={<FicheEleve />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />
      

        <Route
          path="/profile-teacher"
          element={
            <PrivateRoute
              element={<EditProfile />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />

        <Route
          path="/profile-student"
          element={
            <PrivateRoute
              element={<EditProfileStudent />}
              requiredRoles={["superAdmin", "admin", "student"]}
            />
          }
        />

        <Route
          path="/time-slots"
          element={
            <PrivateRoute
              element={<TimeSlots />}
              requiredRoles={["superAdmin", "admin", "teacher"]}
            />
          }
        />

        <Route
          path="/time-slots-student"
          element={
            <PrivateRoute
              element={<TimeSlotsStudent />}
              requiredRoles={["superAdmin", "admin", "student"]}
            />
          }
        />

        <Route
          path="/listMeeting"
          element={
            <PrivateRoute
              element={<ListMeetingTeacher />}
              requiredRoles={["superAdmin", "teacher"]}
            />
          }
        />


        <Route
          path="/AdminReservationStage"
          element={
            <PrivateRoute
              element={<AdminReservationStage />}
              requiredRoles={["superAdmin", "teacher"]}
            />
          }
        />

        <Route
          path="/meetingHomeS"
          element={
            <PrivateRoute
              element={<MeetingHomeStudent />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />





         <Route path="/payment" element={
            <PrivateRoute
              element={<Payment />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />

        <Route path="/success" element={<Success />} />


        <Route path="/fail" element={<Fail />} />

        <Route path="/successInscription" element={<SuccessInscription />} />
<Route
          path="/SuccessStage"
          element={ <SuccessStage />}
        />

<Route
          path="/review"
          element={ <Review /> }
        />


<Route
          path="/dashboardReview"
          element={ <Dashboard /> }
        />    



        <Route
          path="/dashboard-student"
          element={
            <PrivateRoute
              element={<DashbordStudent />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />

        <Route
          path="/homeMeet"
          element={
            <PrivateRoute
              element={<HomePagee />}
              requiredRoles={["superAdmin", "student", "teacher"]}
            />
          }
        />
         <Route
          path="/ListShop"
          element={
            <PrivateRoute
              element={<ListShop />}
              requiredRoles={["superAdmin", "student", "teacher","admin"]}
            />
          }
        />
         
<Route
          path="/DetailShopFront/:id"
          element={
            <PrivateRoute
              element={<DetailShopFront />}
              requiredRoles={["superAdmin", "student", "teacher","admin"]}
            />
          }
        />
        <Route
          path="/BackListShop"
          element={
            <PrivateRoute
              element={<BackListShop />}
              requiredRoles={["superAdmin", "student", "teacher","admin"]}
            />
          }
        />  
        <Route
          path="/BackDetailsShop/:id"
          element={
            <PrivateRoute
              element={<BackDetailsShop />}
              requiredRoles={["superAdmin", "student", "teacher","admin"]}
            />
          }
        /> 

        <Route
          path="/planningTeacher"
          element={
            <PrivateRoute
              element={<PlanningTeacher />}
              requiredRoles={["superAdmin", "teacher"]}
            />
          }
        />
        <Route
          path="/planning"
          element={
            <PrivateRoute
              element={<Planning />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
        <Route
          path="/planningStudent"
          element={
            <PrivateRoute
              element={<PlanningStudent />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />
        
        <Route
          path="/assignmentStudent"
          element={
            <PrivateRoute
              element={<AssignmentStudent />}
              requiredRoles={["superAdmin", "student"]}
            />
          }
        />
         <Route
          path="/assignments"
          element={
            <PrivateRoute
              element={<Assignment />}
              requiredRoles={["superAdmin", "teacher", "student"]}
            />
          }
        />
        <Route
          path="/ListAllClasse"
          element={
            <PrivateRoute
              element={<ListAllClass />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
        <Route
          path="/EditAllClasse/:id"
          element={
            <PrivateRoute
              element={<EditAllClass />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
        <Route
          path="/AddAllClasse"
          element={
            <PrivateRoute
              element={<AddAllClass />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/room/:roomId"
          element={
            <PrivateRoute
              element={<Room />}
              requiredRoles={["superAdmin", "student", "teacher"]}
            />
          }
        />

        <Route
          path="/edit-course/:id"
          element={isAuth ? <EditCourse /> : <Navigate to="/" />}
        />


        <Route
          path="/AddStage"
          element={isAuth ? <AddStage /> : <Navigate to="/" />}
        />
        <Route
          path="/EditStage/:id"
          element={isAuth ? <EditStage /> : <Navigate to="/" />}
        />

        <Route
          path="/stage"
          element={<Stage />}
        />

        <Route
          path="/ListStage"
          element={<ListStage />}

          />


<Route
          path="/events/reservation/:eventId"
          element={
            <PrivateRoute
              element={<Reservationbyid />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }

        />

        <Route
          path="/listEvents"
          element={isAuth ? <ListEventsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/addEvent"
          element={isAuth ? <AddEventPage /> : <Navigate to="/" />}
        />

        <Route
          path="/editEvent/:id"
          element={isAuth ? <EditEventPage /> : <Navigate to="/" />}
        />

        <Route path="/detailEvent/:id" element={<DetailEvents />} />

        <Route path="/listEventUser" element={<ListEventUser />} />

        <Route path="/listEventUser" element={<ListEventUser />} />

        <Route
          path="/addCourse"
          element={isAuth ? <AddCoursePage /> : <Navigate to="/" />}
        />

        <Route
          path="/listClasse"
          element={isAuth ? <ListClassPage /> : <Navigate to="/" />}
        />
        <Route
          path="/add-classe"
          element={isAuth ? <AddClassPage /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-classe/:id"
          element={isAuth ? <EditClassPage /> : <Navigate to="/" />}
        />


        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/listCategories"
          element={isAuth ? <ListCategoryPage /> : <Navigate to="/" />}
        />
        <Route
          path="/add-category"
          element={isAuth ? <AddCategoryPage /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-category/:id"
          element={isAuth ? <EditCategoryPage /> : <Navigate to="/" />}
        />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// PrivateRoute component to check authentication and required roles
function PrivateRoute({ element, requiredRoles }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const userRoles = accessToken ? jwtDecode(accessToken).roles : [];

  // If user is authenticated and has required roles, render the element
  if (accessToken && userRoles?.some((role) => requiredRoles.includes(role))) {
    return element;
  } else {
    dispatch(setLogout());
  }

  // If user is not authenticated, redirect to login
  return <Navigate to="/" replace />;
}

export default App;
