import { useState, useEffect } from 'react';
import type { Ticket, CreateTicketData } from '../types/ticket'; 
import { ticketAPI } from '../services/api';
import type { AxiosResponse } from 'axios'; 

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchTickets = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const response: AxiosResponse<{ data: Ticket[] }> = await ticketAPI.getAll();
      setTickets(response.data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const CreateTicketData = async (ticketData: CreateTicketData): Promise<void> => {
    try {
      await ticketAPI.create(ticketData);
      await fetchTickets();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
      throw new Error(errorMessage);
    }
  };

  const updateTicket = async (id: string, data: Partial<CreateTicketData>): Promise<void> => {
    try {
      await ticketAPI.update(id, data);
      await fetchTickets();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { 
    tickets, 
    loading, 
    error, 
    CreateTicketData, 
    updateTicket,
    refetch: fetchTickets 
  };
};
