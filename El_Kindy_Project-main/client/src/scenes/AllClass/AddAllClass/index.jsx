import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, {useState} from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Index() {

//const dispatch = useDispatch();
const navigate = useNavigate();
const handleFormSubmit = async (values, onSubmitProps) => {
  values.preventDefault();
  const formData = new FormData(values.target);
  const formValues = Object.fromEntries(formData.entries());

  try {
    const savedClassesResponse = await fetch(
      "http://localhost:3001/classes/create",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues), // Convert form data to JSON
      }
    );

    const savedClasses = await savedClassesResponse.json();

    if (savedClasses) {
      console.log('Class added!', savedClasses);
      toast.success("Class added successfully !!", {
        autoClose: 1500,
        style: {
          color: 'green',
        },
      });
      setTimeout(() => {
        navigate('/ListAllClasse');
      }, 2000);
    } else {
      toast.error("Failed to add class", {
        autoClose: 5000,
        style: {
          color: 'red',
        },
      });
    }
  } catch (error) {
    console.error("Error adding class:", error);
    toast.error("Error adding class", {
      autoClose: 5000,
      style: {
        color: 'red',
      },
    });
  }
};
const [orderError, setOrderError] = useState('');

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setOrderError(value ? '' : 'Order is required.');
  };

  return (
    <div>
      <SideBar />
      <main>
       {/* Page content START */}
       <div className="page-content">
       <TopBarBack />
          <ToastContainer />
          {/* Page main content START */}
          <div className="page-content-wrapper border">

              {/* =======================
              Page Banner START */}
                <BannerStart 
                  title= "Submit a new Class"
                  description= "Read our Before you create a class article before submitting!"
                />
              {/* =======================
              Page Banner END */}
              <div className="card bg-transparent border rounded-3 mt-4">
                      {/* Card header */}
                <div className="card-header bg-light border-bottom px-lg-3">
                  {/* Step Buttons START */}
                    {/* Step 1 */}
                      <div className="">
                      <h2 className="p-2 " style={{color:"#1d3b53"}}>Class details</h2>
                      </div>
              </div>

            <form onSubmit={handleFormSubmit}>
              {/* Step 1 content START */}
              <div className="m-4">
                {/* Title */}
                
                {/* Basic information START */}
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Class Name</label>
                    <input className="form-control" name="className" type="text" placeholder="Enter name " />
                  </div>
                  {/* Short description */}
                  <div className="col-12">
                    <label className="form-label">Capacity</label>
                    <input className="form-control" name="capacity" type="number" placeholder="Enter capacity " />
                  </div>
                  <div className="col-12">
                      <label className="form-label">Order</label>
                      <input
                        className="form-control"
                        name="ordre"
                        type="number"
                        placeholder="Enter Order "
                        onChange={handleOrderChange}
                      />
                      {orderError && <p style={{ color: 'red' }}>{orderError}</p>}
                    </div>
                  {/* Upload image START */}
               
                  
                  
                  
                </div>
                

                {/* Step 4 button */}
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <div className="text-md-end">
                    <button href="course-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a Class</button>
                    <p className="mb-0 small mt-1">Once you click "Submit a category", your category will be uploaded and marked as pending for review.</p>
                  </div>
                </div>

              </div>
              
            </form>
            </div>


          </div>
        </div>
      </main>
    </div>
  )
}

export default Index