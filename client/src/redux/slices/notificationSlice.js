import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

export const getUnreadNotifications = createAsyncThunk(
  "notification/getUnread",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/notifications/unread");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markNotificationsAsSeen = createAsyncThunk(
  "notification/markSeen",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/notifications/mark-seen");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  notifications: [],
  loading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Add new notification at the top
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.message !== action.payload.message
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnreadNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
      })
      .addCase(getUnreadNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markNotificationsAsSeen.fulfilled, (state) => {
        state.notifications = [];
      });
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
