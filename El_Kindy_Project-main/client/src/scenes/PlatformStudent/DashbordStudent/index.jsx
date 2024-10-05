import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import React, { useEffect, useState } from "react";
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";

function Index() {
    const [courses, setCourses] = useState([]);
    const dispatch = useDispatch();
    const [topCourses, setTopCourses] = useState([]);

    const [categories, setCategories] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const fetchCategories = async () => {
        try {
          const response = await axiosPrivate.get("http://localhost:3001/api/categories");
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      useEffect(() => {
        fetchCategories();
      }, []);


      useEffect(() => {
        const controller = new AbortController();

        const fetchCourses = async () => {
            try {
                const response = await axiosPrivate.get('/course/all', {
                    signal: controller.signal
                });
                setCourses(response.data.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                // You can dispatch an action here to handle the error in Redux
                // dispatch({ type: 'FETCH_COURSES_ERROR', payload: error.message });
            }
        };

        fetchCourses();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchTopCourses = async () => {
            try {
                const response = await axiosPrivate.get("http://localhost:3001/inscription/all/TopEnrolledCourses");
                setTopCourses(response.data.courses);
            } catch (error) {
                console.error("Error fetching top courses:", error);
            }
        };
    
        fetchTopCourses();
    }, []);
    

    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
                        {/* ****************testt **************** */}

            <main>


                {/* hedha l partie l fou9aneya  */}
                < NavBar />
                < TopBarTeacherStudent />
                {/* =======================
Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarStudent />
                            <div className="col-xl-9">
                                {/* Counter boxes START */}
                                <div className="row mb-4">
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-orange bg-opacity-15 rounded-3">
                                            <span className="display-6 lh-1 text-orange mb-0"><i className="fas fa-tv fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="mb-0 fw-bold">{courses.length}</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Total Courses</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-15 rounded-3">
                                            <span className="display-6 lh-1 text-purple mb-0"><i className="fas fa-clipboard-check fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="mb-0 fw-bold">{categories.length}</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Total Categories</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
                                            <span className="display-6 lh-1 text-success mb-0"><i className="fas fa-medal fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="mb-0 fw-bold">0</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Achieved Certificates</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Counter boxes END */}

                                
{/* Top instructors START */}
<div className="col-lg-6 col-xxl-4">
  <div className="card shadow h-100">
    {/* Card header */}
    <div className="card-header border-bottom d-flex justify-content-between align-items-center p-4">
      <h5 className="card-header-title">Top Courses</h5>
    </div>
    {/* Card body START */}
    <div className="card-body p-4">
      {/* Instructor items */}
      {topCourses.map(course => (
        <div className="mt-2"> 
        <div key={course._id} className="d-sm-flex justify-content-between align-items-center">
          {/* Avatar and info */}
          <div className="d-sm-flex align-items-center mb-1 mb-sm-0">
            {/* Avatar */}
            <div className="avatar avatar-md flex-shrink-0">
              <img className="avatar-img rounded-circle" src={`http://localhost:3001/assets/${course.picturePath}`} alt="avatar" />
            </div>
            {/* Info */}
            <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
              <h6 className="mb-1">{course.title}<i className="bi bi-patch-check-fill text-info small ms-1" /></h6>
              <ul className="list-inline mb-0 small">
                {/* Add more course information as needed */}
              </ul>
            </div>
          </div>
          {/* Button */}
          
        </div>
        </div>
      ))}
      {/* End of Instructor items */}
      <hr />{/* Divider */}
    </div>
    {/* Card body END */}
  </div>

  
</div>
{/* Top instructors END */}







                                {/* Main content END */}
                            </div>{/* Row END */}

                        </div>{/* Row END */}

                        
                    </div>
                    
                </section>
                {/* =======================
Page content END */}




                <Footer />

            </main>
            {/* **************** MAIN CONTENT END **************** */}

        </div>
    )
}

export default Index




