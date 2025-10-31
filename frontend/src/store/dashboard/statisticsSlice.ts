import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/api";

export const fetchStatistics = createAsyncThunk(
  "statistics/fetch",
  async () => {
    const res = await axios.get(`/dashboard`);
    return res.data;
  }
);

interface StatisticsState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

const initialState: StatisticsState = {
  loading: false,
  error: null,
  data: null,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      });
  },
});

export default statisticsSlice.reducer;
