import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import headerReducer from "./slices/headerSlice";
import rightDrawerSlice from "./slices/rightDrawerSlice";
import modalReducer from "./slices/modalSlice";
import userSlice from "./slices/userSlice";
import ticketSlice from "./slices/ticketSlice";
import notificationSlice from "./slices/notificationSlice";
import departmentsSlice from "./slices/departmentsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    header: headerReducer,
    rightDrawer: rightDrawerSlice,
    modal: modalReducer,
    user: userSlice,
    ticket: ticketSlice,
    notification: notificationSlice,
    departments: departmentsSlice,
  },
});

export default store;
