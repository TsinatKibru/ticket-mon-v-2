import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  const token = localStorage.getItem("token");

  // If the socket already exists and is connected, return it
  if (socket && socket.connected) {
    return socket;
  }

  // Disconnect the existing socket if it exists
  if (socket) {
    console.log("disconnect");
    socket.disconnect();
  }

  const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:5500"; // Default to localhost if no env var is set

  // Create a new socket connection
  socket = io(socketUrl, {
    auth: {
      token: `${token}`, // Send JWT token for authentication
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

export const disconnectSocket = () => {
  console.log("disconnectSocket");
  if (socket) {
    socket.disconnect();
    socket = null; // Reset the socket instance
  }
};

export default socket;
