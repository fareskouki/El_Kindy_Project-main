
export const getAllClasses = async (axiosPrivate) => {
    const reponse = await axiosPrivate.get(`/classes/getAll`);
    return reponse;
}