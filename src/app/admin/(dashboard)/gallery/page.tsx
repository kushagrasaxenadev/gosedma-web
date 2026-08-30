'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Image as ImageIcon, Plus, Search, Edit3, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';

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

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery_albums').select('*').order('sort_order', { ascending: true });
    if (!error && data) setAlbums(data as GalleryAlbum[]);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('gallery_albums').update({ published: !current }).eq('id', id);
    if (!error) setAlbums(prev => prev.map(a => a.id === id ? { ...a, published: !current } : a));
  };

  const deleteAlbum = async (id: string, title: string) => {
    if (!confirm(`Delete album "${title}" and all its photos? This cannot be undone.`)) return;
    const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
    if (!error) setAlbums(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-green" />
            Photo Gallery
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage photo albums and media with consent controls.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border-light overflow-hidden animate-pulse">
              <div className="h-40 bg-muted" />
              <div className="p-4"><div className="h-5 bg-muted rounded w-2/3 mb-2" /><div className="h-4 bg-muted rounded w-1/2" /></div>
            </div>
          ))
        ) : albums.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No albums yet.</p>
            <p className="text-sm mt-1">Create your first photo album to showcase academy events.</p>
          </div>
        ) : (
          albums.map(album => (
            <div key={album.id} className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden hover:shadow-md transition group">
              <div className="h-40 bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex items-center justify-center relative">
                {album.cover_image_url ? (
                  <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-foreground-secondary/20" />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${album.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-muted-foreground border-border-light'}`}>
                    {album.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-foreground mb-1">{album.title}</h3>
                {album.album_date && <p className="text-xs text-foreground-secondary flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(album.album_date).toLocaleDateString('en-IN')}</p>}
                {album.description && <p className="text-xs text-foreground-secondary mt-1.5 line-clamp-2">{album.description}</p>}
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border-light">
                  <button onClick={() => togglePublished(album.id, album.published)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-brand-navy dark:text-brand-green-light bg-brand-navy/5 dark:bg-brand-green/10 hover:bg-brand-navy/10 dark:bg-brand-green/10 transition">
                    {album.published ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                  </button>
                  <button className="flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 dark:bg-brand-green/10 transition">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAlbum(album.id, album.title)} className="flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
