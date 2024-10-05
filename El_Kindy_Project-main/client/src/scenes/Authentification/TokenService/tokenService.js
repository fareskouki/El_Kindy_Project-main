
import { setLogout } from "../../../state";

const refreshToken = async (refreshToken, dispatch) => {
    try {
      const refreshedTokenResponse = await fetch("http://localhost:3001/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshedTokenResponse.ok) {
        const { accessToken } = await refreshedTokenResponse.json();
          if(accessToken){
            return accessToken;
          }
          else{
            console.error("Failed to refresh access token.");
            dispatch(setLogout()); // Log out user if token refresh fails
          }
      } else {
        // Handle refresh token expiration or invalidity
        dispatch(setLogout()); // Log out user if token refresh fails
        throw new Error("Unable to refresh token");
      }
    } catch (error) {
      // Handle refresh token error
      dispatch(setLogout()); // Log out user if token refresh fails
      throw new Error("Failed to refresh token: " + error.message);
    }
  };
  
  export default refreshToken;
  