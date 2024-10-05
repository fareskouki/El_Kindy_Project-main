import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../state";
import { useSelector } from "react-redux";
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChalkboardTeacher,
  faUserGraduate,
  faUserTie,
  faUserShield,
  faClipboardList,
  faGraduationCap,
  faTags,
  faCalendarAlt,
  faBriefcase,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function SideBar() {
  const accessToken = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const { t, i18n } = useTranslation();


  const isMembersActive = ["/admins", "/teachers", "/students"].includes(activeNavItem);

  const logoutHandler = () => {
    dispatch(setLogout());

    navigate("/");
  };

  useEffect(() => {
    // Set activeNavItem based on current location
    const pathname = location.pathname;
    setActiveNavItem(pathname);
  }, [location]);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item === activeNavItem ? "" : item);
  };

  return (
    <div>
      {/* Sidebar START */}
      <nav className="navbar sidebar navbar-expand-xl navbar-dark bg-dark">
        {/* Navbar brand for xl START */}
        <div className="d-flex align-items-center justify-content-center">
          <Link className="navbar-brand" to="/dashboard-admin">
            <img
              className="navbar-brand-item"
              src="/assets/images/logo/logo.png"
              style={{ width: "130px", height: "70px" }}
              alt
            />
          </Link>
        </div>
        {/* Navbar brand for xl END */}
        <div
          className="offcanvas offcanvas-start flex-row custom-scrollbar h-100"
          data-bs-backdrop="true"
          tabIndex={-1}
          id="offcanvasSidebar"
        >
          <div className="offcanvas-body sidebar-content d-flex flex-column bg-dark">
            <div className="fares">
              {/* Sidebar menu START */}
              <ul className="navbar-nav flex-column" id="navbar-sidebar">
                {/* Menu item 1 */}
                <li className="nav-item">
                  <Link
                    to="/dashboard-admin"
                    className={`nav-link ${activeNavItem === "/dashboard-admin" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/dashboard-admin")}>
                    <i className="bi bi-house fa-fw me-2" />
                    {t("sidebar.Dashboard")}

                    
                  </Link>
                </li>
                {/* Title */}
                <li className="nav-item ms-2 my-2">{t("sidebar.Pages")}</li>

                {/* menu item 3 */}
                <li className={`nav-item ${isMembersActive ? "active" : ""}`}>
                  <a
                    className={`nav-link dropdown-toggle ${isMembersActive ? "active" : ""}`}
                    data-bs-toggle="collapse"
                    href="#collapsepageMembers"
                    role="button"
                    aria-expanded={isMembersActive ? "true" : "false"}
                    aria-controls="collapsepageMembers"
                  >
                    <FontAwesomeIcon icon={faUsers} className="fa-fw me-1" />{" "}
                    {t("sidebar.Members")}
                  </a>

                  {/* Submenu */}
                  <ul
                    className={`nav collapse flex-column ${isMembersActive ? 'show' : ''}`}

                    id="collapsepageMembers"
                    data-bs-parent="#navbar-sidebar"
                  >
                    <li className="nav-item">
                      {" "}
                      <Link
                        to="/admins"
                        className={`nav-link ${activeNavItem === "/admins" ? "active" : ""}`}
                        onClick={() => handleNavItemClick("/admins")}>
                        <FontAwesomeIcon
                          icon={faUserShield}
                          className="fa-fw me-1"
                        />{" "}
                        {/* Admin */}{t("sidebar.Admins")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      {" "}
                      <Link
                        to="/teachers"
                        className={`nav-link ${activeNavItem === "/teachers" ? "active" : ""}`}
                        onClick={() => handleNavItemClick("/teachers")}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faChalkboardTeacher}
                          className="fa-fw me-1"
                        />{" "}
                        {/* Teacher */}{t("sidebar.Teachers")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      {" "}
                      <Link
                        to="/students"
                        className={`nav-link ${activeNavItem === "/students" ? "active" : ""}`}
                        onClick={() => handleNavItemClick("/students")}>
                        <FontAwesomeIcon
                          icon={faUserGraduate}
                          className="fa-fw me-1"
                        />{" "}
                        {/* Student */}{t("sidebar.Students")}
                      </Link>
                    </li>


                  </ul>
                </li>
                {/* Menu item inscriptions */}
                <li className="nav-item">
                  {" "}
                  <Link
                    to="/inscriptionsList"
                    className={`nav-link ${activeNavItem === "/inscriptionsList" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/inscriptionsList")}>
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className="fa-fw me-1"
                    />{" "}
                    {/* Preinscription */}{t("sidebar.Inscriptions")}
                  </Link>
                </li>
                {/* menu item category */}
                <li className="nav-item">
                  <Link
                    to="/listCategories"
                    className={`nav-link ${activeNavItem === "/listCategories" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listCategories")}>
                    <FontAwesomeIcon icon={faTags} className="fa-fw me-1" />{" "}
                    {/* Category Courses */}{t("sidebar.Category")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Planning"
                    className={`nav-link ${activeNavItem === "/Planning" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/Planning")}>
                    <FontAwesomeIcon icon={faTags} className="fa-fw me-1" />{" "}
                    {/* Category Courses */}{t("sidebar.Planning")}
                  </Link>

                </li>
                <li className="nav-item">
                <Link
                    to="/anniversaire"
                    className={`nav-link ${activeNavItem === "/anniversaire" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/anniversaire")}>
                    <FontAwesomeIcon icon={faTags} className="fa-fw me-1" />{" "}
                    {/* Category Courses */}Anniversaire
                  </Link>

                </li>

            
                {/* menu item courses */}
                <li className="nav-item">
                  <Link
                    to="/listCourses"
                    className={`nav-link ${activeNavItem === "/listCourses" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listCourses")}>
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="fa-fw me-1"
                    />{" "}
                    {t("sidebar.Courses")}
                  </Link>
                </li>

                {/* menu item events */}
                <li className="nav-item">
                  <Link
                    to="/ListStage"
                    className={`nav-link ${activeNavItem === "/ListStage" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/ListStage")}>
                    <FontAwesomeIcon icon={faBriefcase} className="fa-fw me-1" />{" "}
                    {t("sidebar.Internship")}
                  </Link>
                </li>

                {/* menu item events */}
               {/*  <li className="nav-item">
                  <Link
                    to="/listEvents"
                    className={`nav-link ${activeNavItem === "/listEvents" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listEvents")}>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="fa-fw me-1"
                    />{" "}
                    {t("sidebar.Events")}
                  </Link>
                </li> */}
                {/* menu item Reservation */}
                <li className="nav-item">
                  <Link
                    to="/listReservation"
                    className={`nav-link ${activeNavItem === "/listReservation" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listReservation")}>
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      className="fa-fw me-1"
                    />{" "}
                    {t("sidebar.Event Reservations")}
                  </Link>
                </li>


                {/* menu item Reservation */}
                <li className="nav-item">
                  <Link
                    to="/listReservation"
                    className={`nav-link ${activeNavItem === "/listReservation" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listReservation")}>

                    {/* menu item Reservation Stage*/}
                  


                  </Link>
                </li>
                <li className="nav-item">
                      <Link
                        to="/AdminReservationStage"
                        className={`nav-link ${activeNavItem === "/AdminReservationStage" ? "active" : ""}`}
                        onClick={() => handleNavItemClick("/AdminReservationStage")}>
                        <FontAwesomeIcon
                          icon={faTicketAlt}
                          className="fa-fw me-1"
                        />{" "}
                        {t("sidebar.Internship Reservations")}
                      </Link>
                    </li>

                {/* menu item events */}
                <li className="nav-item">
                  <Link
                    to="/listClasse"
                    className={`nav-link ${activeNavItem === "/listClasse" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/listClasse")}>
                    <FontAwesomeIcon icon={faSchool} className="fa-fw me-1" />{" "}
                    {t("sidebar.Internship Reservations")}
                  </Link>
                </li>
                {/* menu item classess */}
                <li className="nav-item">
                  <Link
                    to="/ListAllClasse"
                    className={`nav-link ${activeNavItem === "/ListAllClasse" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/ListAllClasse")}>
                    <FontAwesomeIcon icon={faSchool} className="fa-fw me-1" />{" "}
                    {t("sidebar.Classes")}
                  </Link>
                </li>
                {/* menu item classess */}
                <li className="nav-item">
                  <Link
                    to="/ContactBack"
                    className={`nav-link ${activeNavItem === "/ContactBack" ? "active" : ""}`}
                    onClick={() => handleNavItemClick("/ContactBack")}>
                    <FontAwesomeIcon icon={faSchool} className="fa-fw me-1" />{" "}
                    claim
                  </Link>
                </li>
                {/* Menu item 9 */}
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" href="#">
                    <i className="far fa-clipboard fa-fw me-2" />
                     {t("sidebar.Documentation")}
                  </a>
                </li>

                {/* Menu item 6 */}
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" href="#">
                    <i className="far fa-chart-bar fa-fw me-2" />
                    {t("sidebar.Earnings")}
                  </a>
                </li>
                {/* Menu item 7 */}
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" href="#">
                    <i className="fas fa-user-cog fa-fw me-2" />
                    {t("sidebar.Account Settings")}
                  </a>
                </li>
              </ul>
              {/* Sidebar menu end */}</div>
            {/* Sidebar footer START */}
            <div className="px-3 mt-auto pt-3">
              <div className="d-flex align-items-center justify-content-between text-primary-hover">
                <Link
                  className="h5 mb-0 text-body"
                  to="/home"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Home"
                >
                  <i className="bi bi-globe" />
                </Link>
                <a
                  className="h5 mb-0 text-body"
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Sign out"
                  onClick={logoutHandler}
                >
                  <i className="bi bi-power" />
                </a>
              </div>
            </div>
            {/* Sidebar footer END */}
          </div>
        </div>
      </nav>
      {/* Sidebar END */}
    </div>
  );
}

export default SideBar;