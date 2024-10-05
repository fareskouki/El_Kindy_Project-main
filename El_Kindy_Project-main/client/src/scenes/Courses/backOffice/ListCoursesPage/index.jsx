import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAccessToken, setLogout } from "../../../../state";
import refreshToken from "scenes/Authentification/TokenService/tokenService";
import axios from "axios";
//refreshToken
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";

function Index() {
  // Custom hook to get Axios instance with authentication
  const axiosPrivate = useAxiosPrivate();

  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State variables
  const [courses, setCourses] = useState([]); // State to hold the list of courses
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [sortOption, setSortOption] = useState(""); // State to hold the sorting option
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 8,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page
  // Fetch courses from the server when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setOpen(true);

      try {
        const response = await axiosPrivate.get("/course/all"); // Fetch courses from the server
        setCourses(response.data.data); // Update the courses state with the fetched data
        setOpen(false);

      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses(); // Call the fetchCourses function
  }, [axiosPrivate]); // Only re-run effect if axiosPrivate changes

  // Function to handle course deletion
  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/course/delete/${id}`); // Delete the course with the specified id
      toast.success("Course deleted successfully !!", {
        autoClose: 1500,
        style: {
          color: "green",
        },
      });
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      ); // Update courses state after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(lowerCaseQuery) ||
      course.description.toLowerCase().includes(lowerCaseQuery) ||
      course.courseLevel.toLowerCase().includes(lowerCaseQuery) ||
      course.courseCategory.name.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Sort courses based on the selected sorting option
  const sortedCourses = filteredCourses.sort((a, b) => {
    switch (sortOption) {
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      // Add other sorting options as needed
      default:
        return 0;
    }
  });

  const indexOfLastEntry = pagination.currentPage * pagination.entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - pagination.entriesPerPage;
  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <SideBar />
        {/* Page content START */}
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
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
              {/* Page main content START */}
              <div className="page-content-wrapper border">
                {/* ToastContainer */}
                <ToastContainer />
                {/* Title */}
                <div className="row mb-3">
                  <div className="col-12 d-sm-flex justify-content-between align-items-center">
                    <h1 className="h3 mb-2 mb-sm-0">Courses</h1>
                    <Link to="/addCourse" className="btn btn-sm btn-primary mb-0">
                      Create a Course
                    </Link>
                  </div>
                </div>
  
                {/* Render text if courses array is empty */}
                {courses.length === 0 && <h2>No courses available.</h2>}
  
                {/* Card START */}
                {courses.length !== 0 && (
                  <div className="card bg-transparent border">
                    {/* Card header START */}
                    <div className="card-header bg-light border-bottom">
                      {/* Search and select START */}
                      <div className="row g-3 align-items-center justify-content-between">
                        {/* Search bar */}
                        <div className="col-md-8">
                          <form className="rounded position-relative">
                            <input
                              className="form-control bg-body"
                              type="search"
                              placeholder="Search"
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
                        {/* Select option */}
                        <div className="col-md-3">
                          <form>
                            <select
                              className="form-select  border-0 z-index-9"
                              value={sortOption}
                              onChange={(e) => setSortOption(e.target.value)}
                            >
                              <option value="">Sort by</option>
                              <option value="Newest">Newest</option>
                              <option value="Oldest">Oldest</option>
                              {/* Add other sorting options here */}
                            </select>
                          </form>
                        </div>
                      </div>
                      {/* Search and select END */}
                    </div>
                    {/* Card header END */}
                    {/* Card body START */}
                    <div className="card-body">
                      {/* Course table START */}
                      <div className="table-responsive border-0 rounded-3">
                        {/* Table START */}
                        <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                          {/* Table head */}
                          <thead>
                            <tr>
                              <th scope="col" className="border-0 rounded-start">
                                Title
                              </th>
                              <th scope="col" className="border-0">
                                Description
                              </th>
                              <th scope="col" className="border-0">
                                Image
                              </th>
                              <th scope="col" className="border-0">
                                Level
                              </th>
                              <th scope="col" className="border-0">
                                Category
                              </th>
                              <th scope="col" className="border-0">
                                Action
                              </th>
                            </tr>
                          </thead>
                          {/* Table body START */}
                          <tbody>
                            {/* Table row */}
                            {sortedCourses.map((course) => (
                              <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>
                                  {course.picturePath ? (
                                    <img
                                      src={`http://localhost:3001/assets/${course.picturePath}`}
                                      alt="Course"
                                      style={{ width: "130px", height: "110px", borderRadius: "15%" }}
                                    />
                                  ) : (
                                    <span>No Image</span>
                                  )}
                                </td>
                                <td>
                                  {course.courseLevel === "Beginner" && (
                                    <span className="badge bg-primary text-white">
                                      Beginner
                                    </span>
                                  )}
                                  {course.courseLevel === "Intermediate" && (
                                    <span className="badge bg-purple text-white">
                                      Intermediate
                                    </span>
                                  )}
                                  {course.courseLevel === "All level" && (
                                    <span className="badge bg-orange text-white">
                                      All level
                                    </span>
                                  )}
                                  {course.courseLevel === "Advance" && (
                                    <span className="badge bg-warning text-white">
                                      Advance
                                    </span>
                                  )}
                                </td>
                                <td>{course.courseCategory.name}</td>
                                <td>
                                  <Link
                                    to={`/edit-course/${course._id}`}
                                    className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(course._id)}
                                    className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          {/* Table body END */}
                        </table>
                        {/* Table END */}
                      </div>
                      {/* Course table END */}
                    </div>
                    {/* Card body END */}
                    {/* Card footer START */}
                    <div className="card-footer bg-transparent pt-0">
                      {/* Pagination START */}
                      <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                        {/* Content */}
                        <p className="mb-0 text-center text-sm-start">
                          Showing {indexOfFirstEntry + 1} to{" "}
                          {Math.min(indexOfLastEntry, filteredCourses.length)} of{" "}
                          {filteredCourses.length} entries
                        </p>
                        {/* Pagination */}
                        <nav
                          className="d-flex justify-content-center mb-0"
                          aria-label="navigation"
                        >
                          <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                            <li className="page-item mb-0">
                              <a className="page-link" href="#" tabIndex={-1}>
                                <i className="fas fa-angle-left" />
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                1
                              </a>
                            </li>
                            <li className="page-item mb-0 active">
                              <a className="page-link" href="#">
                                2
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                3
                              </a>
                            </li>
                            <li className="page-item mb-0">
                              <a className="page-link" href="#">
                                <i className="fas fa-angle-right" />
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                      {/* Pagination END */}
                    </div>
                    {/* Card footer END */}
                  </div>
                )}
                {/* Card END */}
              </div>
              {/* Page main content END */}
            </>
          )}
          {/* Page content END */}
        </div>
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
  
}
export default Index;