import BannerStartHome from "components/BannerStartHome";
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "api/axios";
import "../../../Style.css";
import { Link } from "react-router-dom";

function ListCourses() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const [courses, setCourses] = useState([]);
  const [coursesByCategories, setCoursesByCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [felteredCoursess, setFelteredCoursess] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [itemsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false); // State variable for toggling categories
  const [isCategorySelected, setIsCategorySelected] = useState(false); // State variable to track if any category is selected

  // Fetch all categories
  const fetchCoursesByCategories = async () => {
    try {
      const response = await axios.get("/course/getAllByCategories");
      setCoursesByCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch all courses
  useEffect(() => {
    fetchCoursesByCategories();
    const controller = new AbortController();

    const getCourses = async () => {
      try {
        const response = await axios.get("/course/allCourses", {
          signal: controller.signal,
        });
        setCourses(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getCourses();

    return () => {
      controller.abort();
    };
  }, [accessToken, dispatch]);

  // Handle category toggle
  const handleCategoryToggle = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c !== categoryName)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  // Handle form submit for filtering courses
  const handleFilterSubmit = () => {
    let filteredCourses = [];
    if (selectedCategories.length === 0) {
      setFilterApplied(false);
      filteredCourses = [...courses];
    } else {
      setFilterApplied(true);
      filteredCourses = courses.filter((course) =>
        selectedCategories.some((categoryName) =>
          coursesByCategories
            .find((cat) => cat.categoryName === categoryName)
            .courses.some((c) => c._id === course._id)
        )
      );
    }
    setCurrentPage(1); // Reset pagination to first page
    setFelteredCoursess(filteredCourses);
  };

  // Filter courses based on selected categories and search query
  useEffect(() => {
    let filtered = courses.filter((course) => {
      if (
        searchQuery &&
        !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.courseLevel.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    //console.log("Filtered courses based on categories and search query:", filtered);
    setFelteredCoursess(filtered);
  }, [courses, searchQuery]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = felteredCoursess.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavBar />
      <div>
        <BannerStartHome
          title="All Courses"
          description="Learn more about our courses"
        />

        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-xl-9">
                <div className="row mb-4 align-items-center">
                  <div className="col-xl-8">
                    <form className="border rounded p-2">
                      <div className="input-group input-borderless">
                        <input
                          className="form-control me-1"
                          type="search"
                          placeholder="Find your course"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary mb-0 rounded z-index-1"
                        >
                          <i className="fas fa-search" />
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center mt-3 mt-xl-0">
                    <p className="mb-0 text-end">
                      Showing {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, felteredCoursess.length)} of{" "}
                      {felteredCoursess.length} results
                    </p>
                  </div>
                  <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center mt-3 mt-xl-0">
                    {/* Advanced filter responsive toggler START */}
                    <button
                      className="btn btn-primary mb-0 d-lg-none"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasNavbar"
                      aria-controls="offcanvasNavbar"
                    >
                      <i className="fas fa-sliders-h me-1" /> Show filter
                    </button>
                  </div>
                </div>

                {/* Content */}

                <div className="row g-4">
                  {currentItems.map((course, courseIndex) => (
                    <div
                      className="col-sm-6 col-lg-4 col-xl-4"
                      key={course._id}
                    >
                      <div className="cardd shadow-hover h-100">
                        <img
                          src={`http://localhost:3001/assets/${course.picturePath}`}
                          className="card-img-top"
                          alt="course image"
                          style={{ height: "200px" }}
                        />
                        <div className="card-body pb-0">
                          <div className="d-flex justify-content-between mb-2">
                            {course.courseLevel === "Beginner" && (
                              <a
                                href="#"
                                className="badge bg-info bg-opacity-10 text-info"
                              >
                                {course.courseLevel}
                              </a>
                            )}
                            {course.courseLevel === "All level" && (
                              <a
                                href="#"
                                className="badge bg-info bg-opacity-10 text-info"
                              >
                                {course.courseLevel}
                              </a>
                            )}
                            {course.courseLevel === "Intermediate" && (
                              <a
                                href="#"
                                className="badge bg-warning bg-opacity-10 text-warning"
                              >
                                {course.courseLevel}
                              </a>
                            )}
                            {course.courseLevel === "Advance" && (
                              <a
                                href="#"
                                className="badge bg-danger bg-opacity-10 text-danger"
                              >
                                {course.courseLevel}
                              </a>
                            )}
                          </div>
                          <h5 className="card-title fw-normal">
                            <a href="#">{course.title}</a>
                          </h5>
                          <div className="text-center col-md-2 cardd-layer">
                            <Link
                              to={`/detail-course/${course._id}`}
                              className="btn btn-primary btn-sm"
                            >
                              View more
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-12">
                  <nav
                    className="mt-4 d-flex justify-content-center"
                    aria-label="navigation"
                  >
                    <ul className="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                      <li className="page-item mb-0">
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-angle-double-left" />
                        </button>
                      </li>
                      {Array.from({
                        length: Math.ceil(
                          felteredCoursess.length / itemsPerPage
                        ),
                      }).map((_, index) => (
                        <li
                          className={`page-item mb-0 ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className="page-item mb-0">
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(
                                prev + 1,
                                Math.ceil(
                                  felteredCoursess.length / itemsPerPage
                                )
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(felteredCoursess.length / itemsPerPage)
                          }
                        >
                          <i className="fas fa-angle-double-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              {/* Right sidebar START */}
              <div className="col-lg-4 col-xl-3">
                {/* Responsive offcanvas body START */}
                <nav className="navbar navbar-light navbar-expand-lg mx-0">
                  <div
                    className="offcanvas offcanvas-end"
                    tabIndex={-1}
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                  >
                    <div className="offcanvas-header bg-light">
                      <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                        Advance Filter
                      </h5>
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                    <div className=" p-3 p-lg-0">
                      <form>
                        {/* Category START */}
                        <div className="card card-body shadow p-4 mb-4">
                          {/* Title */}
                          <h4 className="mb-3">Category</h4>
                          {/* Category group */}
                          <div className="col-12">
                            {/* Checkbox */}
                            {coursesByCategories
                              .slice(0, 3)
                              .map((category, index) => (
                                <div key={index}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={category.categoryName}
                                        id={`categoryCheckbox${index}`}
                                        onChange={() =>
                                          handleCategoryToggle(
                                            category.categoryName
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`categoryCheckbox${index}`}
                                      >
                                        {category.categoryName}
                                      </label>
                                    </div>
                                    <span className="small">
                                      ({category.courses.length})
                                    </span>
                                  </div>
                                </div>
                              ))}
                            {coursesByCategories
                              .slice(3)
                              .map((category, index) => (
                                <div key={index}>
                                  <div
                                    className="collapse multi-collapse"
                                    id="multiCollapseExample1"
                                  >
                                    <div className="card card-body p-0">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category.categoryName}
                                            id={`categoryCheckbox${index}`}
                                            onChange={() =>
                                              handleCategoryToggle(
                                                category.categoryName
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`categoryCheckbox${index}`}
                                          >
                                            {category.categoryName}
                                          </label>
                                        </div>
                                        <span className="small">
                                          ({category.courses.length})
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            {/* Collapse button */}
                            <a
                              className=" p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                              data-bs-toggle="collapse"
                              href="#multiCollapseExample1"
                              role="button"
                              aria-expanded="false"
                              aria-controls="multiCollapseExample1"
                            >
                              See <span className="see-more ms-1">more</span>
                              <span className="see-less ms-1">less</span>
                              <i className="fas fa-angle-down ms-2" />
                            </a>
                          </div>
                        </div>
                        {/* Category END */}
                      </form>
                      {/* Form End */}
                    </div>
                    {/* Button */}
                    <div className="d-grid p-2 p-lg-0 text-center">
                      <button
                        className="btn btn-primary mb-0"
                        onClick={handleFilterSubmit}
                      >
                        Filter Results
                      </button>
                    </div>
                  </div>
                </nav>
                {/* Responsive offcanvas body END */}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default ListCourses;
