
export const getMessages = (id, axiosPrivate) => axiosPrivate.get(`/message/${id}`);

export const addMessage = (data, axiosPrivate) => axiosPrivate.post('/addMessage/', data);