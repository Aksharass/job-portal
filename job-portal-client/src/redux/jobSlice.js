import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as jobsAPI from "../api/jobs";

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

export const fetchJobsAsync = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobsAPI.fetchJobs();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const postJobAsync = createAsyncThunk(
  "jobs/postJob",
  async ({ jobData, token }, { rejectWithValue }) => {
    try {
      const data = await jobsAPI.postJob(jobData, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateJobAsync = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData, token }, { rejectWithValue }) => {
    try {
      const data = await jobsAPI.updateJob(jobId, jobData, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteJobAsync = createAsyncThunk(
  "jobs/deleteJob",
  async ({ jobId, token }, { rejectWithValue }) => {
    try {
      const data = await jobsAPI.deleteJob(jobId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postJobAsync.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      })
      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.meta.arg.jobId);
      });
  },
});

export default jobSlice.reducer;
