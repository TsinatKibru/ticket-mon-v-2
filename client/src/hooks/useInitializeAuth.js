import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "../utils/axiosConfig";
import { setUser, setLoading, setError } from "../redux/slices/authSlice";
import { getTickets } from "../redux/slices/ticketSlice";
import { getUsersContent } from "../redux/slices/userSlice";

const useInitializeAuth = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        dispatch(setLoading(true));
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;

          // Fetch user data
          const userResponse = await axios.get(`/api/v1/users/${userId}`);
          console.log("res", userResponse);
          dispatch(setUser(userResponse.data.data));

          // Fetch all users
          const usersResponse = await axios.get("/api/v1/users");
          console.log("ress", usersResponse);

          dispatch(getUsersContent(usersResponse.data.data));

          // Fetch all tickets
          const ticketsResponse = await axios.get("/api/v1/tickets");
          dispatch(getTickets(ticketsResponse.data.data));

          dispatch(setLoading(false));
        } catch (error) {
          console.error("Error during initialization:", error);
          dispatch(setError("Failed to initialize. Please try again later."));
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [token, dispatch]);
};

export default useInitializeAuth;
