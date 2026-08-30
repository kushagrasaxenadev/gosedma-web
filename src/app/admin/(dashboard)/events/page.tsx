'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Plus, Search, Edit3, Trash2, Eye, EyeOff, Star, MapPin } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  event_date: string | null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  category: string | null;
  featured: boolean;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-50 text-muted-foreground border-border-light' },
  published: { label: 'Published', color: 'bg-green-50 text-green-700 border-green-200' },
  archived: { label: 'Archived', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchEvents(); }, [statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase.from('events').select('*').order('event_date', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (!error && data) setEvents(data as EventItem[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('events').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('events').update({ featured: !current }).eq('id', id);
    if (!error) setEvents(prev => prev.map(e => e.id === id ? { ...e, featured: !current } : e));
  };

  const deleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-green" />
            Academy Events
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage upcoming and past events.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'draft', 'published', 'archived'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-surface text-foreground-secondary border-border-light hover:border-brand-navy/30'}`}>
            {s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No events found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {events.map(event => {
              const statusInfo = STATUS_MAP[event.status] || STATUS_MAP.draft;
              const eventDate = event.event_date || event.start_date;
              return (
                <div key={event.id} className="p-5 hover:bg-muted/20 transition flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {event.image_url ? <img src={event.image_url} alt="" className="w-full h-full object-cover" /> : <Calendar className="w-6 h-6 text-foreground-secondary/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusInfo.color}`}>{statusInfo.label}</span>
                      {event.featured && <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />}
                    </div>
                    <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-foreground-secondary mt-1">
                      {eventDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      {event.category && <span className="bg-muted px-1.5 py-0.5 rounded">{event.category}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleFeatured(event.id, event.featured)} className={`p-2 rounded-lg transition ${event.featured ? 'text-amber-500' : 'text-foreground-secondary/30 hover:text-amber-500'}`}>
                      <Star className="w-4 h-4" fill={event.featured ? 'currentColor' : 'none'} />
                    </button>
                    {event.status === 'draft' ? (
                      <button onClick={() => updateStatus(event.id, 'published')} className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition"><Eye className="w-4 h-4" /></button>
                    ) : (
                      <button onClick={() => updateStatus(event.id, 'draft')} className="p-2 rounded-lg text-foreground-secondary hover:bg-muted transition"><EyeOff className="w-4 h-4" /></button>
                    )}
                    <button className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 dark:bg-brand-green/10 transition"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(event.id, event.title)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
