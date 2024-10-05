import react, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import { useTranslation } from "react-i18next";

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");

  const { t, i18n } = useTranslation();


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
    <>
      {/* Left sidebar START */}
      <div className="col-xl-3">
        {/* Responsive offcanvas body START */}
        <nav className="navbar navbar-light navbar-expand-xl mx-0">
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            {/* Offcanvas header */}
            <div className="offcanvas-header bg-light">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                {t("sidebarStudent.My profile")}
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            {/* Offcanvas body */}
            <div className="offcanvas-body p-3 p-xl-0">
              <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
                {/* Dashboard menu */}
                <div className="list-group list-group-dark list-group-borderless">
                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/dashboard-student" ? "active" : ""
                    }`}
                    to="/dashboard-student"
                    onClick={() => handleNavItemClick("/dashboard-student")}
                  >
                    <i className="bi bi-ui-checks-grid fa-fw me-2" />
                     {t("sidebarStudent.Dashboard")}
                  </Link>
                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/meetingHomeS" ? "active" : ""
                    }`}
                    to="/meetingHomeS"
                    onClick={() => handleNavItemClick("/meetingHomeS")}
                  >
                    <i className="bi bi-basket fa-fw me-2" />
                   {t("sidebarStudent.Meeting En Ligne")}
                  </Link>
                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/planningStudent" ? "active" : ""
                    }`}
                    to="/planningStudent"
                    onClick={() => handleNavItemClick("/planningStudent")}
                  >
                    <i className="bi bi-basket fa-fw me-2" />
                    {t("sidebarStudent.Planning")}
                  </Link>
                   <Link className="list-group-item" to="/assignmentStudent"><i className="bi bi-basket fa-fw me-2" />Assignment</Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/assignmentStudent" || activeNavItem.startsWith("/assignments") ? "active" : ""}`}
                  to="/assignmentStudent"
                  onClick={() => handleNavItemClick("/assignmentStudent")}>
                    <i className="bi bi-basket fa-fw me-2" />
                      {t("sidebarStudent.Assignment")}                </Link>

                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/TeachersList" ? "active" : ""
                    }`}
                    to="/TeachersList"
                    onClick={() => handleNavItemClick("/TeachersList")}
                  >
                    <i className="bi bi-people fa-fw me-2" />
                     {t("sidebarStudent.Teachers")}  
                  </Link>
                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/time-slots-student" ? "active" : ""
                    }`}
                    to="/time-slots-student"
                    onClick={() => handleNavItemClick("/time-slots-student")}
                  >
                    <i className="bi bi-clock fa-fw me-2" />
                    {t("sidebarStudent.Time Slots")}  
                  </Link>
                  <Link
                    className={`list-group-item ${
                      activeNavItem === "/profile-student" ? "active" : ""
                    }`}
                    to="/profile-student"
                    onClick={() => handleNavItemClick("/profile-student")}
                  >
                    <i className="bi bi-person-lines-fill fa-fw me-2" />
                   {t("sidebarStudent.Edit Profile")}  
                  </Link>{" "}
                  <a
                    className="list-group-item text-danger bg-danger-soft-hover"
                    href="#"
                    onClick={logoutHandler}
                  >
                    <i className="fas fa-sign-out-alt fa-fw me-2" />
                    {t("sidebarStudent.Sign Out")} 
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* Responsive offcanvas body END */}
      </div>
      {/* Left sidebar END */}
    </>
  );
};
export default Index;