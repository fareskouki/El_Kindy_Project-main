import react, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "state";


const Index = () => {
  //const user = useSelector((state) => state.user);
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
                {t("sidebarTeacher.My profile")}
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
                    className={`list-group-item ${activeNavItem === "/dashboard-teacher" ? "active" : ""}`}
                    to="/dashboard-teacher"
                    onClick={() => handleNavItemClick("/dashboard-teacher")}
                  >
                    <i className="bi bi-ui-checks-grid fa-fw me-2" />
                     {t("sidebarTeacher.Dashboard")}
                  </Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/homeMeet" || activeNavItem.startsWith("/room/") ? "active" : ""}`}
                  to="/homeMeet"
                  onClick={() => handleNavItemClick("/homeMeet")}>
                    <i className="bi bi-basket fa-fw me-2" />
                    {t("sidebarTeacher.Create Meeting En Ligne")}
                  </Link>
                  <Link 
                  className={`list-group-item ${activeNavItem === "/planningTeacher" || activeNavItem.startsWith("/planningTeacher") ? "active" : ""}`}
                  to="/planningTeacher"
                  onClick={() => handleNavItemClick("/planningTeacher")}>
                    <i className="bi bi-basket fa-fw me-2" />
                      {t("sidebarTeacher.Planning")}                </Link>
                    <Link 
                  className={`list-group-item ${activeNavItem === "/assignments" || activeNavItem.startsWith("/assignments") ? "active" : ""}`}
                  to="/assignments"
                  onClick={() => handleNavItemClick("/assignments")}>
                    <i className="bi bi-basket fa-fw me-2" />
                       {t("sidebarTeacher.Assignment")}                  </Link>


                    

                  <Link 
                  className={`list-group-item ${activeNavItem === "/messages" ? "active" : ""}`}
                  to="/messages"
                  onClick={() => handleNavItemClick("/messages")}>
                    <i className="bi bi-chat-dots-fill fa-fw me-2" />
                    {t("sidebarTeacher.Messages")}   
                  </Link>




                  <Link 
                  className={`list-group-item ${activeNavItem === "/StudentsGrades" ? "active" : ""}`}
                  to="/StudentsGrades"
                  onClick={() => handleNavItemClick("/StudentsGrades")}>
                    <i className="bi bi-people fa-fw me-2" />
                    {t("sidebarTeacher.Students Grades")}  
                  </Link>
                  <Link 
                  className={`list-group-item ${activeNavItem === "/FicheEleve" ? "active" : ""}`}
                  to="/FicheEleve"
                  onClick={() => handleNavItemClick("/FicheEleve")}>
                    <i className="bi bi-people fa-fw me-2" />
                    Student Sheet
                  </Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/time-slots" ? "active" : ""}`}
                  to="/time-slots"
                  onClick={() => handleNavItemClick("/time-slots")}>
                    <i className="bi bi-clock fa-fw me-2" />
                   {t("sidebarTeacher.Time Slots")}   
                  </Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/profile-teacher" ? "active" : ""}`}
                  to="/profile-teacher"
                  onClick={() => handleNavItemClick("/profile-teacher")}>
                <i className="bi bi-person-lines-fill fa-fw me-2" />
                    {t("sidebarTeacher.Edit Profile")}  
                  </Link>


                  <a
                    className="list-group-item text-danger bg-danger-soft-hover"
                    href="#"
                    onClick={logoutHandler}
                  >
                    <i className="fas fa-sign-out-alt fa-fw me-2" />
                    {t("sidebarTeacher.Sign Out")}  
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