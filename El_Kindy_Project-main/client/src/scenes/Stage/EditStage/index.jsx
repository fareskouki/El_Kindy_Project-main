import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setLogout } from "../../../state";
import refreshToken from "scenes/Authentification/TokenService/tokenService";
import useAxiosPrivate from "hooks/useAxiosPrivate";

function EditStage() {

  const [dataTheme, setDataTheme] = useState('');
  const [stage, setStage] = useState({
    title: "",
    description: "",
    picturePath: "",
    startDate: "",
    finishDate: "",
    place: "",
    price: ""
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [errors, setErrors] = useState({});
  const [formModified, setFormModified] = useState(false); // State variable to track form modification
  //const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(`/stage/stage/${id}`);
        console.log("response:", response);
        if (response.status === 200) {
          const data = await response.data;
          console.log("data:", data);
          setStage(data);
        } else {
          throw new Error("Failed to fetch stage data");
        }
      } catch (error) {
        console.error("Error fetching stage data:", error);
      }
    };

    fetchData();
  }, [axiosPrivate, id]);


  // State to hold the image name
  const [imageName, setImageName] = useState(null);
  // State to hold the image file
  const [imageFile, setImageFile] = useState(null);

  // Function to handle selecting an image
  const handleImageSelect = (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];
    // Set the image name
    setImageName(selectedFile.name);
    // Set the image file
    setImageFile(selectedFile);

    // Remove red border when an image is selected
    event.target.parentElement.classList.remove("border-danger");

    // Check if a picture is selected and update the error status
    if (!selectedFile) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "",
      }));
    }
    setFormModified(true); // Set form as modified when image is selected

  };
  // Function to handle removing the image
  // Function to handle removing the image
  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById("image").value = "";

    if (stage.picturePath === "") {
      // Update the error status for the picture field
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));

      // Add red border if no image is selected after removal
      document
        .getElementById("image")
        .parentElement.classList.add("border-danger");
    }
    setFormModified(false); // Set form as modified when image is selected

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage({ ...stage, [name]: value });
    validateField(name, value);
    setFormModified(true); // Set form as modified when any field is changed

  };
 
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        error = value.trim() === '' ? 'Please enter a stage title!' : '';
        break;
      case 'description':
        error = value.trim() === '' ? 'Please enter a stage description!' : '';
        break;
      case 'picture':
        error = value === null ? 'Please upload an image!' : '';
        break;
      case 'startDate':
        error = value === '' ? 'Please select a stage startDate!' : '';
        break;
      case 'finishDate':
        error = value === '' ? 'Please select a stage finishDate!' : '';
        break;
      case 'place':
        error = value === '' ? 'Please select a stage place!' : '';
        break;
        case 'price':
  // Validate price only if a value is provided
  if (value.trim() !== '') {
    error = /^\d+$/.test(value) ? '' : 'Please enter a valid price!';
  }        
  break;

      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData object from form
    const formData = new FormData(event.target);
    // Convert FormData to plain object
    const formValues = Object.fromEntries(formData.entries());

    // Validate fields
    for (let [key, value] of Object.entries(formData)) {
      validateField(key, value);
    }

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      console.log("aefbaefoaefni");
      return;
    } else {
      try {
        // Check if any form data has changed
        const formDataChanged = Object.keys(formValues).some((key) => {
          return formValues[key] !== formData[key];
        });

        if (formDataChanged) {
          if (imageFile) {
            //console.log("changed");
            const formDataToSend = new FormData();
            for (let value in formValues) {
              formDataToSend.append(value, formValues[value]);
            }
            formDataToSend.append("picturePath", formValues.picture.name);

            //console.log("formDataToSend : ", formDataToSend);

            // If form data has changed, send the updated data
            const response = await axiosPrivate.patch(
              `/api/stage/${id}`,
              formDataToSend,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response.status === 200) {
              toast.success("stage updated successfully !!", {
                autoClose: 1500,
                style: {
                  color: "green",
                },
              });
              setTimeout(() => {
                navigate("/liststage");
              }, 2000);
            } else {
              console.log("cant update!!!");
            }
          } else {
            //console.log("not changed");
            //console.log("formData : ", formData);

            // If form data has changed, send the updated data
            const response = await axiosPrivate.patch(
              `/api/stage/${id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response.status === 200) {
              toast.success("Stage updated successfully !!", {
                autoClose: 1500,
                style: {
                  color: "green",
                },
              });
              setTimeout(() => {
                navigate("/listStage");
              }, 2000);
            } else {
              console.log("cant update!!!");
            }
          }
        } else {
          // If no changes were made, simply navigate away
          navigate("/listStage");
        }
      } catch (error) {
        console.error("Failed to update Stage:", error);
      }
    }
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
              title="Update stage"
              description="Read our Before you create a stage article before submitting!"
            />
            {/* =======================
              Page Banner END */}
            <div class="card bg-transparent border rounded-3 mt-4">
              {/* Card header */}
              <div className="card-header bg-light border-bottom px-lg-3">
                {/* Step Buttons START */}
                {/* Step 1 */}
                <div className="">
                  <h2 className="p-2" style={{ color: dataTheme === 'dark' ? '#2B6DA2' : '#1d3b53' }}>stage details</h2>
                </div>
              </div>
              <div>

              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1 content START */}
                <div className="m-4">
                  {/* Title */}

                  {/* Basic information START */}
                  <div className="row g-4">
                    {/* stage title */}
                    <div className="col-12">
                      <label className="form-label">Internship title</label>
                      <input
                        className={`form-control ${errors.title ? "is-invalid" : ""
                          }`}
                        onChange={handleChange}
                        value={stage.title}
                        name="title"
                        type="text"
                        placeholder="Enter course title"
                        
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                    {/* Short description */}
                    <div className="col-12">
                      <label className="form-label">Short description</label>
                      <textarea
                        className={`form-control ${errors.description ? "is-invalid" : ""
                          }`}
                        id="description"
                        name="description"
                        rows="3"
                        value={stage.description}
                        onChange={handleChange}
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    {/* Upload image START */}
                    <div className="m-4">
                      {/* Image */}
                      <div className="col-12">
                        <div
                          className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${errors.picture ? "border-danger" : ""
                            }`}
                        >
                          {/* Display the image */}
                          {imageFile ? (
                            <div>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded image"
                                className="img-fluid mb-2"
                                style={{
                                  maxWidth: "300px",
                                  maxHeight: "300px",
                                }} // Limit image dimensions
                                required
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          ) : (
                            <div>
                              <img
                                src={`http://localhost:3001/assets/${stage.picturePath}`}
                                alt="Uploaded image"
                                className="img-fluid mb-2"
                                style={{
                                  maxWidth: "300px",
                                  maxHeight: "300px",
                                }} // Limit image dimensions
                                required
                              />
                              <p className="mb-0">{stage.picturePath}</p>
                            </div>
                          )}
                          {/* Upload image button */}
                          <div className="mb-3">
                            <h6 className="my-2">
                              Upload Internship image here, or{" "}
                              <span
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                              >
                                Browse
                              </span>
                            </h6>
                            {/* File input */}
                            <input
                              className="form-control"
                              type="file"
                              name="picture"
                              id="image"
                              accept="image/gif, image/jpeg, image/png"
                              onChange={handleImageSelect}
                            />
                            {/* Note */}
                            <p className="small mb-0 mt-2">
                              <b>Note:</b> Only JPG, JPEG, and PNG formats are
                              supported. Our suggested dimensions are 600px *
                              450px. Larger images will be cropped to fit our
                              thumbnails/previews.
                            </p>
                          </div>
                          {/* Remove image button */}
                          {imageName && (
                            <div className="d-sm-flex justify-content-end mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger-soft mb-3"
                                onClick={handleRemoveImage}
                              >
                                Remove image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Upload image END */}

                    {/* stage time */}
                   {/* stage time */}
<div className="col-md-6">
  <label className="form-label">stage start Date</label>
  <input
    className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
    type="date"
    name="startDate"
    value={stage.startDate}
    onChange={handleChange}
    />
    {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
   </div>

{/* stage price */}
<div className="col-md-6">
  <label className="form-label">stage finish Date</label>
  <input
    className={`form-control ${errors.finishDate ? "is-invalid" : ""}`}
    type="date"
    name="finishDate"
    value={stage.finishDate}
    onChange={(e) => setStage({ ...stage, finishDate: e.target.value })}
  />
      {errors.finishDate && <div className="invalid-feedback">{errors.finishDate}</div>}

</div>

{/* stage place */}
<div className="col-md-6">
  <label className="form-label">stage spots</label>
  <input
    className={`form-control ${errors.place ? "is-invalid" : ""}`}
    type="number"
    name="place"
    value={stage.place}
    onChange={(e) => setStage({ ...stage, place: e.target.value })}
  />
        {errors.place && <div className="invalid-feedback">{errors.place}</div>}

</div>

{/* stage price */}
<div className="col-md-6">
  <label className="form-label">stage price</label>
  <input
    className="form-control"
    type="number"
    name="price"
    value={stage.price}
    onChange={(e) => setStage({ ...stage, price: e.target.value })}
  />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}

</div>


                  </div>


                  {/* Step 4 button */}
                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button
                        disabled={!formModified} // Disable button if form is not modified
                        className="btn btn-success mb-2 mb-sm-0"
                        type="submit"
                      >
                        Update an Internship
                      </button>
                      <p className="mb-0 small mt-1">
                        Once you click "Update an Internship", your internship will be
                        updated .
                      </p>
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

export default EditStage