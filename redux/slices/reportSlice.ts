import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface ReportState {
  dateRange: { start: string; end: string };
  summary: {
    totalLeads: number;
    leadChange: number;
    conversionRate: number;
    totalFollowups: number;
    completedFollowups: number;
    followupRate: number;
    activeSites: number;
    totalStaff: number;
  };
  stageCounts: Array<{ label: string; count: number }>;
  sourceCounts: Array<{ label: string; count: number }>;
  agentCounts: Array<{ label: string; count: number }>;
  sitePerformance: Array<{ label: string; count: number; status: string }>;
  staffPerformance: Array<{ name: string; leadsAssigned: number; followups: number; completed: number }>;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  dateRange: { start: '', end: '' },
  summary: {
    totalLeads: 0,
    leadChange: 0,
    conversionRate: 0,
    totalFollowups: 0,
    completedFollowups: 0,
    followupRate: 0,
    activeSites: 0,
    totalStaff: 0,
  },
  stageCounts: [],
  sourceCounts: [],
  agentCounts: [],
  sitePerformance: [],
  staffPerformance: [],
  loading: false,
  error: null,
};

export const fetchReportStats = createAsyncThunk(
  'report/fetchReportStats',
  async ({ filter = '30days', startDate, endDate }: { filter?: string; startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('filter', filter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const response = await axios.get(`/reports/stats?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report stats');
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReportStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dateRange = action.payload.dateRange;
        state.summary = action.payload.summary;
        state.stageCounts = action.payload.stageCounts;
        state.sourceCounts = action.payload.sourceCounts;
        state.agentCounts = action.payload.agentCounts;
        state.sitePerformance = action.payload.sitePerformance;
        state.staffPerformance = action.payload.staffPerformance;
      })
      .addCase(fetchReportStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportSlice.reducer;
