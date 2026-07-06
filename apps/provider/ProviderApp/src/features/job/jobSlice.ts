"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import { getJobRequests, respondToBooking, updateBookingStatus, getBookingDetails } from '../../services/booking';

interface Job {
  id: string;
  customerId: string;
  serviceId: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'cancelled';
  scheduledAt: string;
  notes?: string;
  createdAt: string;
}

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

export const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    updateJobStatus: (state, action: PayloadAction<{ id: string; status: Job['status'] }>) => {
      const job = state.jobs.find((j) => j.id === action.payload.id);
      if (job) {
        job.status = action.payload.status;
      }
      if (state.currentJob?.id === action.payload.id) {
        state.currentJob.status = action.payload.status;
      }
    },
    setCurrentJob: (state, action: PayloadAction<Job>) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setJobs, addJob, updateJobStatus, setCurrentJob, clearCurrentJob, setLoading, setError } = jobSlice.actions;

export const fetchJobRequests = (status?: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const jobs = await getJobRequests(status);
    dispatch(setJobs(jobs));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const respondToJob = (
  bookingId: string,
  response: 'accepted' | 'declined'
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await respondToBooking(bookingId, response);
    dispatch(updateJobStatus({ id: bookingId, status: response === 'accepted' ? 'accepted' : 'declined' }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateJob = (
  bookingId: string,
  status: 'in_progress' | 'completed'
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await updateBookingStatus(bookingId, status);
    dispatch(updateJobStatus({ id: bookingId, status }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJobDetails = (bookingId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const job = await getBookingDetails(bookingId);
    dispatch(setCurrentJob(job));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default jobSlice.reducer;