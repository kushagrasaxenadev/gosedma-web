'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Plus, Search, Edit3, Trash2, Eye, EyeOff, Star, X, Check, AlertCircle } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  category: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  pricing_mode: string;
  price: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminProgramsPage() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Martial Art',
    pricing_mode: 'enquire',
    price: '',
    short_description: '',
    description: '',
    featured: false,
    published: true,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setPrograms(data as Program[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Martial Art',
      pricing_mode: 'enquire',
      price: '',
      short_description: '',
      description: '',
      featured: false,
      published: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Program) => {
    setEditingId(p.id);
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'Martial Art',
      pricing_mode: p.pricing_mode || 'enquire',
      price: p.price ? String(p.price) : '',
      short_description: p.short_description || '',
      description: p.description || '',
      featured: !!p.featured,
      published: !!p.published,
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
      setFormError('Program title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('Program slug is required.');
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category.trim() || null,
      pricing_mode: formData.pricing_mode,
      price: formData.pricing_mode === 'exact' && formData.price ? parseFloat(formData.price) : null,
      short_description: formData.short_description.trim() || null,
      description: formData.description.trim() || null,
      featured: formData.featured,
      published: formData.published,
    };

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from('programs')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update program.');
        setFormSaving(false);
        return;
      }

      setPrograms(prev =>
        prev.map(p => (p.id === editingId ? { ...p, ...payload } : p))
      );
      setSuccessMessage('Program updated successfully!');
    } else {
      // INSERT
      const newRecord = {
        ...payload,
        sort_order: programs.length + 1,
      };

      const { data, error } = await supabase
        .from('programs')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create program.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setPrograms(prev => [...prev, data as Program]);
      } else {
        await fetchPrograms();
      }
      setSuccessMessage('New program created successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('programs')
      .update({ published: !current })
      .eq('id', id);

    if (!error) {
      setPrograms(prev =>
        prev.map(p => (p.id === id ? { ...p, published: !current } : p))
      );
      setSuccessMessage(`Program marked as ${!current ? 'Live' : 'Draft'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('programs')
      .update({ featured: !current })
      .eq('id', id);

    if (!error) {
      setPrograms(prev =>
        prev.map(p => (p.id === id ? { ...p, featured: !current } : p))
      );
    }
  };

  const deleteProgram = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (!error) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      setSuccessMessage('Program deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error deleting program: ' + error.message);
    }
  };

  const filtered = programs.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-green" />
            Training Programs
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage martial arts programs. Toggle status between Live and Draft to show/hide on the main website.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading programs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No programs found.</p>
            <p className="text-sm mt-1 mb-4">Create your first training program to get started.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border-light">
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Program
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Website Status
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map(program => (
                  <tr key={program.id} className="hover:bg-muted/20 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{program.title}</p>
                        <p className="text-xs text-foreground-secondary font-mono mt-0.5">/{program.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-foreground-secondary">
                        {program.category || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium">
                        {program.pricing_mode === 'exact' && program.price
                          ? `₹${program.price.toLocaleString('en-IN')}`
                          : program.pricing_mode === 'enquire'
                          ? 'Enquire'
                          : program.pricing_mode === 'hidden'
                          ? 'Hidden'
                          : program.pricing_mode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(program.id, program.featured)}
                        title={program.featured ? 'Featured' : 'Not Featured'}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          program.featured
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-foreground-secondary/30 hover:text-amber-500'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={program.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => togglePublished(program.id, program.published)}
                        title={program.published ? 'Click to make Draft' : 'Click to make Live'}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          program.published
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800'
                            : 'bg-gray-100 text-gray-500 border-border-light dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {program.published ? (
                          <>
                            <Eye className="w-3 h-3" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(program)}
                          className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/10 dark:hover:bg-brand-green/10 transition cursor-pointer"
                          title="Edit Program"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProgram(program.id, program.title)}
                          className="p-2 rounded-lg text-foreground-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                          title="Delete Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT PROGRAM MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit Program' : 'Add New Program'}
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
                    Program Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taekwondo"
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
                    placeholder="e.g. taekwondo"
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
                    <option value="Martial Art">Martial Art</option>
                    <option value="Striking Art">Striking Art</option>
                    <option value="Self Defence">Self Defence</option>
                    <option value="Mixed Martial Arts">Mixed Martial Arts</option>
                    <option value="Elite Sport">Elite Sport</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Pricing Mode
                  </label>
                  <select
                    value={formData.pricing_mode}
                    onChange={e => setFormData({ ...formData, pricing_mode: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  >
                    <option value="enquire">Enquire for Fees</option>
                    <option value="exact">Exact Price (₹)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {formData.pricing_mode === 'exact' && (
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="Summary for cards and previews..."
                  value={formData.short_description}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed curriculum and overview..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                  />
                  <span>Live on website (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Featured Program</span>
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
                  {formSaving ? 'Saving...' : editingId ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
