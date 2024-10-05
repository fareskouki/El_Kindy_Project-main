import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Assurez-vous d'importer Link depuis react-router-dom
import "react-confirm-alert/src/react-confirm-alert.css"; // Importez les styles CSS
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { ToastContainer, toast } from "react-toastify";

function Index() {
  const [shop, setShop] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/shops", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setShop(data);
      } else {
        const errorMessage = await response.text();
        //dispatch(setLogout()); // Log out user if token refresh fails
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/shops/${id}`, {
        method: "DELETE",
      });

      toast.success("Instrument deleted successfully !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
      setShop((prevStages) =>
        prevStages.filter((shop) => shop._id !== id)
      ); // Assuming `_id` is the unique identifier
    } catch (error) {
      console.error("Error deleting stage:", error);
    }
  };

  const handleSold = async (id) => {
    try {
      // Update the shop status to "sold" here
      await fetch(`http://localhost:3001/shops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etat: "sold" }), // Update etat to "sold"
      });
  
      // Refetch data to update the shop state
      fetchData();
  
      toast.success("Instrument marked as sold !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
    } catch (error) {
      console.error("Error marking instrument as sold:", error);
    }
  };
  
  const handleUnsold = async (id) => {
    try {
      // Update the shop status to "unsold" here
      await fetch(`http://localhost:3001/shops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etat: "unsold" }), // Update etat to "unsold"
      });
  
      // Refetch data to update the shop state
      fetchData();
  
      toast.success("Instrument marked as unsold !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
    } catch (error) {
      console.error("Error marking instrument as unsold:", error);
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
            <ToastContainer />
            {/* Title */}
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Instruments</h1>
              </div>
            </div>

            {/* Render text if courses array is empty */}
            {/* Card START */}
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
                        aria-label="Search"
                      />
                    </form>
                  </div>
                  {/* Select option */}
                  <div className="col-md-3">
                    {/* Short by filter */}
                    <form>
                      <select
                        className="form-select  border-0 z-index-9"
                        aria-label=".form-select-sm"
                      >
                        <option value>Sort by</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
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
                    <thead style={{ whiteSpace: "nowrap" }}>
                      <tr>
                        <th scope="col" className="border-0 rounded-start">
                          Instrument Name
                        </th>
                        <th scope="col" className="border-0">
                          Brand
                        </th>
                        <th scope="col" className="border-0">
                          Price
                        </th>
                        <th scope="col" className="border-0">
                          Status
                        </th>
                        <th scope="col" className="border-0">
                          etat
                        </th>
                        <th scope="col" className="border-0 rounded-end">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {/* Table body START */}
                    <tbody style={{ whiteSpace: "nowrap" }}>
                      {/* Table row */}
                      {shop && shop.length > 0 ? (
  shop.map((item) => (
    <tr key={item._id}>
      <td>{item.name}</td>
      <td>{item.marque}</td>
      <td>{item.price}</td>
      <td>
        {item.status === "pending" && (
          <span className="badge bg-warning bg-opacity-15 text-warning">
            Pending
          </span>
        )}
        {item.status === "accepted" && (
          <span className="badge bg-success bg-opacity-15 text-success">
            Accepted
          </span>
        )}
        {item.status === "refused" && (
          <span className="badge bg-danger bg-opacity-15 text-danger">
            Refused
          </span>
        )}
      </td>
      <td>
        {item.etat === "unsold" && (
          <span className="badge bg-info bg-opacity-15 text-info">
            Unsold
          </span>
        )}
        {item.etat === "sold" && (
          <span className="badge bg-danger bg-opacity-15 text-danger">
            Sold
          </span>
        )}
      </td>
      <td>
        <Link
          to={`/BackDetailsShop/${item._id}`}
          className="btn btn-info-soft btn-round mb-1 me-1 mb-md-0"
        >
          <i className="bi bi-eye"></i>
        </Link>
        <button
          className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title=""
          data-bs-original-title="Delete"
          onClick={() => handleDelete(item._id)}
        >
          <i className="bi bi-trash"></i>
        </button>
        {item.etat === "unsold" && (
          <button
            className="btn btn-primary-soft btn-round mb-1 me-1 mb-md-0"
            onClick={() => handleSold(item._id)}
          >
             Sold
          </button>
        )}
        {item.etat === "sold" && (
          <button
            className="btn btn-primary-soft btn-round mb-1 me-1 mb-md-0"
            onClick={() => handleUnsold(item._id)}
          >
            Unso
          </button>
        )}
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5">No data available</td>
  </tr>
)}

                    </tbody>
                    {/* Table body END */}
                  </table>
                  {/* Table END */}
                </div>
                {/* Course table END */}
              </div>
              {/* Card body END */}
              {/* Card ffooter START */}
              <div className="card-footer bg-transparent pt-0">
                {/* Pagination START */}
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                  {/* Content */}

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
            {/* Card END */}
          </div>
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;
