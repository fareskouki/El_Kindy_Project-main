import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../state";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loadScripts } from "../scriptLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faTags,
  faCalendarAlt,
  faUsers,
  faClipboardList,
  faEnvelope,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";
import { getUserById } from "services/usersService/api";

function NavBar() {
  const accessToken = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [userData, setUserData] = useState({});

  const userRole = useSelector((state) => state.userRole);
  const role = accessToken ? jwtDecode(accessToken).roles : null;

  const userToken = accessToken ? jwtDecode(accessToken) : "";

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(userToken.id);
        setUserData(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    //console.log("lng", lng);
    localStorage.setItem('language', lng); // Update the language preference in local storage

  };

  const getAvatarSrc = () => {
    if (userData && userData.picturePath !== "" && userData.authSource === "local") {
      // If user has a custom picture path
      return `http://localhost:3001/assets/${userData.picturePath}`;
    } else if (userData && userData.picturePath === "" && userData.gender !== "") {
      // If user has no custom picture but has a gender
      return userData.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return userData.picturePath;
    }
  };

  const getDashboardLink = () => {
    if (!role) return "/"; // Default link if role is not available

    // Check each role individually
    if (role.includes("student")) {
      return "/dashboard-student";
    } else if (role.includes("teacher")) {
      return "/dashboard-teacher";
    } else if (role.includes("admin") || role.includes("superAdmin")) {
      return "/dashboard-admin";
    } else {
      return "/"; // Default link if role does not match any of the specified roles
    }
  };

  const logoutHandler = () => {
    dispatch(setLogout());

    navigate("/");
  };

  const scriptsLoaded = useRef(false);

  useEffect(() => {
    const scripts = [
      //'/assets/js/functions.js',
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
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSignIn = () => {
    navigate("/sign-in");
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
      {/* Header START */}
      <header className="navbar-light bg-light navbar-sticky header-static">
        {/* Logo Nav START */}
        <nav className="navbar navbar-expand-xl">
          <div className="container">
            {/* Logo START */}

            <Link className="navbar-brand" to="/home">
              <img
                className="light-mode-item navbar-brand-item"
                src="/assets/images/logo/logo.png"
                style={{ width: "150px", height: "60px" }}
                alt="logo"
              />
              <img
                className="dark-mode-item navbar-brand-item"
                src="/assets/images/logo/logo.png"
                style={{ width: "150px", height: "60px" }}
                alt="logo"
              />
            </Link>
            {/* Logo END */}
            {/* Responsive navbar toggler */}
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-animation">
                <span />
                <span />
                <span />
              </span>
            </button>
            {/* Main navbar START */}
            <div className="navbar-collapse w-100 collapse" id="navbarCollapse">
              {/* Nav Main menu START */}
              <ul className="navbar-nav navbar-nav-scroll mx-auto">
                {/* Nav HOME*/}
                <li className="nav-item ">
                  <Link
                    className={`nav-link ${
                      activeNavItem === "/home" ? "active" : ""
                    }`}
                    to="/home"
                    onClick={() => handleNavItemClick("/home")}
                  >
                    <i className="fas fa-home fa-fw me-1" />
                    {t("navbar.home")}

                  </Link>
                </li>
                {/* CORSUS */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${
                      activeNavItem === "/category" ||
                      activeNavItem === "/courses"
                        ? "active"
                        : ""
                    }`}
                    href="#"
                    id="demoMenu"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="fa-fw me-1"
                    />
                    {t("navbar.corsus")}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="demoMenu">
                    <li>
                      {" "}
                      <Link
                        className={`dropdown-item ${
                          activeNavItem === "/category" ? "active" : ""
                        }`}
                        to="/category"
                        onClick={() => handleNavItemClick("/category")}
                      >
                        <FontAwesomeIcon icon={faTags} className="fa-fw me-1" />{" "}
                        {/* Category Courses */}
                        {t("navbar.Category")}
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link
                        className={`dropdown-item ${
                          activeNavItem === "/courses" ? "active" : ""
                        }`}
                        to="/courses"
                        onClick={() => handleNavItemClick("/courses")}
                      >
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="fa-fw me-1"
                        />
                        {t("navbar.Courses")}
                        
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link
                        className={`dropdown-item ${
                          activeNavItem === "/stage" ? "active" : ""
                        }`}
                        to="/stage"
                        onClick={() => handleNavItemClick("/stage")}
                      >
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="fa-fw me-1"
                        />
                        {t("navbar.InternalShip")}
                        
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link
                    className={`nav-link ${
                      activeNavItem === "/listEventUser" ? "active" : ""
                    }`}
                    to="/listEventUser"
                    onClick={() => handleNavItemClick("/listEventUser")}
                  >
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="fa-fw me-1"
                    />
                     {t("navbar.Events")}
                  </Link>
                </li>
                {/* PRODUCT*/}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeNavItem === "/ListShop" ? "active" : ""
                    }`}
                    to="/ListShop"
                    onClick={() => handleNavItemClick("/ListShop")}
                  >
                    <FontAwesomeIcon
                      icon={faBasketShopping}
                      className="fa-fw me-1"
                    />{" "}
                     {t("navbar.Shop")}
                    
                  </Link>
                </li>

                {/* Nav item 4 Component
                <li className="nav-item ">
                  <a className="nav-link" href="docs/alerts.html">
                  <FontAwesomeIcon icon={faUsers} className="fa-fw me-1" /> 
                    Témoignags
                  </a>
                </li>
                */}

                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link
                    className={`nav-link ${
                      activeNavItem === "/inscription" ? "active" : ""
                    }`}
                    to="/inscription"
                    onClick={() => handleNavItemClick("/inscription")}
                  >
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className="fa-fw me-1"
                    />{" "}
                    {/* Preinscription */}
                    {t("navbar.Preinscription")}
                  </Link>
                </li>
                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link
                    className={`nav-link ${
                      activeNavItem === "/contact-us" ? "active" : ""
                    }`}
                    to="/contact-us"
                    onClick={() => handleNavItemClick("/contact-us")}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="fa-fw me-1" />{" "}
                    {/* Contact */}
                    {t("navbar.Contact")}
                    
                  </Link>
                </li>
              </ul>
              {/* Nav Main menu END */}
              {/* Language Switcher */}
              <ul className="navbar-nav navbar-nav-scroll me-3 d-none d-xl-block">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="language"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-globe me-2" />
                    <span className="d-none d-lg-inline-block">
                      {t("navbar.language")}
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end min-w-auto"
                    aria-labelledby="language"
                  >
                    <li>
                      <button
                        className={`dropdown-item ${
                          i18n.language === "en" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("en")}
                      >
                        <img
                          className="fa-fw me-2"
                          src="assets/images/flags/us.svg"
                          alt="English"
                        />
                        English
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${
                          i18n.language === "fr" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("fr")}
                      >
                        <img
                          className="fa-fw me-2"
                          src="assets/images/flags/fr.svg"
                          alt="French"
                        />
                        French
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${
                          i18n.language === "ar" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("ar")}
                      >
                        <img
                          className="fa-fw me-2"
                          src="assets/images/flags/tn.svg"
                          alt="arabic"
                        />
                        Arabic
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* Dark mode switch */}
              {!accessToken && (
                <div className="navbar-nav my-2 ms-2">
                  <div className="modeswitch-wrap" id="darkModeSwitch">
                    <div className="modeswitch-item">
                      <div className="modeswitch-icon" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Main navbar START */}
            <div></div>
            {/* Main navbar END */}
            {/* Profile START */}
            {accessToken ? (
              <div className="dropdown ms-1 ms-lg-0">
                <a
                  className="avatar avatar-sm p-0"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-auto-close="outside"
                  data-bs-display="static"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="avatar-img rounded-circle"
                    src={getAvatarSrc()}
                    alt="avatar"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
                  aria-labelledby="profileDropdown"
                >
                  {/* Profile info */}
                  <li className="px-3">
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="avatar me-3">
                        <img
                          className="avatar-img rounded-circle shadow"
                          src={getAvatarSrc()}
                          alt="avatar"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <a className="h6 mt-2 mt-sm-0 text-truncate" href="#">
                          {userToken?.fullName}
                        </a>
                        <p className="small m-0">{userData?.email}</p>
                      </div>
                    </div>
                    <hr />
                  </li>
                  {/* Links */}
                  <li>
                    <Link to={getDashboardLink()} className="dropdown-item">
                      <i className="bi bi-grid-fill fa-fw me-1" />{" "}
                      {/* Replace "bi-person" with "bi-house-door" for a dashboard icon */}
                      {t("navbar.Dashboard")}
                      
                    </Link>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person fa-fw me-2" />
                      {t("navbar.Edit Profile")}
                      
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-gear fa-fw me-2" />
                      {t("navbar.Account Settings")}
                      
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item bg-danger-soft-hover"
                      onClick={logoutHandler}
                    >
                      <i className="bi bi-power fa-fw me-2" />
                      {t("navbar.Sign Out")}

                      
                    </a>
                  </li>
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Dark mode switch START */}
                  <li>
                    <div className="modeswitch-wrap" id="darkModeSwitch">
                      <div className="modeswitch-item">
                        <div className="modeswitch-icon" />
                      </div>
                      <span> {t("navbar.Dark mode")}</span>
                    </div>
                  </li>
                  {/* Dark mode switch END */}
                </ul>
              </div>
            ) : (
              <div class="navbar-nav">
                {/* Signout button  */}
                <div className="navbar-nav d-lg-inline-block">
                  <button
                    className="btn btn-orange-soft mb-0 rounded-pill"
                    onClick={handleSignIn}
                  >
                    <i className="fas fa-sign-in-alt me-2" />
                    {t("navbar.Sign In")}
                    
                  </button>
                </div>
              </div>
            )}

            {/* Profile START */}
          </div>
        </nav>
        {/* Logo Nav END */}
      </header>

      {/* Header END */}
    </div>
  );
}

export default NavBar;