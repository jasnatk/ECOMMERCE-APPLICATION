import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import toast from "react-hot-toast";
import { clearUser } from "../redux/features/userSlice";
import { clearSeller } from "../redux/features/userSlice";
import { clearAdmin } from "../redux/features/userSlice";

export const useLogout = (role = "user") => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`/${role}/logout`); 
    } catch (error) {
      console.error(`${role} logout failed:`, error);
    }

    // Remove token
    localStorage.removeItem("token");

    // Clear Redux state based on role
    if (role === "user") dispatch(clearUser());
    if (role === "seller") dispatch(clearSeller());
    if (role === "admin") dispatch(clearAdmin());

    toast.success("Logged out successfully");

   
    navigate("/");
  };

  return handleLogout;
};
