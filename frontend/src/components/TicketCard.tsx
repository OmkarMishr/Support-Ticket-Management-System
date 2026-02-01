import type { Ticket } from '../types/ticket';

interface Props {
  ticket: Ticket;
  onClick?: () => void;
}

export const TicketCard = ({ ticket, onClick }: Props) => (
  <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={onClick}>
    {/* Ticket Number Badge */}
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-indigo-600">
        {ticket.title}
      </h3>
      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
        #{ticket.ticketNumber}
      </span>
    </div>
    
    <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
    
    <div className="flex flex-wrap gap-2 mb-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-green-100 text-green-800'
      }`}>
        {ticket.priority.toUpperCase()}
      </span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
        ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {ticket.status.replace('-', ' ')}
      </span>
    </div>
    
    {ticket.assignedTo && (
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
        Assigned to Agent
      </div>
    )}
    
    <div className="text-xs text-gray-400">
      {new Date(ticket.updatedAt).toLocaleDateString()}
    </div>
  </div>
);

