export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  history: TicketHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {  
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TicketHistory {
  status: 'open' | 'in-progress' | 'resolved';
  assignedTo?: string;
  notes?: string;
  updatedBy?: string;
  timestamp: string;
}