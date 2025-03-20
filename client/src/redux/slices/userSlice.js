// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  userstatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersContent: (state, action) => {
      state.users = action.payload;
      state.userstatus = "loaded";
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    addNewUser: (state, action) => {
      state.users.push(action.payload.newUserObj);
    },
    updateUser: (state, action) => {
      const { updatedUser } = action.payload;

      const index = state.users.findIndex(
        (user) => user._id === updatedUser._id
      );

      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatedUser };
      }
    },
    updateUserRoleAction: (state, action) => {
      const { userId, newRole } = action.payload;
      const user = state.users.find((user) => user._id === userId);
      if (user) {
        user.role = newRole;
      }
    },
  },
});

export const {
  getUsersContent,
  deleteUser,
  addNewUser,
  updateUser,
  updateUserRoleAction,
} = userSlice.actions;
export default userSlice.reducer;
