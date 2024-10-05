import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import BannerStart from "components/BannerStart";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    picturePath: "",
    picture: null,
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [formModified, setFormModified] = useState(false); // State variable to track form modification

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axiosPrivate.get(`/api/categories/${id}`);
        //console.log(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
        setMessage("Failed to load category data.");
      }
    };

    if (id) fetchCategoryData();
  }, [id]);

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
  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById("image").value = "";


    if (formData.picturePath === "") {
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
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setFormModified(true); // Set form as modified when any field is changed
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        error = value.trim() === "" ? "Please enter a category title!" : "";
        break;
      case "description":
        error = value.trim() === "" ? "Please enter a short description!" : "";
        break;
      case "picture":
        error = value === null ? "Please upload an image!" : "";
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
      return;
    } else {
      try {
        // Check if any form data has changed
        const formDataChanged = Object.keys(formValues).some((key) => {
          return formValues[key] !== formData[key];
        });

        if (formDataChanged) {
          if (imageFile) {
            const formDataToSend = new FormData();
            for (let value in formValues) {
              formDataToSend.append(value, formValues[value]);
            }
            formDataToSend.append('picturePath', formValues.picture.name);
             // If form data has changed, send the updated data
          const response = await axiosPrivate.put(
            `/api/categories/update/${id}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status === 200) {
            toast.success("Category updated successfully !!", {
              autoClose: 1500,
              style: {
                color: "green",
              },
            });
            setTimeout(() => {
              navigate("/listCategories");
            }, 2000);
          } else {
            console.log("cant update!!!");
          }
          } else {
            // If form data has changed, send the updated data
          const response = await axiosPrivate.put(
            `/api/categories/update/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status === 200) {
            toast.success("Category updated successfully !!", {
              autoClose: 1500,
              style: {
                color: "green",
              },
            });
            setTimeout(() => {
              navigate("/listCategories");
            }, 2000);
          } else {
            console.log("cant update!!!");
          }
          }

          
        } else {
          // If no changes were made, simply navigate away
          navigate("/listCategories");
        }
      } catch (error) {
        console.error("Failed to update category:", error);
        setMessage("Failed to update Category. Please try again.");
      }
    }
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
              title="Update Category"
              description="Make changes to your category details below."
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <div className="">
                  <h2 className="p-2 " style={{ color: "#1d3b53" }}>
                    Category details
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="m-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label">Category Name</label>
                      <input
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        name="name"
                        type="text"
                        placeholder="Enter category name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        rows={2}
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description}
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <div className="col-12">
                      <div
                        className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${
                          errors.picture ? "border-danger" : ""
                        }`}
                      >
                        {/* Display the image */}
                        {imageFile ? (
                          <div>
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt="Uploaded image"
                              className="img-fluid mb-2"
                              style={{ maxWidth: "300px", maxHeight: "300px" }} // Limit image dimensions
                              required
                            />
                            <p className="mb-0">Uploaded image</p>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={`http://localhost:3001/assets/${formData.picturePath}`}
                              alt="Uploaded image"
                              className="img-fluid mb-2"
                              style={{ maxWidth: "300px", maxHeight: "300px" }} // Limit image dimensions
                              required
                            />
                            <p className="mb-0">{formData.picturePath}</p>
                          </div>
                        )}
                        {/* Upload image button */}
                        <div className="mb-3">
                          <h6 className="my-2">
                            Upload course image here, or{" "}
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

                  {/* Submit button */}
                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button
                        className="btn btn-success mb-2 mb-sm-0"
                        type="submit"
                        disabled={!formModified} // Disable button if form is not modified
                      >
                        Update Category
                      </button>
                      <p className="mb-0 small mt-1">
                        Once you click "Update Category", your changes will be
                        saved.
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
  );
}

export default CategoryForm;
