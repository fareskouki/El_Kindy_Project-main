import axios from '../api/axios';
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setLogout } from "../state";

const useRefreshToken = () => {
    const dispatch = useDispatch();
    

    const refresh = async (refreshTokenState) => {
        try {
            const response = await axios.post('/auth/refresh-token', {
                refreshToken: refreshTokenState
              }, {
                withCredentials: true
            });
            dispatch(setAccessToken({ accessToken: response.data.accessToken }));
            return response.data.accessToken;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("Trying to logout due to token refresh failure");
                dispatch(setLogout());
            }
            throw error; // rethrow the error to handle it in the component
        }
    }

    return refresh;
};

export default useRefreshToken;