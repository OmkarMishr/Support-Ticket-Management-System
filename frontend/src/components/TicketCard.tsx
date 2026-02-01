import type { Ticket } from '../types/ticket';

interface Props {
  ticket: Ticket;
  onClick?: () => void;
}

export const TicketCard = ({ ticket, onClick }: Props) => (
  <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-lg text-gray-900">{ticket.title}</h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
      }`}>
        {ticket.priority.toUpperCase()}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>{ticket.status.replace('-', ' ').toUpperCase()}</span>
      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);
