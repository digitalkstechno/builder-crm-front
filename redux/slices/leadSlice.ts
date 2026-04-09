import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  site: string;
  siteId: string;
  source: 'WhatsApp' | 'Facebook' | 'Website' | 'Walk-in' | 'Referral';
  budget: string;
  stage: string;
  stageId: string;
  agent: string;
  agentId: string;
  createdAt: string;
  notes?: string;
}

interface LeadState {
  leads: Lead[];
  leadStatuses: any[];
  staffDropdown: any[];
  sitesDropdown: any[];
  siteTeamMembers: {
    leader: any;
    members: any[];
  };
  followups: any[];
  reminders: any[];
  reminderPagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  leadStatuses: [],
  staffDropdown: [],
  sitesDropdown: [],
  siteTeamMembers: {
    leader: null,
    members: []
  },
  followups: [],
  reminders: [],
  reminderPagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  },
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  },
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk(
  'lead/fetchLeads',
  async ({ page = 1, limit = 10, search = '', status, source, agent }: {
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
    source?: string,
    agent?: string
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (source) params.append('source', source);
      if (agent) params.append('agent', agent);

      const response = await axios.get(`/lead?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadStatuses = createAsyncThunk(
  'lead/fetchLeadStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/statuses');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead statuses');
    }
  }
);

export const fetchStaffDropdown = createAsyncThunk(
  'lead/fetchStaffDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/staff-dropdown');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff dropdown');
    }
  }
);

export const fetchSitesDropdown = createAsyncThunk(
  'lead/fetchSitesDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/lead/sites-dropdown');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites dropdown');
    }
  }
);

export const fetchSiteTeamMembers = createAsyncThunk(
  'lead/fetchSiteTeamMembers',
  async (siteId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lead/site-team-members/${siteId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch site team members');
    }
  }
);

export const createLead = createAsyncThunk(
  'lead/createLead',
  async (leadData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/lead', leadData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'lead/updateLead',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/lead/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'lead/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/lead/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

// Followup actions
export const createFollowup = createAsyncThunk(
  'lead/createFollowup',
  async (followupData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/lead/followup', followupData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create followup');
    }
  }
);

export const fetchLeadFollowups = createAsyncThunk(
  'lead/fetchLeadFollowups',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/lead/${leadId}/followups`);
      return { leadId, followups: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followups');
    }
  }
);

export const updateFollowup = createAsyncThunk(
  'lead/updateFollowup',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/lead/followup/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update followup');
    }
  }
);

export const deleteFollowup = createAsyncThunk(
  'lead/deleteFollowup',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/lead/followup/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete followup');
    }
  }
);

// Reminder actions
export const fetchReminders = createAsyncThunk(
  'lead/fetchReminders',
  async ({ status, page = 1, limit = 10 }: { status?: string, page?: number, limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/reminders?status=${status}&page=${page}&limit=${limit}`);
      return { status, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reminders');
    }
  }
);

export const markReminderCompleted = createAsyncThunk(
  'lead/markReminderCompleted',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.put(`/reminders/${id}/complete`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark reminder completed');
    }
  }
);

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Lead Statuses
      .addCase(fetchLeadStatuses.fulfilled, (state, action) => {
        state.leadStatuses = action.payload;
      })
      // Staff Dropdown
      .addCase(fetchStaffDropdown.fulfilled, (state, action) => {
        state.staffDropdown = action.payload;
      })
      // Sites Dropdown
      .addCase(fetchSitesDropdown.fulfilled, (state, action) => {
        state.sitesDropdown = action.payload;
      })
      // Site Team Members
      .addCase(fetchSiteTeamMembers.fulfilled, (state, action) => {
        state.siteTeamMembers = action.payload;
      })
      // Create Lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
        state.pagination.totalRecords += 1;
      })
      // Update Lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l._id !== action.payload);
        state.pagination.totalRecords -= 1;
      })
      // Create Followup
      .addCase(createFollowup.fulfilled, (state, action) => {
        // Optionally update lead with followup info if needed
      })
      // Fetch Lead Followups
      .addCase(fetchLeadFollowups.fulfilled, (state, action) => {
        state.followups = action.payload.followups;
      })
      // Update Followup
      .addCase(updateFollowup.fulfilled, (state, action) => {
        const index = state.followups.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.followups[index] = action.payload;
        }
      })
      // Delete Followup
      .addCase(deleteFollowup.fulfilled, (state, action) => {
        state.followups = state.followups.filter((f) => f._id !== action.payload);
      })
      // Fetch Reminders
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.reminders = action.payload.data;
        state.reminderPagination = action.payload.pagination;
      })
      // Mark Reminder Completed
      .addCase(markReminderCompleted.fulfilled, (state, action) => {
        const index = state.reminders.findIndex((r) => r._id === action.payload);
        if (index !== -1) {
          state.reminders[index].isSent = true;
          state.reminders[index].sentAt = new Date().toISOString();
        }
      });
  },
});

export default leadSlice.reducer;