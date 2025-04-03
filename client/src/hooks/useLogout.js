import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { clearUser } from "../redux/features/userSlice";

export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/logout"); // Optional API call
        } catch (error) {
            console.error("Logout failed:", error);
        }

        // Remove token and clear user state
        localStorage.removeItem("token");
        dispatch(clearUser());

        // Redirect to login page
        navigate("/login");
    };

    return handleLogout;
};
