import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { BASE_URL } from "api/axios";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";

function Index() {
  const [inscriptions, setInscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortStatus, setSortStatus] = useState(""); // Sorting status: 'accepted', 'refused', 'pending', or ''
  const entriesPerPage = 10;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refresh token
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      setOpen(true);

      try {
        const response = await axiosPrivate.get("/inscription/all");
        if (response.status === 200) {
          setInscriptions(response.data.data);
          setOpen(false);

        } else {
          throw new Error("Failed to fetch inscriptions");
        }
      } catch (error) {
        console.error("Error fetching inscriptions:", error);
        // Handle error
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/inscription/delete/${id}`);

      if (response.status === 200) {
        toast.success("Inscription deleted successfully !!", {
          autoClose: 1500,
          style: {
            color: "green",
          },
        });
        setInscriptions((prevInscriptions) =>
          prevInscriptions.filter((inscription) => inscription._id !== id)
        );
      } else {
        throw new Error("Failed to delete inscription");
      }
    } catch (error) {
      console.error("Error deleting inscription:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (e) => {
    setSortStatus(e.target.value);
  };

  // Filter inscriptions based on search query
  const filteredInscriptions = inscriptions.filter((inscription) =>
    Object.values(inscription).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sorting
  let sortedInscriptions = [...filteredInscriptions];
  if (sortStatus) {
    sortedInscriptions = sortedInscriptions.filter(
      (inscription) => inscription.status === sortStatus
    );
  }

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedInscriptions.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Main content */}
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
            <div>
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
          <div className="page-content-wrapper border">
            <ToastContainer />
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Inscriptions</h1>
              </div>
            </div>

            

            {/* Render text if inscriptions array is empty */}
            {inscriptions.length === 0 && <h2>No inscriptions available.</h2>}

            {/* Card START */}
            {inscriptions.length !== 0 && (
              <div className="card bg-transparent border">
                <div className="card-header bg-light border-bottom">
                  <div className="row g-3 align-items-center justify-content-between">
                    {/* Search bar */}
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-body"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          onChange={handleSearchChange}
                        />
                        {searchQuery === "" && ( // Check if the search query is empty
      <button
        className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
        type="submit"
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
                          className="form-select border-0 z-index-9"
                          aria-label=".form-select-sm"
                          onChange={handleSort}
                        >
                          <option value="">Sort by Status</option>
                          <option value="accepted">Accepted</option>
                          <option value="refused">Refused</option>
                          <option value="pending">Pending</option>
                        </select>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive border-0 rounded-3">
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                      <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            Full Name
                          </th>
                          <th scope="col" className="border-0">
                            Email
                          </th>
                          <th scope="col" className="border-0">
                            Parent name
                          </th>
                          <th scope="col" className="border-0">
                            Phone number N°1
                          </th>
                          <th scope="col" className="border-0">
                            Status
                          </th>
                          <th scope="col" className="border-0 rounded-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ whiteSpace: "nowrap" }}>
                        {/* Table row */}
                        {currentEntries.map((inscription) => (
                          <tr key={inscription._id}>
                            <td>
                              {inscription.firstName} {inscription.lastName}
                            </td>
                            <td>{inscription.email}</td>
                            <td>{inscription.parentName}</td>
                            <td>{inscription.phoneNumber1}</td>
                            <td>
                              {inscription.status === "pending" && (
                                <span className="badge bg-warning bg-opacity-15 text-warning">
                                  Pending
                                </span>
                              )}
                              {inscription.status === "accepted" && (
                                <span className="badge bg-success bg-opacity-15 text-success">
                                  Accepted
                                </span>
                              )}
                              {inscription.status === "refused" && (
                                <span className="badge bg-danger bg-opacity-15 text-danger">
                                  Refused
                                </span>
                              )}
                            </td>
                            <td>
                              <Link
                                to={`/inscriptionDetails/${inscription._id}`}
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
                                onClick={() => handleDelete(inscription._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-transparent pt-0">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstEntry + 1} to{" "}
                      {Math.min(
                        indexOfLastEntry,
                        sortedInscriptions.length
                      )}{" "}
                      of {sortedInscriptions.length} entries
                    </p>
                    <nav
                      className="d-flex justify-content-center mb-0"
                      aria-label="navigation"
                    >
                      <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                        <li className="page-item mb-0">
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-angle-left" />
                          </button>
                        </li>
                        {Array.from(
                          {
                            length: Math.ceil(
                              sortedInscriptions.length / entriesPerPage
                            ),
                          },
                          (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                index + 1 === currentPage ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li
                          className={`page-item ${
                            currentPage ===
                            Math.ceil(
                              sortedInscriptions.length / entriesPerPage
                            )
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(
                                sortedInscriptions.length / entriesPerPage
                              )
                            }
                          >
                            <i className="fas fa-angle-right" />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          )}
           </div>
    
      </main>
     

    </div>
  );
}

export default Index;