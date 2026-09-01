'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Video, Plus, Edit3, Trash2, Eye, EyeOff, Star, ExternalLink, X, Check, AlertCircle } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  thumbnail_url: string | null;
  category: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default function AdminVideosPage() {
  const supabase = createClient();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    category: 'Training',
    description: '',
    featured: false,
    published: true,
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setVideos(data as VideoItem[]);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      youtube_url: '',
      category: 'Training',
      description: '',
      featured: false,
      published: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (video: VideoItem) => {
    setEditingId(video.id);
    setFormData({
      title: video.title || '',
      youtube_url: video.youtube_url || '',
      category: video.category || 'Training',
      description: video.description || '',
      featured: !!video.featured,
      published: !!video.published,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Video title is required.');
      return;
    }
    if (!formData.youtube_url.trim()) {
      setFormError('YouTube URL is required.');
      return;
    }

    const ytId = getYouTubeId(formData.youtube_url.trim());
    const thumbnail_url = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

    setFormSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      youtube_url: formData.youtube_url.trim(),
      thumbnail_url,
      category: formData.category.trim() || null,
      description: formData.description.trim() || null,
      featured: formData.featured,
      published: formData.published,
    };

    if (editingId) {
      // UPDATE existing video
      const { error } = await supabase
        .from('videos')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        setFormError(error.message || 'Failed to update video.');
        setFormSaving(false);
        return;
      }

      setVideos(prev =>
        prev.map(v => (v.id === editingId ? { ...v, ...payload } : v))
      );
      setSuccessMessage('Video updated successfully in database!');
    } else {
      // INSERT new video
      const newRecord = {
        ...payload,
        sort_order: videos.length + 1,
      };

      const { data, error } = await supabase
        .from('videos')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        setFormError(error.message || 'Failed to create video.');
        setFormSaving(false);
        return;
      }

      if (data) {
        setVideos(prev => [...prev, data as VideoItem]);
      } else {
        await fetchVideos();
      }
      setSuccessMessage('New video added successfully!');
    }

    setFormSaving(false);
    setModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('videos')
      .update({ published: !current })
      .eq('id', id);

    if (!error) {
      setVideos(prev =>
        prev.map(v => (v.id === id ? { ...v, published: !current } : v))
      );
      setSuccessMessage(`Video status changed to ${!current ? 'Live' : 'Draft'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error updating status: ' + error.message);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('videos')
      .update({ featured: !current })
      .eq('id', id);

    if (!error) {
      setVideos(prev =>
        prev.map(v => (v.id === id ? { ...v, featured: !current } : v))
      );
    }
  };

  const deleteVideo = async (id: string, title: string) => {
    if (!confirm(`Delete video "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (!error) {
      setVideos(prev => prev.filter(v => v.id !== id));
      setSuccessMessage('Video deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      alert('Error deleting video: ' + error.message);
    }
  };

  const previewYtId = getYouTubeId(formData.youtube_url);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Video className="w-6 h-6 text-brand-green" />
            YouTube Videos
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage YouTube video embeds for the public website. Changes reflect immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {/* Notification banner */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border-light overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))
        ) : videos.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <Video className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No videos found.</p>
            <p className="text-sm mt-1 mb-4">Add your first YouTube video to display it on the website.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add First Video
            </button>
          </div>
        ) : (
          videos.map(video => {
            const ytId = getYouTubeId(video.youtube_url);
            const thumbUrl =
              video.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null);

            return (
              <div
                key={video.id}
                className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="aspect-video bg-black relative">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-navy/20 to-brand-green/10">
                      <Video className="w-12 h-12 text-white/30" />
                    </div>
                  )}

                  {/* YouTube badge overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {video.featured && (
                      <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow">
                        ★ Featured
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow ${
                        video.published ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {video.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1 line-clamp-1">{video.title}</h3>
                    <p className="text-xs text-foreground-secondary/70 truncate mb-2 font-mono">
                      {video.youtube_url}
                    </p>
                    {video.category && (
                      <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded text-foreground-secondary">
                        {video.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-border-light">
                    {/* Featured toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFeatured(video.id, video.featured)}
                      title={video.featured ? 'Featured on home' : 'Not featured'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        video.featured
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-foreground-secondary/40 hover:text-amber-500'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={video.featured ? 'currentColor' : 'none'} />
                    </button>

                    {/* Published toggle */}
                    <button
                      type="button"
                      onClick={() => togglePublished(video.id, video.published)}
                      title={video.published ? 'Click to make Draft' : 'Click to make Live'}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        video.published
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {video.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Video (Loads into modal to update URL / title) */}
                    <button
                      type="button"
                      onClick={() => openEditModal(video)}
                      title="Edit Video URL & Details"
                      className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/10 dark:hover:bg-brand-green/10 transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* View external link */}
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open on YouTube"
                      className="p-2 rounded-lg text-foreground-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <div className="flex-1" />

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteVideo(video.id, video.title)}
                      title="Delete video"
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── ADD / EDIT VIDEO MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-green" />
                {editingId ? 'Edit YouTube Video' : 'Add New YouTube Video'}
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
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Women Self Defence Masterclass in Jaipur"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  YouTube Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={formData.youtube_url}
                  onChange={e => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy font-mono text-xs"
                />
                <p className="text-[11px] text-foreground-secondary mt-1">
                  Accepts standard YouTube links or short links (youtu.be).
                </p>
              </div>

              {/* Live Preview of Thumbnail */}
              {previewYtId && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted p-2 flex items-center gap-3">
                  <img
                    src={`https://img.youtube.com/vi/${previewYtId}/mqdefault.jpg`}
                    alt="Preview"
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div className="text-xs text-foreground-secondary">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">✓ Valid YouTube Video</span>
                    <span>Video ID: {previewYtId}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  >
                    <option value="Training">Training</option>
                    <option value="Self Defence">Self Defence</option>
                    <option value="Championship">Championship</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="space-y-2 pt-5">
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
                    <span>Featured Video</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what this video demonstrates..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                />
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
                  {formSaving ? 'Saving to Database...' : editingId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
