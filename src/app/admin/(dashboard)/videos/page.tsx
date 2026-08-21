'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Video, Plus, Search, Edit3, Trash2, Eye, EyeOff, Star, ExternalLink } from 'lucide-react';

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
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default function AdminVideosPage() {
  const supabase = createClient();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('videos').select('*').order('sort_order', { ascending: true });
    if (!error && data) setVideos(data as VideoItem[]);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('videos').update({ published: !current }).eq('id', id);
    if (!error) setVideos(prev => prev.map(v => v.id === id ? { ...v, published: !current } : v));
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('videos').update({ featured: !current }).eq('id', id);
    if (!error) setVideos(prev => prev.map(v => v.id === id ? { ...v, featured: !current } : v));
  };

  const deleteVideo = async (id: string, title: string) => {
    if (!confirm(`Delete video "${title}"?`)) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (!error) setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Video className="w-6 h-6 text-brand-green" />
            YouTube Videos
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage YouTube video embeds for the academy.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border-light overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4"><div className="h-5 bg-muted rounded w-2/3 mb-2" /><div className="h-4 bg-muted rounded w-1/2" /></div>
            </div>
          ))
        ) : videos.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <Video className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No videos yet.</p>
            <p className="text-sm mt-1">Add YouTube videos to showcase training sessions and events.</p>
          </div>
        ) : (
          videos.map(video => {
            const ytId = getYouTubeId(video.youtube_url);
            const thumbUrl = video.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null);
            return (
              <div key={video.id} className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden hover:shadow-md transition group">
                <div className="aspect-video bg-black relative">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-navy/20 to-brand-green/10"><Video className="w-12 h-12 text-white/30" /></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current ml-0.5"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {video.featured && <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded">★ Featured</span>}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${video.published ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {video.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-foreground mb-1 line-clamp-1">{video.title}</h3>
                  {video.category && <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded text-foreground-secondary">{video.category}</span>}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border-light">
                    <button onClick={() => toggleFeatured(video.id, video.featured)} className={`p-2 rounded-lg transition ${video.featured ? 'text-amber-500 bg-amber-50' : 'text-foreground-secondary/30 hover:text-amber-500'}`}>
                      <Star className="w-3.5 h-3.5" fill={video.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => togglePublished(video.id, video.published)} className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 transition">
                      {video.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 transition">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex-1" />
                    <button onClick={() => deleteVideo(video.id, video.title)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
