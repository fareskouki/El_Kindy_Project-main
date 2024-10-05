import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInscription } from "services/inscriptionService/api";
import axios from "axios";
import useAxiosPrivate from "hooks/useAxiosPrivate";

function Index() {
  const { id } = useParams();
  const [inscription, setInscription] = useState("");
  const [disponibilite, setDisponibilite] = useState([]);
  const navigate = useNavigate();
  //refresh token
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inscription = await getInscription(id, axiosPrivate);
        console.log("inscription", inscription.data);
        setInscription(inscription.data);
        setDisponibilite(inscription.data.disponibilite);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const approveInscription = async (id) => {
    try {
      const response = await axiosPrivate.patch(
        `/inscription/${id}/approvepayment`
      );
      if (response.status === 200) {
        navigate("/inscriptionsList");
      }else {
        // Handle other response statuses here
        const errorMessage = response.data.message; 
        alert(errorMessage); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const activateuser = async (id) => {
    try {
      const response = await axiosPrivate.patch(
        `/inscription/${id}/approve`
      );
      if (response.status === 200) {
        navigate("/inscriptionsList");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectInscription = async (id) => {
    try {
      const response = await axiosPrivate.patch(
        `/inscription/${id}/reject`
      );
      if (response.status === 200) {
        navigate("/inscriptionsList");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <SideBar />
        {/* Page content START */}
        <div className="page-content">
          <TopBarBack />

          {/* Page main content START */}
          <div className="page-content-wrapper border">
            {/* Title */}
            <div className="row">
              <div className="col-12 mb-3">
                <h1 className="h3 mb-2 mb-sm-0">Instructor detail</h1>
              </div>
            </div>
            <div className="row g-4">
              {/* Personal information START */}
              <div className="col-xxl-7">
                <div className="card bg-transparent border rounded-3 h-100">
                  {/* Card header */}
                  <div className="card-header bg-light border-bottom">
                    <h5 className="card-header-title mb-0">
                      Personal Information
                    </h5>
                  </div>
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Profile picture */}
                    <div className="avatar avatar-xl mb-3">
                      <img
                        className="avatar-img rounded-circle border border-white border-3 shadow"
                        src="/assets/images/element/01.jpg"
                        alt
                      />
                    </div>
                    {/* Information START */}
                    <div className="row">
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Full Name:</span>
                            <span className="h6 mb-0">
                              {inscription.firstName} {inscription.lastName}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Email ID:</span>
                            <span className="h6 mb-0">{inscription.email}</span>
                          </li>
                          <li className="list-group-item">
                            <span>Gender</span>
                            <span className="h6 mb-0">
                              {inscription.gender}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Date of birth: </span>
                            <span className="h6 mb-0">
                              {inscription.dateOfBirth}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Location:</span>
                            <span className="h6 mb-0">{inscription.city}</span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Parent Name:</span>
                            <span className="h6 mb-0">
                              {inscription.parentName}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Parent profession:</span>
                            <span className="h6 mb-0">
                              {inscription.parentProfession}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Mobile Number N°1:</span>
                            <span className="h6 mb-0">
                              +256 {inscription.phoneNumber1}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Mobile Number N°2:</span>
                            <span className="h6 mb-0">
                              +256 {inscription.phoneNumber2}
                            </span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Education:</span>
                            <span className="h6 mb-0">
                              {inscription.niveauEtude}
                            </span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item d-flex">
                            <span>Message:</span>
                            <p className="h6 mb-0">
                              As it so contrasted oh estimating instrument. Size
                              like body someone had. Are conduct viewing boy
                              minutes warrant the expense Tolerably behavior may
                              admit daughters offending her ask own. Praise
                              effect wishes change way and any wanted. Lively
                              use looked latter regard had. Do he it part more
                              last in
                            </p>
                          </li>
                        </ul>
                      </div>
                      {inscription.status === "pending" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "30px",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="btn btn-sm btn-success-soft"
                            style={{ width: "130px" }}
                            onClick={() => approveInscription(inscription._id)}
                          >
                            Payment Request
                          </button>
                          <button
                            className="btn btn-sm btn-danger-soft"
                            style={{ width: "120px" }}
                            onClick={() => rejectInscription(inscription._id)}
                          >
                            Reject Request
                          </button>
                          <button
                            className="btn btn-sm btn-info-soft"
                            style={{ width: "120px" }}
                            onClick={() => activateuser(inscription._id)}
                          >
                            Activate user
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Information END */}
                  </div>
                  {/* Card body END */}
                </div>
              </div>
              {/* Personal information END */}
              {/* Student status chart START */}
              <div className="col-xxl-5">
                <div className="row g-4">
                  {/* Active student START */}
                  <div className="col-md-6 col-xxl-12">
                    <div className="card bg-transparent border overflow-hidden">
                      {/* Card header */}
                      <div className="card-header bg-light border-bottom">
                        <h5 className="card-header-title mb-0">
                          Liked courses
                        </h5>
                      </div>
                      {/* Card body */}
                      <div className="card-body p-0">
                        <div className="d-sm-flex justify-content-between p-4">
                          <ul>
                            {inscription?.likedCourses?.map((course) => (
                              <li key={course.id}>{course.title}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Active student END */}
                  {/* Enrolled START */}
                  <div className="col-md-6 col-xxl-12">
                    <div className="card bg-transparent border overflow-hidden">
                      {/* Card header */}
                      <div className="card-header bg-light border-bottom">
                        <h5 className="card-header-title mb-0">
                          Available time
                        </h5>
                      </div>
                      {/* Card body */}
                      <div className="card-body p-0">
                        <div className="d-sm-flex justify-content-between p-4">
                          <ul>
                            {/* Sort and arrange disponibilite to start with Monday */}
                            {[...disponibilite]
                              .sort((a, b) => {
                                // Sort by day first
                                const daysOrder = [
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                  "Sunday",
                                ];
                                const indexA = daysOrder.indexOf(a.day);
                                const indexB = daysOrder.indexOf(b.day);
                                if (indexA < indexB) return -1;
                                if (indexA > indexB) return 1;
                                // If days are the same, sort by start time
                                if (a.startTime < b.startTime) return -1;
                                if (a.startTime > b.startTime) return 1;
                                return 0;
                              })
                              .map((slot, index) => (
                                <li key={index}>
                                  <span>{slot.day} : </span>
                                  <span>{slot.startTime} --&gt; </span>
                                  <span>{slot.endTime}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Enrolled END */}
                </div>
              </div>
              {/* Student status chart END */}
            </div>{" "}
            {/* Row END */}
          </div>
          {/* Page main content END */}
        </div>
      </main>
    </div>
  );
}

export default Index;
