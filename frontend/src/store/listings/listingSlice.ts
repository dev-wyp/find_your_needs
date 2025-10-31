import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchListings = createAsyncThunk(
  "listings/fetch",
  async ({
    page = 1,
    limit = 10,
    payload,
  }: {
    page?: number;
    limit?: number;
    payload?: any;
  }) => {
    const { data } = await api.get("/listings", {
      params: {
        page,
        limit,
        ...payload,
      },
    });
    return data;
  }
);

const slice = createSlice({
  name: "listings",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Unknown";
    });
  },
});

export default slice.reducer;
