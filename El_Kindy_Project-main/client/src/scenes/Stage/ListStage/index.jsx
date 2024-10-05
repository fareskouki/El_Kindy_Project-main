import SideBar from 'components/SideBar';
import TopBarBack from 'components/TopBarBack';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { Backdrop } from '@mui/material';
import { GridLoader } from 'react-spinners';

function Index() {
  const axiosPrivate = useAxiosPrivate();
  const [stages, setStages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [totalEntries, setTotalEntries] = useState(0);
  const entriesPerPage = 8;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page

  useEffect(() => {
    const fetchStages = async () => {
      setOpen(true);

      try {
        const response = await axiosPrivate.get('/stage');
        setOpen(false);

        setStages(response.data.stages);
        setTotalEntries(response.data.total);

      } catch (error) {
        console.error('Error fetching stages:', error);
      }
    };

    fetchStages();
  }, [axiosPrivate]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/stage/${id}`);
      setStages(prevStages => prevStages.filter(stage => stage._id !== id));
    } catch (error) {
      console.error('Error deleting stage:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStages = stages.filter((stage) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      stage.title.toLowerCase().includes(lowerCaseQuery) ||
      stage.description.toLowerCase().includes(lowerCaseQuery) ||
      // Add additional fields for searching
      stage.startDate.toLowerCase().includes(lowerCaseQuery) ||
      stage.finishDate.toLowerCase().includes(lowerCaseQuery)||
      stage.place.toLowerCase().includes(lowerCaseQuery) ||
      stage.price.toLowerCase().includes(lowerCaseQuery) // Add additional fields for searching
    );
  });

  const sortedStages = filteredStages.sort((a, b) => {
    switch (sortOption) {
      case 'Newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      // Add other sorting options if needed
      default:
        return 0;
    }
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

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
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
          <div className="page-content-wrapper border">
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Internships</h1>
                <Link to="/addStage" className="btn btn-sm btn-primary mb-0">Create an Internship</Link>
              </div>
            </div>
            <div className="card bg-transparent border">
              <div className="card-header bg-light border-bottom">
                <div className="row g-3 align-items-center justify-content-between">
                  <div className="col-md-8">
                    <form className="rounded position-relative">
                    <input
                        className="form-control bg-body"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                  <div className="col-md-3">
                    <form>
                      <select
                        className="form-select border-0 z-index-9"
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">Sort by</option>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        {/* Add other sorting options */}
                      </select>
                    </form>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive border-0 rounded-3">
                  <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0 rounded-start">Internship Title</th>
                        <th scope="col" className="border-0">Picture</th>

                        <th scope="col" className="border-0">startDate</th>
                        <th scope="col" className="border-0">finishDate</th>
                        <th scope="col" className="border-0">Places</th>
                        <th scope="col" className="border-0">Price</th>
                        <th scope="col" className="border-0">description</th>
                        <th scope="col" className="border-0 rounded-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredStages
                        .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                        .map((stage, index) => (
                        <tr key={index}>
<td>
                              {stage.stageId && (
                                <div>
                                  <p>{stage.stageId.title}</p>

                                </div>
                              )}                          <td>{stage.title}</td>
                          </td>
                          <td>
                            {stage.picturePath ? (
                              <img
                                src={`http://localhost:3001/assets/${stage.picturePath}`}
                                alt="Stage"
                                style={{ width: "100px", height: "80px", borderRadius: "15%" }} // Adjust size and border radius as needed
                                />
                            ) : (
                              <span>No Image</span>
                            )}
                          </td>
                          <td>{stage.startDate}</td>
                          <td>{stage.finishDate}</td>
                        
                          <td>{stage.place}</td>
                          <td>{stage.price ? `${stage.price} TND` : "Free"}</td>
                          <td>{stage.description.length > 50 ? `${stage.description.substring(0, 50)}...` : stage.description}</td>

                          <td>
                            <Link to={`/EditStage/${stage._id}`} className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0">
                              <i className="bi bi-pencil-square" />
                            </Link>
                            <button onClick={() => handleDelete(stage._id)} className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0">
                              <i className="bi bi-trash" />
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
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                  </p>
                  <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                    <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} tabIndex={-1}>
                          <i className="fas fa-angle-left" />
                        </button>
                      </li>
                      {Array.from({ length: Math.ceil(totalEntries / entriesPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${indexOfLastEntry >= totalEntries ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                          <i className="fas fa-angle-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
               
              {/* Page main content END */}
            </>
          )}
     </div>
             
          
      </main>
    </div>
  );
}

export default Index;