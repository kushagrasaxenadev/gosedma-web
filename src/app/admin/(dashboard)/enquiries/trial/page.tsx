'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserCheck, Search, Download, Clock, 
  Phone, Mail, MapPin, MessageSquare, Calendar,
  ArrowUpRight
} from 'lucide-react';

interface TrialEnquiry {
  id: string;
  name: string;
  age_group: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  interested_program: string | null;
  experience_level: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  student_name?: string;
  guardian_name?: string;
  selected_program?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Contacted', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  converted: { label: 'Converted', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  lost: { label: 'Lost', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

export default function TrialEnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<TrialEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<TrialEnquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    let query = supabase
      .from('trial_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setEnquiries(data as TrialEnquiry[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('trial_enquiries')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setEnquiries(prev =>
        prev.map(e => e.id === id ? { ...e, status: newStatus } : e)
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const saveNote = async (id: string) => {
    const { error } = await supabase
      .from('trial_enquiries')
      .update({ admin_notes: adminNote, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setEnquiries(prev =>
        prev.map(e => e.id === id ? { ...e, admin_notes: adminNote } : e)
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, admin_notes: adminNote } : null);
      }
    }
  };

  const filtered = enquiries.filter(e => {
    const name = e.student_name || e.name || '';
    const phone = e.phone || '';
    const email = e.email || '';
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || phone.includes(term) || email.toLowerCase().includes(term);
  });

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
    lost: enquiries.filter(e => e.status === 'lost').length,
  };

  const exportCSV = () => {
    const cols = ['Name', 'Phone', 'WhatsApp', 'Email', 'Program', 'Age Group', 'Experience', 'Status', 'Date', 'Notes'];
    const rows = filtered.map(e => [
      e.student_name || e.name || '',
      e.phone || '',
      e.whatsapp || '',
      e.email || '',
      e.selected_program || e.interested_program || '',
      e.age_group || '',
      e.experience_level || '',
      e.status || '',
      e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '',
      (e.admin_notes || '').replace(/,/g, ';'),
    ]);
    const csv = [cols, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-enquiries-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-green" />
            Trial Class Bookings
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage free trial class enquiries and convert leads.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border-light dark:border-border bg-surface dark:bg-surface hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
        >
          <Download className="w-4 h-4 text-brand-green" />
          Export CSV ({filtered.length})
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'contacted', 'converted', 'lost'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
              statusFilter === status
                ? 'bg-brand-navy dark:bg-brand-green text-white border-transparent shadow-sm'
                : 'bg-surface dark:bg-surface text-foreground-secondary border-border-light dark:border-border hover:border-brand-navy/30 dark:hover:border-brand-green/40'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              statusFilter === status ? 'bg-surface/20' : 'bg-muted'
            }`}>
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="form-input pl-10 py-2.5 text-sm"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiry List */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border-light dark:border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-foreground-secondary">
              <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm font-medium">Loading enquiries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-foreground-secondary">
              <UserCheck className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium">No trial enquiries found.</p>
              <p className="text-sm mt-1">Enquiries from the trial booking form will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {filtered.map(enquiry => {
                const displayName = enquiry.student_name || enquiry.name || 'Unknown';
                const statusInfo = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.new;
                const isSelected = selectedEnquiry?.id === enquiry.id;

                return (
                  <button
                    key={enquiry.id}
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      setAdminNote(enquiry.admin_notes || '');
                    }}
                    className={`w-full text-left p-5 hover:bg-muted/30 transition flex items-start justify-between gap-4 ${
                      isSelected ? 'bg-brand-navy/5 dark:bg-brand-green/10 border-l-3 border-l-brand-navy' : ''
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-foreground-secondary">
                          {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground truncate">{displayName}</h4>
                      <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{enquiry.phone}</span>
                        {enquiry.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{enquiry.email}</span>}
                      </div>
                      {(enquiry.selected_program || enquiry.interested_program) && (
                        <p className="text-xs text-brand-navy dark:text-brand-green-light font-medium">
                          Program: {enquiry.selected_program || enquiry.interested_program}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-foreground-secondary/40 flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-surface rounded-xl border border-border-light shadow-sm p-6 sticky top-6 h-fit">
          {selectedEnquiry ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  {selectedEnquiry.student_name || selectedEnquiry.name}
                </h3>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Submitted {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-foreground-secondary" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-brand-navy transition">{selectedEnquiry.phone}</a>
                </div>
                {selectedEnquiry.email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-foreground-secondary" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-brand-navy transition">{selectedEnquiry.email}</a>
                  </div>
                )}
                {selectedEnquiry.guardian_name && (
                  <div className="flex items-center gap-2 text-foreground">
                    <UserCheck className="w-4 h-4 text-foreground-secondary" />
                    Guardian: {selectedEnquiry.guardian_name}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm border-t border-border-light pt-4">
                {(selectedEnquiry.selected_program || selectedEnquiry.interested_program) && (
                  <div><span className="font-medium text-foreground-secondary">Program:</span> <span className="text-foreground">{selectedEnquiry.selected_program || selectedEnquiry.interested_program}</span></div>
                )}
                {selectedEnquiry.age_group && (
                  <div><span className="font-medium text-foreground-secondary">Age Group:</span> <span className="text-foreground">{selectedEnquiry.age_group}</span></div>
                )}
                {selectedEnquiry.experience_level && (
                  <div><span className="font-medium text-foreground-secondary">Experience:</span> <span className="text-foreground">{selectedEnquiry.experience_level}</span></div>
                )}
                {selectedEnquiry.preferred_time && (
                  <div><span className="font-medium text-foreground-secondary">Preferred Time:</span> <span className="text-foreground">{selectedEnquiry.preferred_time}</span></div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="border-t border-border-light pt-4">
                  <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{selectedEnquiry.message}</p>
                </div>
              )}

              {/* Status Change */}
              <div className="border-t border-border-light pt-4">
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedEnquiry.id, key)}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg border transition ${
                        selectedEnquiry.status === key
                          ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current/20`
                          : 'bg-surface border-border-light text-foreground-secondary hover:border-brand-navy/20'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="border-t border-border-light pt-4">
                <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Admin Notes</p>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add internal notes about this lead..."
                  className="w-full text-sm border border-border-light rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition text-foreground placeholder:text-foreground-secondary/50"
                />
                <button
                  onClick={() => saveNote(selectedEnquiry.id)}
                  className="mt-2 w-full text-sm font-semibold bg-brand-navy text-white py-2 rounded-lg hover:bg-brand-navy-light transition"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-foreground-secondary py-12">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-foreground-secondary/30" />
              <p className="font-medium text-sm">Select an enquiry</p>
              <p className="text-xs mt-1">Click on a lead from the list to view details and manage status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
