import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/api";

export const fetchListingDetail = createAsyncThunk(
  "listingDetail/fetch",
  async (id: string) => {
    const res = await axios.get(`/listings/${id}`);
    return res.data;
  }
);

interface ListingDetailState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

const initialState: ListingDetailState = {
  loading: false,
  error: null,
  data: null,
};

const listingDetailSlice = createSlice({
  name: "listingDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchListingDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch listing";
      });
  },
});

export default listingDetailSlice.reducer;
