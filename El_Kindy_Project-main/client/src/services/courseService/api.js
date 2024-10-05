
export const getAllCourses = async (axiosPrivate) => {
    const reponse = await axiosPrivate.get(`/course/all`);
    return reponse;
}