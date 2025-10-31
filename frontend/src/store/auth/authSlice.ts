// frontend/src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/api";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// --- Login ---
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const res = await axios.post("/auth/login", credentials);
    return res.data;
  }
);

// --- Register ---
export const register = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    const res = await axios.post("/auth/register", data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message || "Login failed";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message || "Register failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
