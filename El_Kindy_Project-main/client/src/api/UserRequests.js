
export const getUser = (userId, axiosPrivate) => axiosPrivate.get(`/auth/${userId}`);
