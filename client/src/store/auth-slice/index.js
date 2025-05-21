import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData, { rejectWithValue }) => {
    try {
      console.log("Attempting to register user...");
      // Use the API_URL from config for consistency
      const response = await axios.post(
        "/api/auth/register",
        formData,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );
      console.log("Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Server error data:", error.response.data);
        console.error("Server error status:", error.response.status);
        return rejectWithValue(error.response.data || "Registration failed");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server");
        return rejectWithValue("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        return rejectWithValue("Request failed: " + error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData, { rejectWithValue }) => {
    try {      console.log("Attempting to login user...");
      // Add more detailed logging about the URL construction
      const loginEndpoint = "/api/auth/login";
      console.log(`Login endpoint: ${loginEndpoint}`);
      console.log(`axios.defaults.baseURL: "${axios.defaults.baseURL}"`);
      console.log(`Full URL will be: ${axios.defaults.baseURL ? axios.defaults.baseURL : ''}${loginEndpoint}`);
      
      const response = await axios.post(
        loginEndpoint,
        formData,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Server error data:", error.response.data);
        console.error("Server error status:", error.response.status);
        return rejectWithValue(error.response.data || "Login failed");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server");
        return rejectWithValue("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        return rejectWithValue("Request failed: " + error.message);
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      console.log("Attempting to logout user...");
      // Use the same pattern as register and login - relative URL
      const response = await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout successful");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Logout failed: " + error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const response = await axios.get(
      "/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
