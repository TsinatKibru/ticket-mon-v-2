// departmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig"; // Import the axios config

// Async Thunks
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    const response = await axios.get("/api/v1/departments"); // Ensure this matches your backend route
    return response.data.data;
  }
);

export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async (newDepartment, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/departments", newDepartment); // Ensure this matches your backend route
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async (updatedDepartment, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/v1/departments/${updatedDepartment._id}`, // Use _id for MongoDB
        updatedDepartment
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/departments/${id}`); // Ensure this matches your backend route
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    // ✅ Function to manually set the status
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Department
      .addCase(addDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.status = "depaddsucceeded";
        state.departments.push(action.payload);
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to add department";
      })

      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.status = "depupdatesucceeded";
        const index = state.departments.findIndex(
          (dept) => dept._id === action.payload._id // Use _id for MongoDB
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update department";
      })

      // Delete Department
      .addCase(deleteDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.status = "deletesucceeded";
        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload // Use _id for MongoDB
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete department";
      });
  },
});
export const { setStatus } = departmentsSlice.actions;

export default departmentsSlice.reducer;
