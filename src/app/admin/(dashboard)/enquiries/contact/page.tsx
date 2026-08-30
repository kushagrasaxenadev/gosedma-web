'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Search, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  read: { label: 'Read', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  responded: { label: 'Responded', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  closed: { label: 'Closed', color: 'text-gray-700', bg: 'bg-gray-50 border-border-light' },
};

export default function ContactEnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => { fetchEnquiries(); }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    let query = supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (!error && data) setEnquiries(data as ContactEnquiry[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('contact_enquiries').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const saveNote = async (id: string) => {
    const { error } = await supabase.from('contact_enquiries').update({ admin_notes: adminNote }).eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, admin_notes: adminNote } : e));
    }
  };

  const filtered = enquiries.filter(e => {
    const term = searchTerm.toLowerCase();
    return (e.name || '').toLowerCase().includes(term) || (e.phone || '').includes(term) || (e.email || '').toLowerCase().includes(term);
  });

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    read: enquiries.filter(e => e.status === 'read').length,
    responded: enquiries.filter(e => e.status === 'responded').length,
    closed: enquiries.filter(e => e.status === 'closed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-green" />
          Contact Messages
        </h2>
        <p className="text-sm text-foreground-secondary mt-1">Manage general contact form submissions.</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'read', 'responded', 'closed'] as const).map(status => (
          <button key={status} onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${statusFilter === status ? 'bg-brand-navy text-white border-brand-navy shadow-sm' : 'bg-surface text-foreground-secondary border-border-light hover:border-brand-navy/30'}`}>
            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === status ? 'bg-white/20' : 'bg-muted'}`}>{counts[status]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
        <input type="text" placeholder="Search by name, phone or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-foreground-secondary">
              <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm font-medium">Loading messages...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-foreground-secondary">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium">No contact messages found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {filtered.map(enquiry => {
                const statusInfo = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.new;
                const isSelected = selectedEnquiry?.id === enquiry.id;
                return (
                  <button key={enquiry.id} onClick={() => { setSelectedEnquiry(enquiry); setAdminNote(enquiry.admin_notes || ''); }}
                    className={`w-full text-left p-5 hover:bg-muted/30 transition flex items-start justify-between gap-4 ${isSelected ? 'bg-brand-navy/5 dark:bg-brand-green/10 border-l-3 border-l-brand-navy' : ''}`}>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-xs text-foreground-secondary">{new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h4 className="font-semibold text-foreground truncate">{enquiry.name}</h4>
                      {enquiry.subject && <p className="text-sm text-foreground-secondary truncate">{enquiry.subject}</p>}
                      <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{enquiry.phone}</span>
                        {enquiry.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{enquiry.email}</span>}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-foreground-secondary/40 flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="bg-surface rounded-xl border border-border-light shadow-sm p-6 sticky top-6 h-fit">
          {selectedEnquiry ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">{selectedEnquiry.name}</h3>
                <p className="text-xs text-foreground-secondary mt-0.5">Submitted {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-foreground-secondary" /><a href={`tel:${selectedEnquiry.phone}`} className="hover:text-brand-navy transition">{selectedEnquiry.phone}</a></div>
                {selectedEnquiry.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-foreground-secondary" /><a href={`mailto:${selectedEnquiry.email}`} className="hover:text-brand-navy transition">{selectedEnquiry.email}</a></div>}
              </div>
              {selectedEnquiry.subject && (
                <div className="border-t border-border-light pt-4">
                  <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-sm text-foreground font-medium">{selectedEnquiry.subject}</p>
                </div>
              )}
              {selectedEnquiry.message && (
                <div className="border-t border-border-light pt-4">
                  <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              )}
              <div className="border-t border-border-light pt-4">
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button key={key} onClick={() => updateStatus(selectedEnquiry.id, key)}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg border transition ${selectedEnquiry.status === key ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current/20` : 'bg-surface border-border-light text-foreground-secondary hover:border-brand-navy/20'}`}>
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-border-light pt-4">
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Admin Notes</p>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Add internal notes..."
                  className="w-full text-sm border border-border-light rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition text-foreground placeholder:text-foreground-secondary/50" />
                <button onClick={() => saveNote(selectedEnquiry.id)} className="mt-2 w-full text-sm font-semibold bg-brand-navy text-white py-2 rounded-lg hover:bg-brand-navy-light transition">Save Notes</button>
              </div>
            </div>
          ) : (
            <div className="text-center text-foreground-secondary py-12">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium text-sm">Select a message</p>
              <p className="text-xs mt-1">Click on a message to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
