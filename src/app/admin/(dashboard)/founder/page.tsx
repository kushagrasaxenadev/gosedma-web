'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Award, Plus, Edit3, Trash2, Eye, EyeOff, Star, CheckCircle, AlertCircle, X, Check } from 'lucide-react';

interface FounderCredential {
  id: string;
  title: string;
  credential_type: string;
  event_name: string | null;
  result: string | null;
  year: string | null;
  location: string | null;
  description: string | null;
  verification_status: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const CREDENTIAL_TYPES: Record<string, { label: string; icon: string }> = {
  award: { label: 'Award', icon: '🏆' },
  championship: { label: 'Championship', icon: '🥇' },
  certification: { label: 'Certification', icon: '📜' },
  recognition: { label: 'Recognition', icon: '🌟' },
  media: { label: 'Media Feature', icon: '📺' },
};

const VERIFICATION_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Unverified', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-border' },
  client_verified: { label: 'Client Verified', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200' },
  source_verified: { label: 'Source Verified', color: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200' },
};

export default function AdminFounderPage() {
  const supabase = createClient();
  const [credentials, setCredentials] = useState<FounderCredential[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    credential_type: 'award',
    event_name: '',
    result: '',
    year: String(new Date().getFullYear()),
    location: 'Jaipur, India',
    description: '',
    verification_status: 'source_verified',
    featured: false,
    published: true,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('founder_credentials')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setCredentials(data as FounderCredential[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      credential_type: 'award',
      event_name: '',
      result: 'Winner / Gold Medal',
      year: String(new Date().getFullYear()),
      location: 'Jaipur, India',
      description: '',
      verification_status: 'source_verified',
      featured: false,
      published: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cred: FounderCredential) => {
    setEditingId(cred.id);
    setFormData({
      title: cred.title || '',
      credential_type: cred.credential_type || 'award',
      event_name: cred.event_name || '',
      result: cred.result || '',
      year: cred.year || String(new Date().getFullYear()),
      location: cred.location || '',
      description: cred.description || '',
      verification_status: cred.verification_status || 'source_verified',
      featured: !!cred.featured,
      published: !!cred.published,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Credential title is required.');
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      credential_type: formData.credential_type,
      event_name: formData.event_name.trim() || null,
      result: formData.result.trim() || null,
      year: formData.year.trim() || null,
      location: formData.location.trim() || null,
      description: formData.description.trim() || null,
      verification_status: formData.verification_status,
      featured: formData.featured,
      published: formData.published,
    };

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from('founder_credentials')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update credential.');
        setFormSaving(false);
        return;
      }

      setCredentials(prev =>
        prev.map(c => (c.id === editingId ? { ...c, ...payload } : c))
      );
      setSuccessMessage('Credential updated successfully!');
    } else {
      // INSERT
      const newRecord = {
        ...payload,
        sort_order: credentials.length + 1,
      };

      const { data, error } = await supabase
        .from('founder_credentials')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create credential.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setCredentials(prev => [...prev, data as FounderCredential]);
      } else {
        await fetchCredentials();
      }
      setSuccessMessage('New credential added successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('founder_credentials')
      .update({ published: !current })
      .eq('id', id);

    if (!error) {
      setCredentials(prev =>
        prev.map(c => (c.id === id ? { ...c, published: !current } : c))
      );
      setSuccessMessage(`Credential set to ${!current ? 'Live' : 'Draft'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('founder_credentials')
      .update({ featured: !current })
      .eq('id', id);

    if (!error) {
      setCredentials(prev =>
        prev.map(c => (c.id === id ? { ...c, featured: !current } : c))
      );
      setSuccessMessage(`Credential ${!current ? 'marked as Featured' : 'unfeatured'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating featured status: ' + error.message);
    }
  };

  const deleteCredential = async (id: string, title: string) => {
    if (!confirm(`Delete credential "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('founder_credentials').delete().eq('id', id);
    if (!error) {
      setCredentials(prev => prev.filter(c => c.id !== id));
      setSuccessMessage('Credential deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error deleting credential: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-green" />
            Founder Bio & Awards
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage Richa Gaur&apos;s credentials, awards, and milestones.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Credential
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading credentials...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <Award className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No credentials found.</p>
            <p className="text-sm mt-1 mb-4">Add founder awards, certifications, and achievements.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add First Credential
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {credentials.map(cred => {
              const typeInfo = CREDENTIAL_TYPES[cred.credential_type] || { label: cred.credential_type, icon: '📋' };
              const verifyInfo = VERIFICATION_STATUS[cred.verification_status] || VERIFICATION_STATUS.draft;

              return (
                <div
                  key={cred.id}
                  className={`p-5 hover:bg-muted/20 transition flex items-center gap-4 ${
                    cred.featured
                      ? 'bg-amber-500/5 border-l-4 border-l-amber-500'
                      : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex items-center justify-center text-xl flex-shrink-0">
                    {typeInfo.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{typeInfo.label}</span>
                      {cred.year && (
                        <span className="text-xs text-foreground-secondary font-mono">({cred.year})</span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${verifyInfo.color}`}>
                        {verifyInfo.label}
                      </span>
                      {cred.featured && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          cred.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {cred.published ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    <h4 className="font-semibold text-foreground truncate">{cred.title}</h4>

                    {(cred.event_name || cred.result || cred.location) && (
                      <p className="text-xs text-foreground-secondary mt-0.5">
                        {[cred.event_name, cred.result, cred.location].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    {cred.description && (
                      <p className="text-xs text-foreground-secondary/70 mt-1 line-clamp-2 leading-relaxed">
                        {cred.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Featured toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFeatured(cred.id, cred.featured)}
                      title={cred.featured ? 'Remove featured highlight' : 'Highlight as featured'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        cred.featured
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-foreground-secondary/40 hover:text-amber-500 hover:bg-muted'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={cred.featured ? 'currentColor' : 'none'} />
                    </button>

                    {/* Published toggle */}
                    <button
                      type="button"
                      onClick={() => togglePublished(cred.id, cred.published)}
                      title={cred.published ? 'Set to Draft' : 'Set to Live'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        cred.published
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {cred.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Credential */}
                    <button
                      type="button"
                      onClick={() => openEditModal(cred)}
                      className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-muted transition cursor-pointer"
                      title="Edit Credential"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteCredential(cred.id, cred.title)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                      title="Delete Credential"
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

      {/* ─── ADD / EDIT CREDENTIAL MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit Credential' : 'Add Founder Credential'}
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

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Credential / Award Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Martial Arts Gold Medalist"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.credential_type}
                    onChange={e => setFormData({ ...formData, credential_type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  >
                    <option value="award">Award</option>
                    <option value="championship">Championship</option>
                    <option value="certification">Certification</option>
                    <option value="recognition">Recognition</option>
                    <option value="media">Media Feature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Event / Organiser Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All India Taekwondo Federation"
                    value={formData.event_name}
                    onChange={e => setFormData({ ...formData, event_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Result / Rank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Medalist / 1st Place"
                    value={formData.result}
                    onChange={e => setFormData({ ...formData, result: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan, India"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief details about the accomplishment or certification..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                  />
                  <span>Live on website (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-amber-600 dark:text-amber-400">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>★ Featured Highlight</span>
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
                  {formSaving ? 'Saving...' : editingId ? 'Update Credential' : 'Add Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
