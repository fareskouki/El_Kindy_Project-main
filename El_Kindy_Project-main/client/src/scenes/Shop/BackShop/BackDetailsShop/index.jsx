import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShop } from "services/shopService/api";
import axios from "axios";


function Index() {
  const { id } = useParams();
  const [shop, setShop] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const shop = await getShop(id);
        console.log("shop", shop.data);
        setShop(shop.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const approveShop = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/shops/${id}/approve`
      );
      navigate("/BackListShop");
    } catch (error) {
      console.error(error);
    }
  };

  const rejectShop = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/shops/${id}/reject`
      );
      navigate("/BackListShop");
    } catch (error) {
      console.error(error);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleString('en-US', options);
    return formattedDate;
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
                <h1 className="h3 mb-2 mb-sm-0">Instrument detail</h1>
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
                    <div className="card mb-3">
                    {shop.picturePath ? (
                      <img className="card-img border border-white border-1 shadow"
                        alt=""
                        src={`http://localhost:3001/assets/${shop.picturePath}`}
                        style={{
                          width: '300px', // Taille agrandie de l'image
                          height: '300px'
                        }}
                        />

                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    {/* Information START */}
                    <div className="row">
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Full Name:</span>
                            <span className="h6 mb-0">
                              {shop.fullName}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Email :</span>
                            <span className="h6 mb-0">{shop.email}</span>
                          </li>
                          <li className="list-group-item">
                            <span>Instrument Name:</span>
                            <span className="h6 mb-0">
                              {shop.name}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Brand: </span>
                            <span className="h6 mb-0">
                              {shop.marque}
                            </span>
                          </li>
                         
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Price:</span>
                            <span className="h6 mb-0">
                              {shop.price} dt
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Discount:</span>
                            <span className="h6 mb-0">
                              {shop.remise} %
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Mobile Number :</span>
                            <span className="h6 mb-0">
                              +216 {shop.phoneNumber}
                            </span>
                          </li>
                          
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>createdAt:</span>
                            <span className="h6 mb-0">
                            {formatDate(shop.createdAt)}
                            </span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item d-flex">
                            <span>Description:</span>
                            <p className="h6 mb-0">
                              {shop.description}
                            </p>
                          </li>
                        </ul>
                      </div>
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
                          style={{ width: "120px" }}
                          onClick={() => approveShop(shop._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger-soft"
                          style={{ width: "120px" }}
                          onClick={() => rejectShop(shop._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    {/* Information END */}
                  </div>
                  {/* Card body END */}
                </div>
              </div>
              {/* Personal information END */}
              {/* Student status chart START */}

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
