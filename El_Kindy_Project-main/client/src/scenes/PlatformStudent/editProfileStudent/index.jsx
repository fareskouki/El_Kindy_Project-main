import NavBar from "components/NavBar";
import React, { useEffect, useState } from "react";
import TopBarTeacherStudent from "components/TopBarTeacherStudent";
import SideBarStudent from "components/SideBarStudent";
import Footer from "components/Footer";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "services/usersService/api";
import useAxiosPrivate from "hooks/useAxiosPrivate";

function EditProfileStudent() {
  const accessToken = useSelector((state) => state.accessToken);
  const tokenUser = accessToken ? jwtDecode(accessToken) : "";
  const [userData, setUserData] = useState({});
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password match
  const [twoFAActivatedSuccess, set2FAActivatedSuccess] = useState(false);

  //refresh token
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    picturePath: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    phoneNumber1: "",
    phoneNumber2: "",
    parentName: "", // Add parent information fields to the state
    parentProfession: "",
    parentEmail: "",
    parentPhone: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(tokenUser.id);
        console.log("response:", response.data.user);
        setUserData(response.data.user);
        //setCurrentPassword(response.data.user.passwordDecoded);
        setUser({
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          email: response.data.user.email || "",
          password: response.data.user.passwordDecoded || "",
          picturePath: response.data.user.picturePath,
          dateOfBirth: response.data.user.dateOfBirth.split("T")[0] || "",
          address: response.data.user.address || "",
          gender: response.data.user.gender || "",
          phoneNumber1: response.data.user.phoneNumber1 || "",
          phoneNumber2: response.data.user.phoneNumber2 || "",
          parentName: response.data.user.studentInfo.parentName || "", // Set parent information fields if available
          parentProfession:
            response.data.user.studentInfo.parentProfession || "",
          parentEmail: response.data.user.studentInfo.parentEmail || "",
          parentPhone: response.data.user.studentInfo.parentPhone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      //await updateEmail(newEmail);
      // Make HTTP request to update email
      const response = await axiosPrivate.put(
        `/auth/updateEmail/${tokenUser.id}`,
        { email: newEmail }
      );
      if (response.status === 200) {
        // Email updated successfully
        alert("Email updated successfully!");
      } else {
        // Handle other response statuses if needed
        console.error("Failed to update email:", response.data.message);
        alert("Failed to update email. Please try again later.");
      }
      alert("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email. Please try again later.");
    }
  };

  const handleChangePassword = async () => {
    // Check if passwords match before submitting the form
    if (newPassword !== confirmNewPassword) {
      setPasswordsMatch(false);
      return; // Do not proceed further if passwords don't match
    }
    try {
      // Make HTTP request to update password
      const response = await axiosPrivate.put(
        `/auth/updatePassword/${tokenUser.id}`,
        {
          currentPassword,
          newPassword,
        }
      );
      if (response.status === 200) {
        // Password updated successfully
        alert("Password updated successfully!");
      } else {
        console.error("Failed to update password:", response.data.message);
        alert("Failed to update password. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again later.");
    }
  };

  //2FA
  const handleAjout2FA = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        `/auth/ajouter2FA/${user.email}`
      );

      if (response.status === 200) {
        set2FAActivatedSuccess(true);
      } else {
        console.error("2FA Activated failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error 2FA Activated:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // State to hold the image name
  const [imageName, setImageName] = useState(null);
  // State to hold the image file
  const [imageFile, setImageFile] = useState(null);

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setImageName(selectedFile.name);
    setImageFile(selectedFile);

    // Create a URL for the selected image
    const imageUrl = URL.createObjectURL(selectedFile);

    // Set the profile picture preview
    setUser((prevUser) => ({
      ...prevUser,
      picturePath: imageUrl, // Use the URL of the selected image
    }));
  };

  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the user's picturePath to the default avatar path
    setUser((prevUser) => ({
      ...prevUser,
      picturePath:
        prevUser.gender === "Male"
          ? "/assets/images/element/01.jpg"
          : "/assets/images/element/02.jpg",
    }));
  };

  const updateUserProfile = async (userId, userData) => {
    const formData = new FormData();
    for (let value in userData) {
      formData.append(value, userData[value]);
    }
    // Append the image file to FormData if it exists
    if (imageFile) {
      formData.append("picture", imageFile);
      formData.append("picturePath", imageName);
    }
    try {
      console.log("formData", formData);
      const response = await axiosPrivate.patch(
        `/user/edit/${userId}`,
        formData
      );
      console.log("status : ", response.status);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form

    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    console.log("Values", formValues);
    try {
      // Your code to update user profile
      await updateUserProfile(tokenUser.id, formValues);
      // Show success message
    } catch (error) {
      console.error("Error updating profile:", error);
      // Show error message
    }
  };

  return (
    <div>
      <main>
        <NavBar />
        <TopBarTeacherStudent />
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarStudent />
              {/* Main content START */}
              <div className="col-xl-9">
                <div>
                  {/* Edit profile START */}
                  <div className="card bg-transparent border rounded-3">
                    {/* Card header */}
                    <div className="card-header bg-transparent border-bottom">
                      <h3 className="card-header-title mb-0">Edit Profile</h3>
                    </div>
                    {/* Card body START */}
                    <div className="card-body">
                      {/* Form */}
                      <form className="row g-4" onSubmit={handleSubmit}>
                        {/* Profile picture */}
                        <div className="col-12 justify-content-center align-items-center">
                          <label className="form-label">Profile picture</label>
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-4">
                              {imageFile ? (
                                <div>
                                  <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Uploaded image"
                                    className="img-fluid mb-2"
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      borderRadius: "50%",
                                    }}
                                    required
                                  />
                                  <p className="mb-0">Uploaded image</p>
                                </div>
                              ) : (
                                <div>
                                  <img
                                    id="uploadfile-1-preview"
                                    className="avatar-img rounded-circle border border-white border-3 shadow"
                                    src={
                                      `http://localhost:3001/assets/${user.picturePath}` ||
                                      (user.gender === "Male"
                                        ? "/assets/images/element/01.jpg"
                                        : "/assets/images/element/02.jpg")
                                    }
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      borderRadius: "50%",
                                    }}
                                    alt="Profile"
                                  />
                                </div>
                              )}

                              <button
                                type="button"
                                className="uploadremove"
                                onClick={handleRemoveImage}
                              >
                                <i className="bi bi-x text-white" />
                              </button>
                            </div>
                            <label className="btn btn-primary-soft mb-0">
                              Change
                              <input
                                id="uploadfile-1"
                                className="form-control d-none"
                                type="file"
                                onChange={handleImageSelect}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Full name */}
                        <div className="col-12">
                          <label className="form-label">Full name</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              name="firstName"
                              value={user.firstName}
                              onChange={handleChange}
                              placeholder="First name"
                            />
                            <input
                              type="text"
                              className="form-control"
                              name="lastName"
                              value={user.lastName}
                              onChange={handleChange}
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                        {/* Email id */}
                        <div className="col-md-6">
                          <label className="form-label">Email id</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                          />
                        </div>
                        {/* Date of Birth */}
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={user.dateOfBirth?.split("T")[0]}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        {/* Location */}
                        <div className="col-md-6">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            placeholder="Location"
                          />
                        </div>
                        {/* Gender */}
                        <div className="col-md-6">
                          <label className="form-label">Gender</label>
                          <select
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        {/* Phone Number 1 */}
                        <div className="col-md-6">
                          <label className="form-label">Phone Number 1</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNumber1"
                            value={user.phoneNumber1}
                            onChange={handleChange}
                            placeholder="Phone Number 1"
                          />
                        </div>
                        {/* Phone Number 2 */}
                        <div className="col-md-6">
                          <label className="form-label">Phone Number 2</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNumber2"
                            value={user.phoneNumber2}
                            onChange={handleChange}
                            placeholder="Phone Number 2"
                          />
                        </div>
                        {/* Parent information fields */}
                        <div className="col-md-6">
                          <label className="form-label">Parent Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="parentName"
                            value={user.parentName}
                            onChange={handleChange}
                            placeholder="Parent Name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Parent Profession
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="parentProfession"
                            value={user.parentProfession}
                            onChange={handleChange}
                            placeholder="Parent Profession"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Parent Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="parentEmail"
                            value={user.parentEmail}
                            onChange={handleChange}
                            placeholder="Parent Email"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Parent Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            name="parentPhone"
                            value={user.parentPhone}
                            onChange={handleChange}
                            placeholder="Parent Phone"
                          />
                        </div>
                        {/* Save button */}
                        <div className="d-sm-flex justify-content-end">
                          <button
                            className="btn btn-primary mb-0"
                            type="submit"
                          >
                            Save changes
                          </button>
                        </div>
                      </form>
                    </div>
                    {/* Card body END */}
                  </div>
                  {/* Edit profile END */}
                  <div className="row g-4 mt-3">
                    {/* Social media profile END */}
                    {/* EMail change START */}
                    <div className="col-lg-6">
                      <div className="card bg-transparent border rounded-3">
                        {/* Card header */}
                        <div className="card-header bg-transparent border-bottom">
                          <h5 className="card-header-title mb-0">
                            Update email
                          </h5>
                        </div>
                        {/* Card body */}
                        <div className="card-body">
                          <p>
                            Your current email address is{" "}
                            <span className="text-primary">{user.email}</span>
                          </p>
                          {/* Email */}
                          <form onSubmit={handleEmailUpdate}>
                            <label className="form-label">
                              Enter your new email id
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              placeholder="Enter new email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              required
                            />
                            <div className="d-flex justify-content-end mt-4">
                              <button
                                type="submit"
                                className="btn btn-primary mb-0"
                              >
                                Update email
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    {/* EMail change end */}
                    {/* Password change START */}
                    <div className="col-lg-6">
                      <div className="card border bg-transparent rounded-3">
                        {/* Card header */}
                        <div className="card-header bg-transparent border-bottom">
                          <h5 className="card-header-title mb-0">
                            2FA & Update password
                          </h5>
                        </div>
                        {/* Card body START */}
                        <div className="card-body">
                          <h6 className="mb-0">2-way Authentication</h6>

                          <div
                            className="row needs-validation mt-2"
                            noValidate=""
                          >
                            <div className="mb-3 col-lg-6 col-md-12 col-12">
                              <ol>
                                <li> Download Application </li>
                                <li> Scan the code</li>
                                <li> Get The secret Key </li>
                              </ol>
                              {!userData.TwoFactorAuthentication && (
                                <button
                                  type="submit"
                                  className="btn btn-primary mt-2"
                                  onClick={handleAjout2FA}
                                >
                                  Activate 2FA
                                </button>
                              )}
                              {twoFAActivatedSuccess && (
                                <div
                                  className="alert alert-success mt-3"
                                  role="alert"
                                >
                                  2FA Activated with successful !
                                </div>
                              )}
                            </div>
                            {userData.TwoFactorAuthentication && (
                              <div className="mb-3 col-lg-6 col-md-12 col-12">
                                <figure className="galleryitem galleryitem--2 mb-0">
                                  <img
                                    src={userData.qrCode}
                                    alt="Gallery image 2"
                                    className="gallery__img rounded-3"
                                  />
                                </figure>
                              </div>
                            )}
                          </div>
                          {/* Current password */}
                          <div className="mb-3">
                            <h6 className="mb-0">Update password</h6>
                            <label className="form-label mt-3">
                              Current password
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter current password"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />
                          </div>
                          {/* New password */}
                          <div className="mb-3">
                            <label className="form-label">
                              {" "}
                              Enter new password
                            </label>
                            <div className="input-group">
                              <input
                                className="form-control"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span className="input-group-text p-0 bg-transparent">
                                <i className="far fa-eye cursor-pointer p-2 w-40px" />
                              </span>
                            </div>
                            <div className="rounded mt-1" id="psw-strength" />
                          </div>
                          {/* Confirm password */}
                          <div>
                            <label className="form-label">
                              Confirm new password
                            </label>
                            <input
                              className="form-control"
                              type="password"
                              placeholder="Enter new password"
                              value={confirmNewPassword}
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                            />
                          </div>
                          {/* Error message for password mismatch */}
                          {!passwordsMatch && <p>Passwords do not match.</p>}
                          {/* Button */}
                          <div className="d-flex justify-content-end mt-4">
                            <button
                              type="button"
                              className="btn btn-primary mb-0"
                              onClick={handleChangePassword}
                            >
                              Change password
                            </button>
                          </div>
                        </div>
                        {/* Card body END */}
                      </div>
                    </div>
                    {/* Password change end */}
                  </div>
                  {/* Main content END */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

export default EditProfileStudent;
