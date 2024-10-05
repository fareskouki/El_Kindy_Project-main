import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import BannerStart from "components/BannerStart"; // If you have this component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ClassesForm() {
  const [formState, setFormState] = useState({
    className: "",
    capacity: "",
    ordre: "",
  });
 
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/classes/${id}`
        );
        setFormState({
            className: response.data.className,
          capacity: response.data.capacity,
          ordre: response.data.ordre,

        });
        // Assuming response.data has a imagePath attribute
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        setMessage("Failed to load class data.");
      }
    };

    if (id) fetchClasseData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await axios.put(`http://localhost:3001/classes/${id}`, formState, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Class edited successfully !!", {
        autoClose: 1500,
        style: {
          color: "green",
        },
      });
  
      setTimeout(() => {
        navigate('/ListAllClasse');
      }, 2000);
    } catch (error) {
      console.error("Failed to update class:", error);
      setMessage("Failed to update Class. Please try again.");
    }
  };
  
  

  return (
    <main>
      <SideBar />
      <div className="page-content">
        <TopBarBack />
        <ToastContainer />
        <div className="page-content-wrapper border">

        {/* Add your banner component if you have one */}
        <BannerStart
          title="Update Class"
          description="Make changes to your class details below."
        />
        <div className="container mt-4">
          <h2>Update Class</h2>
          {message && (
            <div
              className={`alert ${
                message.startsWith("Failed") ? "alert-danger" : "alert-success"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Category Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name Class
              </label>
              <input
                type="text"
                className="form-control"
                id="classNamee"
                name="className"
                required
                value={formState.className}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="capacity" className="form-label">
                Capacity
              </label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                name="capacity"
                required
                value={formState.capacity}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ordre" className="form-label">
                Order
              </label>
              <input
                type="number"
                className="form-control"
                id="ordre"
                name="ordre"
                required
                value={formState.ordre}
                onChange={handleChange}
              />
            </div>
            
           
            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Update Class
            </button>
          </form>
        </div>
      </div>
      </div>

    </main>
  );
}

export default ClassesForm;
