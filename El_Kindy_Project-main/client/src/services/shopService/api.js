import { axiosPrivate } from "api/axios";

export const getShop = async (id) => {
    const reponse = await axiosPrivate.get(`/shops/${id}`);
    return reponse;
}