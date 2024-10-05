export const createChat = (data, axiosPrivate) => axiosPrivate.post('/chat', data);

export const userChats = (id, axiosPrivate) => axiosPrivate.get(`/chat/${id}`);

export const findChat = (firstId, secondId, axiosPrivate) => axiosPrivate.get(`/chat/find/${firstId}/${secondId}`);