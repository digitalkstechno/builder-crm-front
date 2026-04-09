import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface SiteState {
  sites: any[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: SiteState = {
  sites: [],
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

export const fetchSites = createAsyncThunk(
  'site/fetchSites',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/site?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites');
    }
  }
);

export const createSite = createAsyncThunk(
  'site/createSite',
  async (siteData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/site', siteData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create site');
    }
  }
);

export const updateSite = createAsyncThunk(
  'site/updateSite',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/site/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update site');
    }
  }
);

export const deleteSite = createAsyncThunk(
  'site/deleteSite',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/site/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete site');
    }
  }
);

export const getSiteById = createAsyncThunk(
  'site/getSiteById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/site/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch site');
    }
  }
);

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Sites
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Site
      .addCase(createSite.fulfilled, (state, action) => {
        state.sites.unshift(action.payload);
        state.pagination.totalRecords += 1;
      })
      // Update Site
      .addCase(updateSite.fulfilled, (state, action) => {
        const index = state.sites.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.sites[index] = action.payload;
        }
      })
      // Delete Site
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.sites = state.sites.filter((s) => s._id !== action.payload);
        state.pagination.totalRecords -= 1;
      })
      // Get Site by ID
      .addCase(getSiteById.fulfilled, (state, action) => {
        // Can be used for view modal
      });
  },
});

export default siteSlice.reducer;