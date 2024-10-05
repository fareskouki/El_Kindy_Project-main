import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);
    return { auth, setAuth };
}

export default useAuth;