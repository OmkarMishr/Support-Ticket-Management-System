import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create ticket type (title, description, priority)
export interface CreateTicketData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// Update ticket type (status, notes, etc.)
export interface UpdateTicketData {
  status?: 'open' | 'in-progress' | 'resolved';
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export const ticketAPI = {
  create: async (data: CreateTicketData) => {
    const response = await axios.post(`${API_URL}/tickets`, data);
    return response.data;
  },

  // ✅ FIXED: Now accepts UpdateTicketData
  update: async (id: string, data: Partial<UpdateTicketData>) => {
    const response = await axios.put(`${API_URL}/tickets/${id}`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}/tickets`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/tickets/${id}`);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/tickets/${id}`);
    return response.data;
  }
};
