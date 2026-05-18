import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Lead, LeadStatus, LeadSource } from '../types';

interface DashboardProps {
  onLogout: () => void;
  role: string;
}

export default function Dashboard({ onLogout, role }: DashboardProps) {
  // State for raw data and metrics
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced Filtering, Search, and Pagination State parameters
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Form states for creating a fresh lead
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('New');
  const [newSource, setNewSource] = useState<LeadSource>('Website');

  // Compute real-time analytics by scanning the current dataset array state safely
  const totalNew = Array.isArray(leads) ? leads.filter(l => l?.status === 'New').length : 0;
  const totalContacted = Array.isArray(leads) ? leads.filter(l => l?.status === 'Contacted').length : 0;
  const totalQualified = Array.isArray(leads) ? leads.filter(l => l?.status === 'Qualified').length : 0;
  
  // Calculate a conversion percentage safely to prevent Division-by-Zero errors
  const conversionRate = Array.isArray(leads) && leads.length > 0 
    ? Math.round((totalQualified / leads.length) * 100) 
    : 0;

  // Load and fetch synchronized matching datasets from our API wrapper
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build dynamic query parameter string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: sortBy,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });

      // Explicitly defined structural type mapping here to eliminate ESLint implicit any warnings
      const response = await api.get<{
        success: boolean;
        total?: number;
        leads?: Lead[];
      }>(`/leads?${queryParams.toString()}`);
      
      console.log("📡 DEBUG GIGFLOW API RESPONSE:", response);
      
      // Match the exact keys returned by your backend payload: response.leads and response.total
      if (response && response.success && Array.isArray(response.leads)) {
        setLeads(response.leads);
        
        // Explicit primitive casting to completely clear any strict type warnings on calculation
        const recordsCount: number = Number(response.total) || response.leads.length;
        setTotalRecords(recordsCount);
        
        const calculatedPages: number = Math.ceil(recordsCount / 10);
        setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
      } else {
        setLeads([]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger reload sequence automatically every time a query parameter variable mutates
  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchLeads();
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter, sourceFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leads', { name: newName, email: newEmail, status: newStatus, source: newSource });
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      fetchLeads();
    } catch (err: unknown) {
      if (err instanceof Error) alert(`Creation failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (id: string, updatedStatus: LeadStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: updatedStatus });
      fetchLeads();
    } catch (err: unknown) {
      if (err instanceof Error) alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to drop this record permanently?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err: unknown) {
      if (err instanceof Error) alert(`Deletion failed: Admin authorization required.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Upper Navigation Header bar wrapper */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">GigFlow Engine</h1>
          <p className="text-slate-400 text-sm mt-1">
            Access Tier: <span className="text-emerald-400 font-bold uppercase">{role}</span> • Dashboard Control Grid
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-950 transition-colors rounded-xl text-sm shadow-md cursor-pointer"
          >
            + Add New Lead
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 transition-colors rounded-xl text-sm border border-slate-700 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Analytics Grid Metrics Display Cards Block */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Leads</p>
          <p className="text-2xl font-black text-white mt-1">{totalRecords}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs font-bold uppercase text-blue-400 tracking-wider">New Pipeline</p>
          <p className="text-2xl font-black text-white mt-1">{totalNew}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs font-bold uppercase text-amber-400 tracking-wider">In Contact</p>
          <p className="text-2xl font-black text-white mt-1">{totalContacted}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Conversion Rate</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{conversionRate}%</p>
        </div>
      </section>

      {/* Grid Filter and Search Controls Matrix block */}
      <section className="bg-slate-800/50 border border-slate-800 rounded-2xl p-5 mb-6">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Search Query</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold cursor-pointer">Find</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lead Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as LeadStatus | ''); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lead Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value as LeadSource | ''); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Sort Chronology</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="latest">Latest Entries</option>
              <option value="oldest">Oldest Entries</option>
            </select>
          </div>
        </form>
      </section>

      {/* Main Table Interface Grid Frame */}
      <main className="bg-slate-800 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Querying active operational arrays...</div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 font-medium">⚠️ Core error reading parameters: {error}</div>
        ) : !Array.isArray(leads) || leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No matching sales documents found inside this filter frame.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Contact Identity</th>
                  <th className="p-4">Email Coordinates</th>
                  <th className="p-4">Status Pipeline State</th>
                  <th className="p-4">Acquisition Origin</th>
                  <th className="p-4 text-right">Actions Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {leads.map((lead) => (
                  lead && (
                    <tr key={lead._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="p-4 font-semibold text-white">{lead.name}</td>
                      <td className="p-4 text-slate-300">{lead.email}</td>
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-900 border focus:outline-none transition-colors cursor-pointer ${
                            lead.status === 'New' ? 'text-blue-400 border-blue-500/30 focus:border-blue-500' :
                            lead.status === 'Contacted' ? 'text-amber-400 border-amber-500/30 focus:border-amber-500' :
                            lead.status === 'Qualified' ? 'text-emerald-400 border-emerald-500/30 focus:border-emerald-500' :
                            'text-rose-400 border-rose-500/30 focus:border-rose-500'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-400 text-xs font-medium">{lead.source}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="px-2.5 py-1 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="bg-slate-900/30 border-t border-slate-700 p-4 flex justify-between items-center text-sm">
          <span className="text-slate-400 text-xs">Page {page} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </footer>
      </main>

      {/* Add Lead Popup Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Register New Sales Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value as LeadStatus)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Source</label>
                  <select value={newSource} onChange={e => setNewSource(e.target.value as LeadSource)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-sm font-bold cursor-pointer">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}