import BannerStart from 'components/BannerStart';
import SideBar from 'components/SideBar';
import TopBarBack from 'components/TopBarBack';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "hooks/useAxiosPrivate";

function Index() {
  const [dataTheme, setDataTheme] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [imageName, setImageName] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    picture: null,
    startDate: '',
    finishDate: '',
    place: '',
    price: '',
  });
  const axiosPrivate = useAxiosPrivate();


  useEffect(() => {
    const themeValue = localStorage.getItem('data-theme');
    setDataTheme(themeValue);
  }, []);

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, picture: selectedFile });

    // Remove red border when an image is selec ted
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
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, picture: null });
    document.getElementById("image").value = "";

    // Update the error status for the picture field
    setErrors((prevErrors) => ({
      ...prevErrors,
      picture: "Please upload an image!",
    }));

    // Add red border if no image is selected after removal
    document.getElementById("image").parentElement.classList.add("border-danger");
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
          error = /^[0-9]+$/.test(value) ? '' : 'Please enter a valid price!';
        }
        break;

      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const addStage = async () => {
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    formDataToSend.append('picturePath', formData.picture.name);

    try {
      const response = await axiosPrivate.post("/api/stage", formDataToSend);
      const savedCourse = response.data;
      console.log("stage added!");
      console.log("stage", savedCourse);
      // Show the toast notification with autoClose: false
      toast.success("Stage added successfully !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
      setTimeout(() => {
        navigate("/listStage");
      }, 2000);
    } catch (error) {
      console.error("Error adding stage:", error);
      // Handle error
      toast.error("Failed to add stage. Please try again.");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {

    values.preventDefault();

    // Validate fields
    for (let [key, value] of Object.entries(formData)) {
      validateField(key, value);
    }

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    // Check if an image is selected
    if (!formData.picture) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));
      // Add red border if no image is selected
      document.getElementById("image").parentElement.classList.add("border-danger");
      return;
    }
    await addStage();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };


  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <ToastContainer />
          <div className="page-content-wrapper border">
            <BannerStart
              title="Submit a new Course"
              description="Read our Before you create a course article before submitting!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <div className="">
                  <h2 className="p-2" style={{ color: dataTheme === 'dark' ? '#2B6DA2' : '#1d3b53' }}>
                    Internship details
                  </h2>
                </div>
              </div>
              <div>
                <form onSubmit={handleFormSubmit}>
                  <div className="m-4">
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label">Course title {" "}
                          <span className="text-danger">*</span></label>
                        <input
                          className={`form-control ${errors.title ? "is-invalid" : ""
                            }`}
                          name="title"
                          type="text"
                          placeholder="Enter internship title"
                          value={formData.title}
                          onChange={handleChange}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title}</div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          name="description"
                          rows={2}
                          placeholder="Enter keywords"
                          value={formData.description}
                          onChange={handleChange}
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                      <div className="m-4">
                        <div className="col-12">
                          <div className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${errors.picture ? "border-danger" : ""}`}>
                            {formData.picture && (
                              <div>
                                <img
                                  src={URL.createObjectURL(formData.picture)}
                                  alt="Uploaded image"
                                  className="img-fluid mb-2"
                                  style={{
                                    maxWidth: "300px",
                                    maxHeight: "300px",
                                  }}
                                />
                                <p className="mb-0">Uploaded image</p>
                              </div>
                            )}
                            <div className="mb-3">
                              <h6 className="my-2">
                                Upload internship image here, or{" "}
                                <span
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                >
                                  Browse {" "}
                                  <span className="text-danger">*</span>
                                </span>
                              </h6>
                              <input
                                className="form-control"
                                type="file"
                                name="picture"
                                id="image"
                                accept="image/gif, image/jpeg, image/png"
                                onChange={handleImageSelect}
                              />
                              <p className="small mb-0 mt-2">
                                <b>Note:</b> Only JPG, JPEG, and PNG formats are
                                supported. Our suggested dimensions are 600px *
                                450px. Larger images will be cropped to fit our
                                thumbnails/previews.
                              </p>
                            </div>
                            {formData.picture && (
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
                      <div className="col-6">
                        <label className="form-label">StartDate</label>
                        <input
                          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}

                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Finish Date</label>
                        <input
                          className={`form-control ${errors.finishDate ? 'is-invalid' : ''}`}
                          type="date"
                          name="finishDate"
                          value={formData.finishDate}
                          onChange={handleChange}
                        />
                        {errors.finishDate && <div className="invalid-feedback">{errors.finishDate}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">spots</label>
                        <input
                          className={`form-control ${errors.place ? 'is-invalid' : ''}`}
                          type="number"
                          name="place"
                          value={formData.place}
                          onChange={handleChange}

                        />
                        {errors.place && <div className="invalid-feedback">{errors.place}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Price</label>
                        <input
                          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}

                      </div>
                    </div>
                    <div className="d-md-flex justify-content-end align-items-start mt-4">
                      <div className="text-md-end">
                        <button
                          className="btn btn-success mb-2 mb-sm-0"
                          type="submit"
                        >
                          Submit an Internship
                        </button>
                        <p className="mb-0 small mt-1">
                          Once you click "Submit an Internship", your internship will be
                          uploaded.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
