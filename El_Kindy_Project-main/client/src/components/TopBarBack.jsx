import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {  Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setLogout } from '../state';
import { jwtDecode } from "jwt-decode";
import { getUserById } from 'services/usersService/api';
import { useTranslation } from 'react-i18next';

function TopBarBack() {

  //const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});


  const accessToken = useSelector((state) => state.accessToken);
  const user = accessToken ? jwtDecode(accessToken) : "";
  const role = accessToken ? jwtDecode(accessToken).roles : null;


  const { t, i18n } = useTranslation();


  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(user.id);
        setUserData(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

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

  const logoutHandler = () => {
    dispatch(
      setLogout()
  );
  navigate("/");
  }

  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    //console.log("lng", lng);
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

  return (
    <div>
        {/* Top bar START */}
        <nav className="top-bar navbar-light border-bottom py-0 py-xl-3">
            <div className="container-fluid p-0">
              <div className="d-flex align-items-center w-100">
                {/* Logo START */}
                <div className="d-flex align-items-center d-xl-none">
                  <a className="navbar-brand" href="index.html">
                    <img
                      className="light-mode-item navbar-brand-item h-30px"
                      src="/assets/images/logo/logo.png"
                      alt
                    />
                    <img
                      className="dark-mode-item navbar-brand-item h-30px"
                      src="/assets/images/logo/logo.png"
                      alt
                    />
                  </a>
                </div>
                {/* Logo END */}
                {/* Toggler for sidebar START */}
                <div className="navbar-expand-xl sidebar-offcanvas-menu">
                  <button
                    className="navbar-toggler me-auto"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSidebar"
                    aria-controls="offcanvasSidebar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    data-bs-auto-close="outside"
                  >
                    <i
                      className="bi bi-text-right fa-fw h2 lh-0 mb-0 rtl-flip"
                      data-bs-target="#offcanvasMenu"
                    >
                      {" "}
                    </i>
                  </button>
                </div>
                {/* Toggler for sidebar END */}
                {/* Top bar left */}
                <div className="navbar-expand-lg ms-auto ms-xl-0">
                  {/* Toggler for menubar START */}
                  <button
                    className="navbar-toggler ms-auto"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTopContent"
                    aria-controls="navbarTopContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-animation">
                      <span />
                      <span />
                      <span />
                    </span>
                  </button>
                  {/* Toggler for menubar END */}
                  {/* Topbar menu START */}
                  <div
                    className="collapse navbar-collapse w-100"
                    id="navbarTopContent"
                  >
                    {/* Top search START */}
                    <div className="nav my-3 my-xl-0 flex-nowrap align-items-center">
                      <div className="nav-item w-100">
                        <form className="position-relative">
                          <input
                            className="form-control pe-5 bg-secondary bg-opacity-10 border-0"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                          <button
                            className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                            type="submit"
                          >
                            <i className="fas fa-search fs-6 text-primary" />
                          </button>
                        </form>
                      </div>
                    </div>
                    {/* Top search END */}
                  </div>
                  {/* Topbar menu END */}
                </div>
                {/* Top bar left END */}
                {/* Top bar right START */}
                <div className="ms-xl-auto">
                  <ul className="navbar-nav flex-row align-items-center">
                    {/* Language Switcher */}
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
                          src="assets/images/flags/uk.svg"
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
                          src="assets/images/flags/ar.svg"
                          alt="arabic"
                        />
                        Arabic
                      </button>
                    </li>
                  </ul>
                </li>

                    {/* Notification dropdown START */}
                    <li className="nav-item ms-2 ms-md-3 dropdown">
                      {/* Notification button */}
                      <a
                        className="btn btn-light btn-round mb-0"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        <i className="bi bi-bell fa-fw" />
                      </a>
                      {/* Notification dote */}
                      <span className="notif-badge animation-blink" />
                      {/* Notification dropdown menu START */}
                      <div className="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg border-0">
                        <div className="card bg-transparent">
                          <div className="card-header bg-transparent border-bottom py-4 d-flex justify-content-between align-items-center">
                            <h6 className="m-0">
                              Notifications{" "}
                              <span className="badge bg-danger bg-opacity-10 text-danger ms-2">
                                2 new
                              </span>
                            </h6>
                            <a className="small" href="#">
                              Clear all
                            </a>
                          </div>
                          <div className="card-body p-0">
                            <ul className="list-group list-unstyled list-group-flush">
                              {/* Notif item
                              <li>
                                <a
                                  href="#"
                                  className="list-group-item-action border-0 border-bottom d-flex p-3"
                                >
                                  <div className="me-3">
                                    <div className="avatar avatar-md">
                                      <img
                                        className="avatar-img rounded-circle"
                                        src="/assets/images/avatar/08.jpg"
                                        alt="avatar"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-body small m-0">
                                      Congratulate <b>Joan Wallace</b> for
                                      graduating from{" "}
                                      <b>Microverse university</b>
                                    </p>
                                    <u className="small">Say congrats</u>
                                  </div>
                                </a>
                              </li>
                               */}
                            </ul>
                          </div>
                          {/* Button */}
                          <div className="card-footer bg-transparent border-0 py-3 text-center position-relative">
                            <a href="#" className="stretched-link">
                              See all incoming activity
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Notification dropdown menu END */}
                    </li>
                    {/* Notification dropdown END */}
                    {/* Profile dropdown START */}
                    <li className="nav-item ms-2 ms-md-3 dropdown">
                      {/* Avatar */}
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
                      {/* Profile dropdown START */}
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
                            <div>
                              <a className="h6 mt-2 mt-sm-0 text-truncate" href="#">
                                {user?.fullName}
                              </a>
                              <p className="small m-0">{user?.email}</p>
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
                      {/* Profile dropdown END */}
                    </li>
                    {/* Profile dropdown END */}
                  </ul>
                </div>
                {/* Top bar right END */}
              </div>
            </div>
          </nav>
          {/* Top bar END */}
    </div>
  )
}

export default TopBarBack