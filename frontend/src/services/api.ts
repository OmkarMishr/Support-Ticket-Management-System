import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { Ticket, CreateTicketData } from '../types/ticket';  

// Response types
interface TicketsResponse {
  data: Ticket[];
}

interface TicketResponse {
  data: Ticket;
}

const API_URL = 'http://localhost:5000/api'; // Backend URL

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ticketAPI = {
  getAll: (): Promise<AxiosResponse<TicketsResponse>> => 
    api.get<TicketsResponse>('/tickets'),
  
  create: (data: CreateTicketData): Promise<AxiosResponse<TicketResponse>> => 
    api.post<TicketResponse>('/tickets', data),
  
  update: (id: string, data: Partial<CreateTicketData>): Promise<AxiosResponse<TicketResponse>> => 
    api.put<TicketResponse>(`/tickets/${id}`, data),
  
  getById: (id: string): Promise<AxiosResponse<TicketResponse>> => 
    api.get<TicketResponse>(`/tickets/${id}`)
};
