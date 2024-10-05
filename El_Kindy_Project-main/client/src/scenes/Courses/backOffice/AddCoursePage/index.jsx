import BannerStart from "components/BannerStart";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import { loadScripts } from "../../../../scriptLoader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
//refreshToken
import useAxiosPrivate from "hooks/useAxiosPrivate";

//test
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

function Index() {
  const [dataTheme, setDataTheme] = useState("");
  const scriptsLoaded = useRef(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: null,
    courseCategory: "",
    courseLevel: "",
  });
  //refresh token
  const axiosPrivate = useAxiosPrivate();

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("/api/categories");
      console.log("response : ", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    // Retrieve the value of data-theme from localStorage
    const themeValue = localStorage.getItem("data-theme");

    fetchCategories();

    setDataTheme(themeValue);
    const scripts = [];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, picture: selectedFile });
    
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
    let error = "";
    switch (name) {
      case "title":
        error = value.trim() === "" ? "Please enter a course title!" : "";
        break;
      case "description":
        error = value.trim() === "" ? "Please enter a short description!" : "";
        break;
      case "picture":
        error = value === null ? "Please upload an image!" : "";
        break;
      case "courseCategory":
        error = value === "" ? "Please select a course category!" : "";
        break;
      case "courseLevel":
        error = value === "" ? "Please select a course level!" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  //const dispatch = useDispatch();
  const navigate = useNavigate();

  const addCourse = async () => {


    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Append picturePath to the form data
    formDataToSend.append('picturePath', formData.picture.name);
    formDataToSend.append("fullDescription", fullDescription); // Append full description to form dat

    


    try {
      const response = await axiosPrivate.post("/course/add", formDataToSend);
      const savedCourse = response.data;
      console.log("Course added!");
      console.log("Course", savedCourse);
      // Show the toast notification with autoClose: false
      toast.success("Course added successfully !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
      setTimeout(() => {
        navigate("/listCourses");
      }, 2000);
    } catch (error) {
      console.error("Error adding course:", error);
      // Handle error
      toast.error("Failed to add course. Please try again.");
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
    await addCourse();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Inside your component function
  const [fullDescription, setFullDescription] = useState("");

  // Function to handle changes in the full description field
  const handleFullDescriptionChange = (content) => {
    setFullDescription(content);
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
              title="Submit a new Course"
              description="Read our Before you create a course article before submitting!"
            />
            {/* =======================
              Page Banner END */}
            <div class="card bg-transparent border rounded-3 mt-4">
              {/* Card header */}
              <div className="card-header bg-light border-bottom px-lg-3">
                {/* Step Buttons START */}
                {/* Step 1 */}
                <div className="">
                  <h2
                    className="p-2"
                    style={{
                      color: dataTheme === "dark" ? "#2B6DA2" : "#1d3b53",
                    }}
                  >
                    Course details
                  </h2>
                </div>
              </div>
              <div></div>

              <form onSubmit={handleFormSubmit}>
                {/* Step 1 content START */}
                <div className="m-4">
                  {/* Title */}

                  {/* Basic information START */}
                  <div className="row g-4">
                    {/* Course title */}
                    <div className="col-12">
                      <label className="form-label">Course title {" "}
                                          <span className="text-danger">*</span></label>
                      <input
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        name="title"
                        type="text"
                        placeholder="Enter course title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                    {/* Short description */}
                    <div className="col-12">
                      <label className="form-label">Short description {" "}
                                          <span className="text-danger">*</span></label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        rows={2}
                        placeholder="Enter keywords"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                    {/* Upload image START */}
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
                              Upload course image here, or{" "}
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
                  </div>
                    {/* Upload image END */}
                    <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">Course category {" "}
                                          <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.courseCategory ? 'is-invalid' : ''}`}
                        id="courseCategory"
                        name="courseCategory"
                        value={formData.courseCategory}
                        onChange={handleChange}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.courseCategory && (
                        <div className="invalid-feedback">{errors.courseCategory}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Course level {" "}
                                          <span className="text-danger">*</span></label>
                      <select
                        name="courseLevel"
                        className={`form-select ${
                          errors.courseLevel ? "is-invalid" : ""
                        }`}
                        aria-label=".form-select-sm"
                        data-search-enabled="false"
                        data-remove-item-button="true"
                        value={formData.courseLevel}
                        onChange={handleChange}
                      >
                        <option value="">Select course level</option>
                        <option>All level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advance</option>
                      </select>
                      {errors.courseLevel && (
                        <div className="invalid-feedback">{errors.courseLevel}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Add description</label>
                    {/* Main toolbar */}
                    <div
                      className="bg-body border overflow-hidden"
                      style={{ borderRadius: "10px" }}
                    >
                      <ReactQuill
                        modules={{
                          toolbar: [
                            [{ font: [] }],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ color: [] }, { background: [] }],
                            [{ script: "sub" }, { script: "super" }],
                            ["blockquote", "code-block"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                            ["clean"],
                          ],
                        }}
                        theme="snow"
                        value={fullDescription}
                        onChange={handleFullDescriptionChange}
                        placeholder="The content starts here..."
                        style={{ height: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button
                        className="btn btn-success mb-2 mb-sm-0"
                        type="submit"
                      >
                        Submit a Course
                      </button>
                      <p className="mb-0 small mt-1">
                        Once you click "Submit a Course", your course will be
                        uploaded.
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

export default Index;