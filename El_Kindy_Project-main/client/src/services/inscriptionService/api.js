
export const getInscription = async (id, axiosPrivate) => {
    const reponse = await axiosPrivate.get(`/inscription/${id}`);
    return reponse;
}