// // // import { createSlice } from "@reduxjs/toolkit";

// // // const authSlice = createSlice({
// // //   name: "auth",
// // //   initialState: {
// // //     token: null,
// // //     user: null,
// // //   },
// // //   reducers: {
// // //     login: (state, action) => {
// // //       state.token = action.payload.token;
// // //       state.user = action.payload.user;
// // //     },
// // //     logout: (state) => {
// // //       state.token = null;
// // //       state.user = null;
// // //     },
// // //   },
// // // });

// // // export const { login, logout } = authSlice.actions;
// // // export default authSlice.reducer;
// // import { createSlice } from "@reduxjs/toolkit";

// // // Load token and user from localStorage
// // const savedAuth = JSON.parse(localStorage.getItem("auth")) || {
// //   token: null,
// //   user: null,
// // };

// // const authSlice = createSlice({
// //   name: "auth",
// //   initialState: {
// //     token: savedAuth.token,
// //     user: savedAuth.user,
// //   },
// //   reducers: {
// //     login: (state, action) => {
// //       state.token = action.payload.token;
// //       state.user = action.payload.user;

// //       // Save token and user in localStorage
// //       localStorage.setItem(
// //         "auth",
// //         JSON.stringify({ token: state.token, user: state.user })
// //       );
// //     },
// //     logout: (state) => {
// //       state.token = null;
// //       state.user = null;

// //       // Remove from localStorage
// //       localStorage.removeItem("auth");
// //     },
// //   },
// // });

// // export const { login, logout } = authSlice.actions;
// // export default authSlice.reducer;
// // authSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const tokenFromStorage = localStorage.getItem("token") || null;

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     token: tokenFromStorage,
//     user: null, // Will be fetched using token later
//   },
//   reducers: {
//     login: (state, action) => {
//       state.token = action.payload.token;
//       // Optionally set immediate user info if provided
//       state.user = action.payload.user || null;
//       localStorage.setItem("token", state.token);
//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem("token");
//     },
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//   },
// });

// export const { login, logout, setUser } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage,
    user: null, // Will be fetched using token later
    loading: false, // Add loading state
    isAuthenticated: !!tokenFromStorage, // Add isAuthenticated state
    error: null, // Add error state
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true; // Set isAuthenticated to true
      localStorage.setItem("token", state.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false; // Set isAuthenticated to false
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // Update isAuthenticated based on user
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Set loading state
    },
    setError: (state, action) => {
      state.error = action.payload; // Set error state
    },
  },
});

export const { login, logout, setUser, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
