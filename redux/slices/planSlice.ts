import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface Plan {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  noOfStaff: number;
  noOfSites: number;
  noOfWhatsapp: number;
  status: string;
  isDeleted: boolean;
}

interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  plans: [],
  loading: false,
  error: null,
};

export const fetchPlans = createAsyncThunk('plan/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/plan');
    if (response.data.status === 'Success') {
      return response.data.data;
    }
    return rejectWithValue(response.data.message || 'Failed to fetch plans');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
  }
});

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default planSlice.reducer;
