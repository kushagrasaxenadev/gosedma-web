'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Plus, Edit3, Trash2, Eye, EyeOff, Star, MapPin, X, Check, AlertCircle } from 'lucide-react';

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

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Championship',
    event_date: new Date().toISOString().split('T')[0],
    summary: '',
    image_url: '',
    status: 'published',
    featured: false,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase.from('events').select('*').order('event_date', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (!error && data) setEvents(data as EventItem[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Championship',
      event_date: new Date().toISOString().split('T')[0],
      summary: '',
      image_url: '',
      status: 'published',
      featured: false,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: EventItem) => {
    setEditingId(item.id);
    const dateVal = item.event_date || item.start_date;
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      category: item.category || 'Championship',
      event_date: dateVal ? dateVal.split('T')[0] : new Date().toISOString().split('T')[0],
      summary: item.summary || '',
      image_url: item.image_url || '',
      status: item.status || 'published',
      featured: !!item.featured,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Event title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('URL slug is required.');
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category.trim() || null,
      event_date: formData.event_date || null,
      start_date: formData.event_date || null,
      summary: formData.summary.trim() || null,
      image_url: formData.image_url.trim() || null,
      status: formData.status,
      featured: formData.featured,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update event.');
        setFormSaving(false);
        return;
      }

      setEvents(prev =>
        prev.map(item => (item.id === editingId ? { ...item, ...payload } : item))
      );
      setSuccessMessage('Event updated successfully!');
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create event.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setEvents(prev => [data as EventItem, ...prev]);
      } else {
        await fetchEvents();
      }
      setSuccessMessage('New event created successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: newStatus } : e)));
      setSuccessMessage(`Event status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ featured: !current, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setEvents(prev => prev.map(e => (e.id === id ? { ...e, featured: !current } : e)));
      setSuccessMessage(`Event ${!current ? 'marked as featured' : 'unfeatured'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const deleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id));
      setSuccessMessage('Event deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-green" />
            Academy Events
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage upcoming championships, belt graduations, and training camps.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex gap-2">
        {['all', 'draft', 'published', 'archived'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
              statusFilter === s
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-surface text-foreground-secondary border-border-light hover:border-brand-navy/30'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No events found.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {events.map(event => {
              const statusInfo = STATUS_MAP[event.status] || STATUS_MAP.draft;
              const eventDate = event.event_date || event.start_date;
              return (
                <div key={event.id} className="p-5 hover:bg-muted/20 transition flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {event.image_url ? (
                      <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="w-6 h-6 text-foreground-secondary/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {event.featured && <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />}
                    </div>
                    <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-foreground-secondary mt-1">
                      {eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {event.category && <span className="bg-muted px-1.5 py-0.5 rounded">{event.category}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(event.id, event.featured)}
                      title={event.featured ? 'Remove featured' : 'Mark as featured'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        event.featured
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-foreground-secondary/40 hover:text-amber-500 hover:bg-muted'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={event.featured ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(event.id, event.status === 'published' ? 'draft' : 'published')}
                      title={event.status === 'published' ? 'Set to Draft' : 'Set to Published'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        event.status === 'published'
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {event.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(event)}
                      className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-muted transition cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteEvent(event.id, event.title)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT EVENT MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-foreground-secondary hover:bg-muted transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Taekwondo Championship"
                    value={formData.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. state-taekwondo-championship"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  >
                    <option value="Championship">Championship</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Graduation">Belt Graduation</option>
                    <option value="Camp">Summer Camp</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or public image URL"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Summary / Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Event venue, reporting time, registration rules..."
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.status === 'published'}
                    onChange={e => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                    className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                  />
                  <span>Live on website (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-amber-600 dark:text-amber-400">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>★ Featured Event</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:bg-muted rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-navy hover:bg-brand-navy-light rounded-lg transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {formSaving ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
