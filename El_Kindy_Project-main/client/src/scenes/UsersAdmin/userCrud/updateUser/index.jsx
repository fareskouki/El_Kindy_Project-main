import React, { useState, useEffect } from 'react';
import { updateAdmin } from 'services/usersService/api';

function UpdateUser({ user, onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    password: user.passwordDecoded || '',
    verified: user.verified || true,
    roles: user.roles || ['admin'],
    address: user.address || '',
    gender: user.gender || '',
    phoneNumber1: user.phoneNumber1 || '',
    phoneNumber2: user.phoneNumber2 || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format dateOfBirth
    // Add other necessary fields here
  });

  const [errors, setErrors] = useState({});
  const [formChanged, setFormChanged] = useState(false);


  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: user.passwordDecoded || '',
      verified: user.verified || true,
      roles: user.roles || ['admin'],
      address: user.address || '',
      gender: user.gender || '',
      phoneNumber1: user.phoneNumber1 || '',
      phoneNumber2: user.phoneNumber2 || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', // Format dateOfBirth
      // Add other necessary fields here
    });
    setFormChanged(false); // Reset form changed state

  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setFormChanged(true); // Set form changed state to true

  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = value.trim() === '' ? 'Please enter your first name!' : '';
        break;
      case 'lastName':
        error = value.trim() === '' ? 'Please enter your last name!' : '';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address!';
        break;
      case 'password':
        error = value.length < 6 ? 'Password must be at least 6 characters long!' : '';
        break;
      case 'address':
        error = value.trim() === '' || value.length < 6 ? 'Please enter your full address!' : '';
        break;
      case 'gender':
        error = value === '' ? 'Please select your gender!' : '';
        break;
      case 'phoneNumber1':
        error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number!';
        break;
      case 'phoneNumber2':
        // Validate phone number 2 only if a value is provided
        if (value.trim() !== '') {
          error = /^(20|21|22|23|24|25|26|27|28|29|50|51|52|53|54|55|56|57|58|59|90|91|92|93|94|95|96|97|98|99)\d{6}$/.test(value) ? '' : 'Please enter a valid phone number!';
        }
        break;
      case 'dateOfBirth':
        error = value === '' ? 'Please select your date of birth!' : '';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        formErrors[key] = errors[key];
      }
    });
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    try {
      const response = await updateAdmin(user._id, formData);
      if (response.status === 200) {
        console.log('User updated successfully!');
        onClose();
        fetchData();
      } else {
        console.error('Error updating user:', response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const isFormDisabled = () => {
    // Check if any field in the form data is different from the corresponding field in the original user data
    return Object.keys(formData).every((key) => formData[key] === user[key]);
  };


  return (
    <div className="page-content-wrapper border">
      <div className="container position-relative">
        <button className="btn btn-link text-danger position-absolute top-0 end-0 m-3" onClick={onClose} style={{ fontSize: '1.3rem' }}>
          <i className="bi bi-x-lg"></i>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <h5 className="font-base">Update Admin Info</h5>
            <div>
              <div className="accordion-body mt-3">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">First name <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Last name <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Email <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Password <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Address</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Gender</h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Phone Number 1 <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber1"
                          value={formData.phoneNumber1}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber1 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber1 && <div className="invalid-feedback">{errors.phoneNumber1}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Phone Number 2</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber2"
                          value={formData.phoneNumber2}
                          onChange={handleChange}
                          className={`form-control ${errors.phoneNumber2 ? 'is-invalid' : ''}`}
                        />
                        {errors.phoneNumber2 && <div className="invalid-feedback">{errors.phoneNumber2}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Date of Birth <span className="text-danger">*</span></h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                        />
                        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!formChanged || isFormDisabled()}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
