import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { clearUser } from "../redux/features/userSlice";
import toast from "react-hot-toast";

export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/user/logout"); // Optional API call
        } catch (error) {
            console.error("Logout failed:", error);
        }

        // Remove token and clear user state
        localStorage.removeItem("token");
        dispatch(clearUser());

         // Show success toast
         toast.success("Logged out successfully!"); // Show success toast


        // Redirect to login page
        navigate("/login");
    };

    return handleLogout;
};
