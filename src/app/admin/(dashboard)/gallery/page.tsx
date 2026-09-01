'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Image as ImageIcon, Plus, Edit3, Trash2, Eye, EyeOff, Calendar, X, Check, AlertCircle } from 'lucide-react';

interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  album_date: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    album_date: new Date().toISOString().split('T')[0],
    published: true,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setAlbums(data as GalleryAlbum[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      cover_image_url: '',
      album_date: new Date().toISOString().split('T')[0],
      published: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (album: GalleryAlbum) => {
    setEditingId(album.id);
    setFormData({
      title: album.title || '',
      slug: album.slug || '',
      description: album.description || '',
      cover_image_url: album.cover_image_url || '',
      album_date: album.album_date ? album.album_date.split('T')[0] : new Date().toISOString().split('T')[0],
      published: !!album.published,
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
      setFormError('Album title is required.');
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
      description: formData.description.trim() || null,
      cover_image_url: formData.cover_image_url.trim() || null,
      album_date: formData.album_date || null,
      published: formData.published,
    };

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from('gallery_albums')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update album.');
        setFormSaving(false);
        return;
      }

      setAlbums(prev =>
        prev.map(a => (a.id === editingId ? { ...a, ...payload } : a))
      );
      setSuccessMessage('Album updated successfully!');
    } else {
      // INSERT
      const newRecord = {
        ...payload,
        sort_order: albums.length + 1,
      };

      const { data, error } = await supabase
        .from('gallery_albums')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create album.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setAlbums(prev => [...prev, data as GalleryAlbum]);
      } else {
        await fetchAlbums();
      }
      setSuccessMessage('New album created successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('gallery_albums')
      .update({ published: !current })
      .eq('id', id);

    if (!error) {
      setAlbums(prev =>
        prev.map(a => (a.id === id ? { ...a, published: !current } : a))
      );
      setSuccessMessage(`Album set to ${!current ? 'Live' : 'Draft'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const deleteAlbum = async (id: string, title: string) => {
    if (!confirm(`Delete album "${title}" and all its photos? This cannot be undone.`)) return;
    const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
    if (!error) {
      setAlbums(prev => prev.filter(a => a.id !== id));
      setSuccessMessage('Album deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error deleting album: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-green" />
            Photo Gallery Albums
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage photo albums and event imagery.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Album
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
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border-light overflow-hidden animate-pulse">
              <div className="h-40 bg-muted" />
              <div className="p-4">
                <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))
        ) : albums.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No albums yet.</p>
            <p className="text-sm mt-1 mb-4">Create your first photo album to showcase academy events.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Album
            </button>
          </div>
        ) : (
          albums.map(album => (
            <div
              key={album.id}
              className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex items-center justify-center relative overflow-hidden">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-foreground-secondary/20" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow ${
                        album.published ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {album.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-heading font-bold text-foreground mb-1">{album.title}</h3>
                  {album.album_date && (
                    <p className="text-xs text-foreground-secondary flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(album.album_date).toLocaleDateString('en-IN')}
                    </p>
                  )}
                  {album.description && (
                    <p className="text-xs text-foreground-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center gap-2 pt-3 border-t border-border-light">
                  <button
                    type="button"
                    onClick={() => togglePublished(album.id, album.published)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-brand-navy dark:text-brand-green-light bg-brand-navy/5 dark:bg-brand-green/10 hover:bg-brand-navy/10 dark:hover:bg-brand-green/20 transition cursor-pointer"
                  >
                    {album.published ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(album)}
                    className="flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 dark:hover:bg-brand-green/10 transition cursor-pointer"
                    title="Edit Album"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAlbum(album.id, album.title)}
                    className="flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-lg text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition cursor-pointer"
                    title="Delete Album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── ADD / EDIT ALBUM MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit Album' : 'Create New Album'}
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
                    Album Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Championship 2026"
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
                    placeholder="e.g. national-championship-2026"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
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
                  value={formData.cover_image_url}
                  onChange={e => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Album Date
                </label>
                <input
                  type="date"
                  value={formData.album_date}
                  onChange={e => setFormData({ ...formData, album_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about the event, location, participants..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
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
                  {formSaving ? 'Saving...' : editingId ? 'Update Album' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
