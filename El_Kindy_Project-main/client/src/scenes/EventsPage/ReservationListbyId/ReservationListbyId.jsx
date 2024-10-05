import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SideBar from "components/SideBar"; // Adjust import paths as needed
import TopBarBack from "components/TopBarBack"; // Adjust import paths as needed

const MySwal = withReactContent(Swal);

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function Index() {
  const { eventId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchReservations();
    } else {
      console.log("Event ID not provided");
    }
  }, [eventId]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/events/reservation/${eventId}`);
      setReservations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      MySwal.fire("Error!", "Failed to fetch reservations.", "error");
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      await axios.patch(`http://localhost:3001/events/reservations/${reservationId}`, { status });
      MySwal.fire("Success", `Reservation has been ${status}`, "success");
      fetchReservations();
    } catch (error) {
      console.error(`Error updating reservation status to ${status}:`, error);
      MySwal.fire("Error!", `Failed to update the reservation status to ${status}.`, "error");
    }
  };

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, 300);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.eventId?.title.toLowerCase().includes(searchTerm) ||
      reservation.userName.toLowerCase().includes(searchTerm) ||
      reservation.userEmail.toLowerCase().includes(searchTerm) ||
      reservation.phoneNumber.toString().includes(searchTerm) ||
      reservation.status.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <SideBar />
      <div className="page-content">
        <TopBarBack />
        <div className="page-content-wrapper border">
          <div className="row mb-3">
            <div className="col-12 d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-2 mb-sm-0">List Reservations</h1>
              <Link to="/listEventUser" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Add a Reservation</Link>
            </div>
          </div>

          <div className="card bg-transparent border">
            <div className="card-header bg-light border-bottom">
              <div className="row g-3 align-items-center justify-content-between">
                <div className="col-md-8">
                  <input
                    className="form-control bg-body"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select border-0 z-index-9"
                    aria-label=".form-select-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="">Sort by</option>
                    <option value="asc">Ascendant</option>
                    <option value="desc">Descendant</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive border-0 rounded-3">
                <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="border-0">Event Title</th>
                      <th scope="col" className="border-0">User Name</th>
                      <th scope="col" className="border-0">User Email</th>
                      <th scope="col" className="border-0">Phone Number</th>
                      <th scope="col" className="border-0">Number of Reservations</th>
                      <th scope="col" className="border-0">Status</th>
                      <th scope="col" className="border-0 rounded-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>{reservation.eventId?.title || "Event not found"}</td>
                        <td>{reservation.userName}</td>
                        <td>{reservation.userEmail}</td>
                        <td>{reservation.phoneNumber}</td>
                        <td>{reservation.numberOfReservations}</td>
                        <td>
                            {reservation.status === "pending" && (
                              <span className="badge bg-warning bg-opacity-15 text-warning">
                                Pending
                              </span>
                            )}
                            {reservation.status === "accepted" && (
                              <span className="badge bg-success bg-opacity-15 text-success">
                                Accepted
                              </span>
                            )}
                            {reservation.status === "refused" && (
                              <span className="badge bg-danger bg-opacity-15 text-danger">
                                Refused
                              </span>
                            )}
                          </td>
                        <td>
                          <button onClick={() => updateReservationStatus(reservation._id, "accepted")} className="btn btn-sm btn-success me-1">Accept</button>
                          <button onClick={() => updateReservationStatus(reservation._id, "refused")} className="btn btn-sm btn-danger">Refuse</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
