// Your modified code here
import React, { useEffect, useState } from "react";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import AddTeacher from "../userCrud/addTeacher";
import UpdateTeacher from "../userCrud/updateTeacher";
import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";

function TeachersDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(6);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");

  const iconStyle = {
    marginRight: "10px",
  };

  const fetchData = async () => {
    setOpen(true);

    try {
      const response = await getUsers("teacher");
      setTeachers(response.data.data);
      setLoading(false);
      setOpen(false);

    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Error fetching teachers. Please try again later.");
      setLoading(false);
      setOpen(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleMore = (teacherId) => {
    setTeacherDetails((prevState) => ({
      ...prevState,
      [teacherId]: !prevState[teacherId],
    }));
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false);
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const handleToggleFormUpdate = (teacher) => {
    setTeacher(teacher);
    setShowFormUpdate(true);
    setShowForm(false);
  };

  const handleBlockTeacher = async (teacherId) => {
    try {
      const response = await blockUser(teacherId);
      if (response.status === 200) {
        console.log("Teacher blocked successfully!");
        fetchData();
      } else {
        console.error("Error blocking teacher:", response.data);
      }
    } catch (error) {
      console.error("Error blocking teacher:", error);
    }
  };

  const handleUnblockTeacher = async (teacherId) => {
    try {
      const response = await unblockUser(teacherId);
      if (response.status === 200) {
        console.log("Teacher unblocked successfully!");
        fetchData();
      } else {
        console.error("Error unblocking teacher:", response.data);
      }
    } catch (error) {
      console.error("Error unblocking teacher:", error);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    try {
      await removeUser(teacherId);
      fetchData();
      close();
    } catch (error) {
      console.error("Error removing teacher:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    Object.values(teacher).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //export admins
  const djangoapi = "http://127.0.0.1:8000/insertdata/teacher/";
  const addTeachers = async () => {
    try {
      const response = await fetch(djangoapi); // Assuming your backend API is available at this endpoint
      if (response.status === 200) {
        fetchData();
      } else {
        throw new Error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors de la requête GET:", error.message);
    }
  };

  const handleOpenSheets = () => {
    // URL of your Google Sheets document
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/18maG021PnL_2ZaDc8A51ek3nORxYS-G5ItsCLfOvAnw/edit#gid=0";

    // Open the Google Sheets document in a new tab
    window.open(googleSheetsUrl, "_blank");
  };

  return (
    <div>
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />
          {open ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <>
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
              <div className="page-content-wrapper border">
                <div className="row">
                  <div className="col-12">
                    <h1 className="h2 mb-2 mb-sm-0">Teachers list</h1>
                  </div>
                </div>
                <div className="card bg-transparent">
                  <div className="card-header bg-transparent border-bottom px-0">
                    <div className="row g-3 align-items-center justify-content-between">
                      <div className="col-md-8">
                        <form className="rounded position-relative">
                          <input
                            className="form-control bg-transparent"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                          {searchQuery === "" && (
                            <button
                              className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                              onClick={(event) => event.preventDefault()}
                            >
                              <i className="fas fa-search fs-6 " />
                            </button>
                          )}
                        </form>
                      </div>
                      <div className="col-md-4 text-end">
                        <button
                          className="btn btn-primary"
                          onClick={handleToggleForm}
                        >
                          Add New Teacher
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body px-0">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="nav-preview-tab-1"
                    >
                      <div className="row g-4">
                        {currentTeachers.map((teacher) => (
                          <div
                            key={teacher._id}
                            className="col-md-6 col-xxl-4"
                          >
                            <div className="card bg-transparent border h-100">
                              <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                <div className="d-sm-flex align-items-center">
                                  <div className="avatar avatar-md flex-shrink-0">
                                    <img
                                      className="avatar-img rounded-circle"
                                      src={
                                        teacher.picturePath ||
                                        "assets/images/element/02.jpg"
                                      }
                                      alt="avatar"
                                    />
                                  </div>
                                  <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
                                    <h6 className="mb-0">
                                      {teacher.firstName} {teacher.lastName}
                                      {teacher.verified ? (
                                        <i className="bi bi-check-circle-fill text-success ms-2" />
                                      ) : (
                                        <i className="bi bi-exclamation-circle-fill text-warning ms-2" />
                                      )}
                                    </h6>
                                    <span className="text-body small">
                                      {teacher.email}
                                    </span>
                                  </div>
              </div>
              <div className="card bg-transparent">
                <div className="card-header bg-transparent border-bottom px-0">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-6">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-transparent"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {searchQuery === "" && (
                          <button
                            className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                            onClick={(event) => event.preventDefault()}
                          >
                            <i className="fas fa-search fs-6 " />
                          </button>
                        )}
                      </form>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                      <button
                        className="btn btn-info m-2 text-wrap text-break"
                        onClick={addTeachers}
                      >
                        <i className="fas fa-file-import" style={iconStyle}></i>
                        <span className="d-none d-md-inline">
                          Import Teachers
                        </span>
                      </button>

                      <button
                        className="btn btn-success m-2 text-wrap text-break"
                        onClick={handleOpenSheets}
                      >
                        <i className="fas fa-file-alt " style={iconStyle}></i>
                        <span className="d-none d-md-inline">
                          Open Google Sheets
                        </span>
                      </button>
                      <button
                        className="btn btn-primary m-2 text-wrap text-break"
                        onClick={handleToggleForm}
                      >
                        <i className="fas fa-user" style={iconStyle}></i>

                        <span className="d-none d-md-inline">
                          Add New Teacher
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body px-0">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-preview-tab-1"
                  >
                    <div className="row g-4">
                      {currentTeachers.map((teacher) => (
                        <div key={teacher._id} className="col-md-6 col-xxl-4">
                          <div className="card bg-transparent border h-100">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                              <div className="d-sm-flex align-items-center">
                                <div className="avatar avatar-md flex-shrink-0">
                                  <img
                                    className="avatar-img rounded-circle"
                                    src={
                                      teacher.picturePath ||
                                      "assets/images/element/02.jpg"
                                    }
                                    alt="avatar"
                                  />
                                </div>
                                <div className="dropdown text-end">
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-light btn-round small mb-0"
                                    role="button"
                                    id="dropdownShare2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="bi bi-three-dots fa-fw" />
                                  </a>
                                  <ul
                                    className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded"
                                    aria-labelledby="dropdownShare2"
                                  >
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() =>
                                          handleToggleFormUpdate(teacher)
                                        }
                                      >
                                        <span className="text-primary">
                                          <i className="bi bi-pencil-square fa-fw me-2" />
                                          Edit
                                        </span>
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() =>
                                          handleRemoveTeacher(teacher._id)
                                        }
                                      >
                                        <span className="text-danger">
                                          <i className="bi bi-trash fa-fw me-2" />
                                          Remove
                                        </span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="card-body">
                                <div>
                                  <p className="mb-1">
                                    <i className="bi bi-calendar-check me-2 text-primary" />
                                    <strong>Date of Birth:</strong>{" "}
                                    {teacher.dateOfBirth
                                      ? new Date(
                                          teacher.dateOfBirth
                                        ).toLocaleDateString()
                                      : "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-geo-alt me-2 text-primary" />
                                    <strong>Address:</strong> {teacher.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-1">
                                    <i className="bi bi-gender-male me-2 text-primary" />
                                    <strong>Gender:</strong>{" "}
                                    {teacher.gender || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary" />
                                    <strong>Phone Number:</strong>{" "}
                                    {teacher.phoneNumber1 || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    {teacher.blocked ? (
                                      <i className="bi bi-lock me-2 text-primary" />
                                    ) : (
                                      <i className="bi bi-check2-circle me-2 text-primary" />
                                    )}
                                    <strong>State:</strong>{" "}
                                    {teacher.blocked ? (
                                      <span className="state-badge blocked">
                                        Blocked
                                      </span>
                                    ) : (
                                      <span className="state-badge">
                                        Active
                                      </span>
                                    )}
                                  </p>
                                  <div className="teacher-more">
                                    <a
                                      className="p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                                      onClick={() =>
                                        handleToggleMore(teacher._id)
                                      }
                                    >
                                      {teacherDetails[teacher._id] ? (
                                        <>
                                          See less{" "}
                                          <i className="fas fa-angle-up ms-2" />
                                        </>
                                      ) : (
                                        <>
                                          See{" "}
                                          <span className="see-more ms-1">
                                            more
                                          </span>
                                          <i className="fas fa-angle-down ms-2" />
                                        </>
                                      )}
                                    </a>
                                    {teacherDetails[teacher._id] && (
                                      <div className="m-1">
                                        {/* Display additional information for the teacher */}
                                        {/* Courses Taught */}
                                        <p className="mb-1">
                                          <i className="bi bi-journal-text me-2 text-primary" />{" "}
                                          {/* Icon for Courses Taught */}
                                          <strong>Courses Taught:</strong>{" "}
                                          {/* Heading for Courses Taught */}
                                          {/* Display coursesTaught */}
                                          {teacher.teacherInfo.coursesTaught
                                            .length > 0
                                            ? teacher.teacherInfo.coursesTaught.map(
                                                (course) => (
                                                  <span key={course._id}>
                                                    {course.title},{" "}
                                                  </span>
                                                )

                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="card-body">
                              <div>
                                <p className="mb-1">
                                  <i className="bi bi-calendar-check me-2 text-primary" />
                                  <strong>Date of Birth:</strong>{" "}
                                  {teacher.dateOfBirth
                                    ? new Date(
                                        teacher.dateOfBirth
                                      ).toLocaleDateString()
                                    : "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-geo-alt me-2 text-primary" />
                                  <strong>Address:</strong> {teacher.address}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1">
                                  <i className="bi bi-gender-male me-2 text-primary" />
                                  <strong>Gender:</strong>{" "}
                                  {teacher.gender || "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-telephone me-2 text-primary" />
                                  <strong>Phone Number:</strong>{" "}
                                  {teacher.phoneNumber1 || "Not available"}
                                </p>
                                <p className="mb-1">
                                  {teacher.blocked ? (
                                    <i className="bi bi-lock me-2 text-primary" />
                                  ) : (
                                    <i className="bi bi-check2-circle me-2 text-primary" />
                                  )}
                                  <strong>State:</strong>{" "}
                                  {teacher.blocked ? (
                                    <span className="state-badge blocked">
                                      Blocked
                                    </span>
                                  ) : (
                                    <span className="state-badge">Active</span>
                                  )}
                                </p>
                                <div className="teacher-more">
                                  <a
                                    className="p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                                    onClick={() =>
                                      handleToggleMore(teacher._id)
                                    }
                                  >
                                    {teacherDetails[teacher._id] ? (
                                      <>
                                        See less{" "}
                                        <i className="fas fa-angle-up ms-2" />
                                      </>
                                    ) : (
                                      <>
                                        See{" "}
                                        <span className="see-more ms-1">
                                          more
                                        </span>
                                        <i className="fas fa-angle-down ms-2" />
                                      </>
                                    )}
                                  </a>
                                  {teacherDetails[teacher._id] && (
                                    <div className="m-1">
                                      {/* Display additional information for the teacher */}
                                      {/* Courses Taught */}
                                      <p className="mb-1">
                                        <i className="bi bi-journal-text me-2 text-primary" />{" "}
                                        {/* Icon for Courses Taught */}
                                        <strong>Courses Taught:</strong>{" "}
                                        {/* Heading for Courses Taught */}
                                        {/* Display coursesTaught */}
                                        {teacher.teacherInfo.coursesTaught
                                          .length > 0
                                          ? teacher.teacherInfo.coursesTaught.map(
                                              (course) => (
                                                <span key={course._id}>
                                                  {course.title},{" "}
                                                </span>

                                              )
                                            : "None"}
                                        </p>
                                        {/* Classes Teaching */}
                                        <p className="mb-1">
                                          <i className="bi bi-people me-2 text-primary" />{" "}
                                          {/* Icon for Classes Teaching */}
                                          <strong>Classes Teaching:</strong>{" "}
                                          {/* Heading for Classes Teaching */}
                                          {/* Display classesTeaching */}
                                          {teacher.teacherInfo.classesTeaching
                                            .length > 0
                                            ? teacher.teacherInfo.classesTeaching.map(
                                                (classItem) => (
                                                  <span key={classItem._id}>
                                                    {classItem.className},{" "}
                                                  </span>
                                                )
                                              )
                                            : "None"}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Card footer */}
                                <div className="card-footer bg-transparent border-top">
                                  <div className="d-sm-flex justify-content-between align-items-center">
                                    {/* Rating star */}
                                    <h6 className="mb-2 mb-sm-0">
                                      <i className="bi bi-calendar fa-fw text-orange me-2" />
                                      <span className="text-body">
                                        Join at:
                                      </span>{" "}
                                      {new Date(
                                        teacher.createdAt
                                      ).toLocaleDateString()}
                                    </h6>
                                    {/* Buttons */}
                                    <div className="text-end text-primary-hover">
                                      {/* Message button */}
                                      <a
                                        href="#"
                                        className="btn btn-link text-body p-0 mb-0 me-2"
                   </div>
                              {/* Card footer */}
                              <div className="card-footer bg-transparent border-top">
                                <div className="d-sm-flex justify-content-between align-items-center">
                                  {/* Rating star */}
                                  <h6 className="mb-2 mb-sm-0">
                                    <i className="bi bi-calendar fa-fw text-orange me-2" />
                                    <span className="text-body">Join at:</span>{" "}
                                    {new Date(
                                      teacher.createdAt
                                    ).toLocaleDateString()}
                                  </h6>
                                  {/* Buttons */}
                                  <div className="text-end text-primary-hover">
                                    {/* Message button */}
                                    <a
                                      href="#"
                                      className="btn btn-link text-body p-0 mb-0 me-2"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Message"
                                      aria-label="Message"
                                    >
                                      <span className="text-primary">
                                        <i className="bi bi-envelope-fill me-1" />
                                      </span>
                                    </a>
                                    {/* Block/Unblock button */}
                                    {teacher.blocked ? (
                                      <button
                                        className="btn btn-link text-body p-0 mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Unblock"
                                        aria-label="Unblock"
                                        onClick={() =>
                                          handleUnblockTeacher(teacher._id)
                                        }
                                      >
                                        <span className="text-danger">
                                          <i className="bi bi-lock-fill me-1" />
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-link text-body p-0 mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Message"
                                        aria-label="Message"
                                      >
                                        <span className="text-primary">
                                          <i className="bi bi-envelope-fill me-1" />
                                        </span>
                                      </a>
                                      {/* Block/Unblock button */}
                                      {teacher.blocked ? (
                                        <button
                                          className="btn btn-link text-body p-0 mb-0"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Unblock"
                                          aria-label="Unblock"
                                          onClick={() =>
                                            handleUnblockTeacher(teacher._id)
                                          }
                                        >
                                          <span className="text-danger">
                                            <i className="bi bi-lock-fill me-1" />
                                          </span>
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-link text-body p-0 mb-0"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Block"
                                          aria-label="Block"
                                          onClick={() =>
                                            handleBlockTeacher(teacher._id)
                                          }
                                        >
                                          <span className="text-danger">
                                            <i className="bi bi-unlock-fill me-1" />
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


                {/* Card footer START */}
                <div className="card-footer bg-transparent pt-0 px-0 mt-4">
                  {/* Pagination START */}
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    {/* Content */}
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstTeacher + 1} to{" "}
                      {Math.min(
                        indexOfLastTeacher,
                        filteredTeachers.length
                      )}{" "}
                      of {filteredTeachers.length} entries
                    </p>
                    {/* Pagination */}
                    <nav
                      className="d-flex justify-content-center mb-0"
                      aria-label="navigation"
                    >
                      <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                          <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)} tabIndex={-1}>
                            <i className="fas fa-angle-left" />
                          </a>
                        </li>
                        {Array.from({ length: Math.ceil(filteredTeachers.length / teachersPerPage) }, (_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                            <a className="page-link" href="#" onClick={() => paginate(i + 1)}>
                              {i + 1}
                            </a>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === Math.ceil(filteredTeachers.length / teachersPerPage) && 'disabled'}`}>
                          <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>
                            <i className="fas fa-angle-right" />
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  {/* Pagination END */}

              {/* Card footer START */}
              <div className="card-footer bg-transparent pt-0 px-0 mt-4">
                {/* Pagination START */}
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                  {/* Content */}
                  <p className="mb-0 text-center text-sm-start">
                    Showing {indexOfFirstTeacher + 1} to{" "}
                    {Math.min(indexOfLastTeacher, filteredTeachers.length)} of{" "}
                    {filteredTeachers.length} entries
                  </p>
                  {/* Pagination */}
                  <nav
                    className="d-flex justify-content-center mb-0"
                    aria-label="navigation"
                  >
                    <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 && "disabled"
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#"
                          onClick={() => paginate(currentPage - 1)}
                          tabIndex={-1}
                        >
                          <i className="fas fa-angle-left" />
                        </a>
                      </li>
                      {Array.from(
                        {
                          length: Math.ceil(
                            filteredTeachers.length / teachersPerPage
                          ),
                        },
                        (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              currentPage === i + 1 && "active"
                            }`}
                          >
                            <a
                              className="page-link"
                              href="#"
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </a>
                          </li>
                        )
                      )}
                      <li
                        className={`page-item ${
                          currentPage ===
                            Math.ceil(
                              filteredTeachers.length / teachersPerPage
                            ) && "disabled"
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#"
                          onClick={() => paginate(currentPage + 1)}
                        >
                          <i className="fas fa-angle-right" />
                        </a>
                      </li>
                    </ul>
                  </nav>

                </div>
                {/* Card footer END */}
              </div>
            </>
          )}

          {showForm && <AddTeacher onClose={close} fetchData={fetchData} />}

          {showFormUpdate && (
            <UpdateTeacher
              teacher={teacher}
              onClose={close}
              fetchData={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default TeachersDashboard;