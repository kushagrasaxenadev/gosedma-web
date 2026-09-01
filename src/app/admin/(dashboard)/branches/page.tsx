'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Plus, Edit3, Trash2, Eye, EyeOff, Phone, Mail, MessageCircle, X, Check, AlertCircle } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminBranchesPage() {
  const supabase = createClient();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    address: '',
    city: 'Jaipur',
    phone: '',
    whatsapp: '',
    email: '',
    published: true,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setBranches(data as Branch[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      address: '',
      city: 'Jaipur',
      phone: '+91-9999999999',
      whatsapp: '919999999999',
      email: 'info@gosedma.com',
      published: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (b: Branch) => {
    setEditingId(b.id);
    setFormData({
      name: b.name || '',
      slug: b.slug || '',
      address: b.address || '',
      city: b.city || 'Jaipur',
      phone: b.phone || '',
      whatsapp: b.whatsapp || '',
      email: b.email || '',
      published: !!b.published,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Branch name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('URL slug is required.');
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      address: formData.address.trim() || null,
      city: formData.city.trim() || 'Jaipur',
      phone: formData.phone.trim() || null,
      whatsapp: formData.whatsapp.trim() || null,
      email: formData.email.trim() || null,
      published: formData.published,
    };

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from('branches')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update branch.');
        setFormSaving(false);
        return;
      }

      setBranches(prev =>
        prev.map(b => (b.id === editingId ? { ...b, ...payload } : b))
      );
      setSuccessMessage('Branch updated successfully in database!');
    } else {
      // INSERT
      const newRecord = {
        ...payload,
        sort_order: branches.length + 1,
      };

      const { data, error } = await supabase
        .from('branches')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create branch.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setBranches(prev => [...prev, data as Branch]);
      } else {
        await fetchBranches();
      }
      setSuccessMessage('New branch created successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('branches')
      .update({ published: !current })
      .eq('id', id);

    if (!error) {
      setBranches(prev =>
        prev.map(b => (b.id === id ? { ...b, published: !current } : b))
      );
      setSuccessMessage(`Branch set to ${!current ? 'Live' : 'Draft'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const deleteBranch = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('branches').delete().eq('id', id);
    if (!error) {
      setBranches(prev => prev.filter(b => b.id !== id));
      setSuccessMessage('Branch deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error deleting branch: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-green" />
            Academy Branches
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage training locations and contact details. Set status to Draft to hide a branch from public view.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border-light p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-2/3 mb-4" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))
        ) : branches.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No branches found.</p>
            <p className="text-sm mt-1 mb-4">Add your first branch location to display it on the website.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Branch
            </button>
          </div>
        ) : (
          branches.map(branch => (
            <div
              key={branch.id}
              className="bg-surface rounded-xl border border-border-light shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-foreground">{branch.name}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      branch.published
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {branch.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-foreground-secondary mb-3 leading-relaxed">
                  {branch.address || 'Address not specified'}
                </p>

                <div className="space-y-1.5 text-xs text-foreground-secondary">
                  {branch.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-brand-green" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                  {branch.whatsapp && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{branch.whatsapp}</span>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-brand-navy dark:text-brand-green-light" />
                      <span>{branch.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border-light">
                <button
                  type="button"
                  onClick={() => togglePublished(branch.id, branch.published)}
                  title={branch.published ? 'Set to Draft' : 'Set to Live'}
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    branch.published
                      ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {branch.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(branch)}
                  className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/10 dark:hover:bg-brand-green/10 transition cursor-pointer"
                  title="Edit Branch"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => deleteBranch(branch.id, branch.name)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  title="Delete Branch"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── ADD / EDIT BRANCH MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit Branch' : 'Add New Branch'}
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
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malviya Nagar"
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
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
                    placeholder="e.g. malviya-nagar"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Full Address
                </label>
                <input
                  type="text"
                  placeholder="Street, Landmark, Area, Jaipur"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91-9999999999"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    WhatsApp (Digits only)
                  </label>
                  <input
                    type="text"
                    placeholder="919999999999"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="branch@gosedma.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                  />
                  <span>Live on website (Published)</span>
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
                  {formSaving ? 'Saving...' : editingId ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
