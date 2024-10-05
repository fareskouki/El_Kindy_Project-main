import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, {useEffect, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import { Link, useNavigate } from 'react-router-dom'



function Index() {

  const [dataTheme, setDataTheme] = useState('');

  useEffect(() => {
    // Retrieve the value of data-theme from localStorage
    const themeValue = localStorage.getItem('data-theme');
    setDataTheme(themeValue);
  }, []); // Empty dependency array ensures this effect runs only once

  

//const dispatch = useDispatch();
const navigate = useNavigate();

const addClasses = async (values, onSubmitProps) => {
  console.log("values", values);

  const savedClassesResponse = await fetch(
    "http://localhost:3001/salle",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }
  );

  const savedClasses = await savedClassesResponse.json();

  if (savedClasses.success) {
    console.log('Class added!');
    console.log("Salle", savedClasses);
    toast.success("Class added successfully !!", {
      autoClose: 1500,
      style: {
        color: 'green'
      }
    });

    setTimeout(() => {
      navigate('/listClasse');
    }, 2000);
  } else {
    toast.error(`Error: ${savedClasses.error}`, {
      autoClose: 5000,
      style: {
        color: 'red'
      }
    });
  }
};

const handleFormSubmit = async (values, onSubmitProps) => {
  values.preventDefault();
  const formData = new FormData(values.target);
  const formValues = Object.fromEntries(formData.entries());
  await addClasses(formValues, onSubmitProps);
};





  return (
    <div>
      <SideBar />
      <main>²
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
              <div class="card bg-transparent border rounded-3 mt-4">
                      {/* Card header */}
                <div className="card-header bg-light border-bottom px-lg-3">
                  {/* Step Buttons START */}
                    {/* Step 1 */}
                      <div className="">
                      <h2 className="p-2" style={{ color: dataTheme === 'dark' ? '#2B6DA2' : '#1d3b53' }}>Class details</h2>
                      </div>
              </div>
              <div>
        
      </div>

            <form onSubmit={handleFormSubmit}>
              {/* Step 1 content START */}
              <div className="m-4">
                {/* Title */}
                
                {/* Basic information START */}
                <div className="row g-4">
                  {/* Course title */}
                  <div className="col-12">
                    <label className="form-label">Name </label>
                    <input className="form-control" name="name" type="text" placeholder="Enter number class" required/>
                  </div>
                  <div className="col-12">
                    <label className="form-label">capacite</label>
                    <input className="form-control" name="capacity" type="text" placeholder="Enter capacity class" required/>
                  </div>

                  {/* Course category */}
                  <div className="col-md-6">
                    <label className="form-label">Class status</label>
                    <select name="status" className="form-select  border-0 z-index-9 bg-transparent" aria-label=".form-select-sm" data-search-enabled="true" required>
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  
                </div>
                

                {/* Step 4 button */}
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <div className="text-md-end">
                    <button href="classe-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a Class</button>
                    <p className="mb-0 small mt-1">Once you click "Submit a Class", your Class will be uploaded and marked as pending for review.</p>
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