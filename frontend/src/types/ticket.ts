export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {  
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}
