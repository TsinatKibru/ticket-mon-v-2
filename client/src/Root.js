import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import useInitializeAuth from "./hooks/useInitializeAuth";
import { initializeSocket, disconnectSocket } from "./utils/socket"; // Import socket functions
import { addNotification } from "./redux/slices/notificationSlice"; // Import Redux action
import { updateTicket } from "./redux/slices/ticketSlice"; // Import ticket update action

const Root = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Initialize authentication (decode token, fetch user, etc.)
  useInitializeAuth();

  // Initialize Socket.IO and set up event listeners
  useEffect(() => {
    if (user) {
      const socket = initializeSocket();

      // Listen for incoming notifications
      socket.on("ticketStatusUpdated", (data) => {
        console.log("Ticket Status Updated:", data);
        dispatch(addNotification(data));
        if (data.ticket) {
          dispatch(updateTicket(data.ticket));
        }
      });

      socket.on("ticketAssigned", (data) => {
        console.log("Ticket Assigned:", data);
        dispatch(addNotification(data));
        if (data.ticket) {
          dispatch(updateTicket(data.ticket));
        }
      });

      socket.on("newComment", (data) => {
        console.log("New Comment Added:", data);
        dispatch(addNotification(data));
        if (data.ticket) {
          dispatch(updateTicket(data.ticket));
        }
      });

      socket.on("attachmentAdded", (data) => {
        console.log("Attachment Added:", data);
        dispatch(addNotification(data));
        if (data.ticket) {
          dispatch(updateTicket(data.ticket));
        }
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("ticketStatusUpdated");
        socket.off("ticketAssigned");
        socket.off("newComment");
        socket.off("attachmentAdded");
        if (!user) {
          disconnectSocket();
        }
      };
    }
  }, [dispatch, user]); // Only re-run if the user changes

  return <App />;
};

export default Root;
