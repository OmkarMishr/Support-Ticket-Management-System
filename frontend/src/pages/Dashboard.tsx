import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketCard } from '../components/TicketCard';
import { useTickets } from '../hooks/useTickets';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { tickets, loading, refetch } = useTickets();
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search tickets
  const filteredTickets = tickets
    .filter(ticket => {
      if (filter !== 'all' && ticket.status !== filter) return false;
      
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Stats calculation
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                HelpDesk Lite
              </h1>
              <p className="text-gray-600 mt-1">Manage your support tickets efficiently</p>
            </div>
            
            {/* New Ticket Button */}
            <button 
              onClick={() => navigate('/new-ticket')}
              className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 whitespace-nowrap hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Ticket
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600', icon: '📊' },
            { label: 'Open', value: stats.open, color: 'from-orange-500 to-orange-600', icon: '⭕' },
            { label: 'In Progress', value: stats.inProgress, color: 'from-yellow-500 to-yellow-600', icon: '⚡' },
            { label: 'Resolved', value: stats.resolved, color: 'from-green-500 to-green-600', icon: '✅' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`text-3xl p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tickets by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(['all', 'open', 'in-progress', 'resolved'] as const).map(status => (
                <button
                  key={status}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filter === status
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status.replace('-', ' ').toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => { setFilter('all'); setSearchTerm(''); }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-md text-sm font-semibold transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-6">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter settings.' 
                  : "Get started by creating your first support ticket."
                }
              </p>
              <button 
                onClick={() => navigate('/new-ticket')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Create First Ticket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-semibold transition-all duration-300 hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Tickets
          </button>
        </div>
      </div>
    </div>
  );
};
