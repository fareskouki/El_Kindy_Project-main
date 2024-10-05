import {  axiosPublic } from "api/axios";



export const getUsers = async (role) => {
    const reponse = await axiosPublic.get(`/auth/getAllUserByRole/${role}`);
    return reponse;
}

export const getUserById = async (id) => {
  const reponse = await axiosPublic.get(`/auth/userById/${id}`);
  return reponse;
}

// Remove a user
export const removeUser = async (userId) => {
    try {
        const response = await axiosPublic.delete(`/auth/removeUser/${userId}`);
        return response;
    } catch (error) {
        console.error('Error removing user:', error);
        throw error;
    }
};

// Add a new user
export const addAdmin = async (userData) => {
    try {
        const response = await axiosPublic.post(`/auth/addAdmin`, userData);
        return response;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

// Update an existing user
export const updateAdmin = async (userId, userData) => {
    try {
        const response = await axiosPublic.put(`/auth/updateAdmin/${userId}`, userData);
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Block a user
export const blockUser = async (userId) => {
    try {
      const response = await axiosPublic.put(`/auth/blockUser/${userId}`);
      return response;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  };
  
  // Unblock a user
  export const unblockUser = async (userId) => {
    try {
      const response = await axiosPublic.put(`/auth/unblockUser/${userId}`);
      return response;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  };


  
// Add a new teacher
export const addTeacher = async (teacherData) => {
  try {
      const response = await axiosPublic.post(`/auth/addTeacher`, teacherData);
      return response;
  } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
  }
};

// Update an existing teacher
export const updateTeacher = async (teacherId, teacherData) => {
  try {
      const response = await axiosPublic.put(`/auth/updateTeacher/${teacherId}`, teacherData);
      return response;
  } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
  }
};

// Add a new student
export const addStudent = async (studentData) => {
  try {
    const response = await axiosPublic.post(`/auth/addStudentAndParent`, studentData);
    return response;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

// Update an existing student
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axiosPublic.put(`/auth/updateStudent/${studentId}`, studentData);
    return response;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};


  