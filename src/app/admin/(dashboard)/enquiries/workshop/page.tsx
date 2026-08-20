'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Search, Phone, Mail, Building2, ArrowUpRight, MessageSquare, Calendar, Users } from 'lucide-react';

interface WorkshopEnquiry {
  id: string;
  institution_name: string | null;
  organization_name: string | null;
  institution_type: string | null;
  contact_person: string;
  designation: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  student_grade_range: string | null;
  participant_count: number | null;
  preferred_date: string | null;
  preferred_duration: string | null;
  venue: string | null;
  workshop_type: string | null;
  goals: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  follow_up_date: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Contacted', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  qualified: { label: 'Qualified', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  proposal_sent: { label: 'Proposal Sent', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  negotiating: { label: 'Negotiating', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  booked: { label: 'Booked', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  completed: { label: 'Completed', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  lost: { label: 'Lost', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

export default function WorkshopEnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<WorkshopEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<WorkshopEnquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => { fetchEnquiries(); }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    let query = supabase.from('workshop_enquiries').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (!error && data) setEnquiries(data as WorkshopEnquiry[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('workshop_enquiries').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const saveNote = async (id: string) => {
    const { error } = await supabase.from('workshop_enquiries').update({ admin_notes: adminNote, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) setEnquiries(prev => prev.map(e => e.id === id ? { ...e, admin_notes: adminNote } : e));
  };

  const filtered = enquiries.filter(e => {
    const term = searchTerm.toLowerCase();
    const orgName = e.organization_name || e.institution_name || '';
    return orgName.toLowerCase().includes(term) || (e.contact_person || '').toLowerCase().includes(term) || (e.phone || '').includes(term);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-brand-deep-navy flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-green" />
          Workshop Requests
        </h2>
        <p className="text-sm text-foreground-secondary mt-1">Manage school & corporate workshop enquiry pipeline.</p>
      </div>

      {/* Status Tabs — scrollable for many statuses */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', ...Object.keys(STATUS_CONFIG)] as const).map(status => (
          <button key={status} onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${statusFilter === status ? 'bg-brand-navy text-white border-brand-navy shadow-sm' : 'bg-white text-foreground-secondary border-border-light hover:border-brand-navy/30'}`}>
            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${statusFilter === status ? 'bg-white/20' : 'bg-muted'}`}>
              {status === 'all' ? enquiries.length : enquiries.filter(e => e.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
        <input type="text" placeholder="Search by organization, contact or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-foreground-secondary">
              <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm font-medium">Loading workshop requests...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-foreground-secondary">
              <FileText className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium">No workshop requests found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {filtered.map(enquiry => {
                const orgName = enquiry.organization_name || enquiry.institution_name || 'Unknown Organization';
                const statusInfo = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.new;
                const isSelected = selectedEnquiry?.id === enquiry.id;
                return (
                  <button key={enquiry.id} onClick={() => { setSelectedEnquiry(enquiry); setAdminNote(enquiry.admin_notes || ''); }}
                    className={`w-full text-left p-5 hover:bg-muted/30 transition flex items-start justify-between gap-4 ${isSelected ? 'bg-brand-navy/5 border-l-3 border-l-brand-navy' : ''}`}>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-xs text-foreground-secondary">{new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h4 className="font-semibold text-brand-deep-navy truncate">{orgName}</h4>
                      <p className="text-sm text-foreground-secondary truncate">Contact: {enquiry.contact_person}{enquiry.designation ? ` (${enquiry.designation})` : ''}</p>
                      <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                        {enquiry.workshop_type && <span className="font-medium text-brand-navy">{enquiry.workshop_type}</span>}
                        {enquiry.participant_count && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{enquiry.participant_count} participants</span>}
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
        <div className="bg-white rounded-xl border border-border-light shadow-sm p-6 sticky top-6 h-fit">
          {selectedEnquiry ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-brand-deep-navy">{selectedEnquiry.organization_name || selectedEnquiry.institution_name}</h3>
                <p className="text-xs text-foreground-secondary mt-0.5">Submitted {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-foreground-secondary" />{selectedEnquiry.contact_person}{selectedEnquiry.designation ? ` — ${selectedEnquiry.designation}` : ''}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-foreground-secondary" /><a href={`tel:${selectedEnquiry.phone}`} className="hover:text-brand-navy">{selectedEnquiry.phone}</a></div>
                {selectedEnquiry.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-foreground-secondary" /><a href={`mailto:${selectedEnquiry.email}`} className="hover:text-brand-navy">{selectedEnquiry.email}</a></div>}
              </div>
              <div className="space-y-2 text-sm border-t border-border-light pt-4">
                {selectedEnquiry.workshop_type && <div><span className="font-medium text-foreground-secondary">Type:</span> <span className="text-foreground">{selectedEnquiry.workshop_type}</span></div>}
                {selectedEnquiry.institution_type && <div><span className="font-medium text-foreground-secondary">Institution:</span> <span className="text-foreground">{selectedEnquiry.institution_type}</span></div>}
                {selectedEnquiry.city && <div><span className="font-medium text-foreground-secondary">City:</span> <span className="text-foreground">{selectedEnquiry.city}</span></div>}
                {selectedEnquiry.participant_count && <div><span className="font-medium text-foreground-secondary">Participants:</span> <span className="text-foreground">{selectedEnquiry.participant_count}</span></div>}
                {selectedEnquiry.preferred_date && <div><span className="font-medium text-foreground-secondary">Preferred Date:</span> <span className="text-foreground">{new Date(selectedEnquiry.preferred_date).toLocaleDateString('en-IN')}</span></div>}
                {selectedEnquiry.preferred_duration && <div><span className="font-medium text-foreground-secondary">Duration:</span> <span className="text-foreground">{selectedEnquiry.preferred_duration}</span></div>}
                {selectedEnquiry.venue && <div><span className="font-medium text-foreground-secondary">Venue:</span> <span className="text-foreground">{selectedEnquiry.venue}</span></div>}
              </div>
              {(selectedEnquiry.goals || selectedEnquiry.message) && (
                <div className="border-t border-border-light pt-4 space-y-3">
                  {selectedEnquiry.goals && <div><p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1">Goals</p><p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{selectedEnquiry.goals}</p></div>}
                  {selectedEnquiry.message && <div><p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1">Message</p><p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{selectedEnquiry.message}</p></div>}
                </div>
              )}
              <div className="border-t border-border-light pt-4">
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Pipeline Status</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button key={key} onClick={() => updateStatus(selectedEnquiry.id, key)}
                      className={`text-[10px] font-semibold py-1.5 px-2 rounded-lg border transition ${selectedEnquiry.status === key ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current/20` : 'bg-white border-border-light text-foreground-secondary hover:border-brand-navy/20'}`}>
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
              <FileText className="w-8 h-8 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium text-sm">Select a request</p>
              <p className="text-xs mt-1">Click on a workshop request to view details and manage pipeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
