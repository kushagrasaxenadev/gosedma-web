import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Video as VideoIcon, Play, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Videos',
  description: 'GOSEDMA training videos, technique demonstrations, competition highlights, and academy events.',
};

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default async function VideosPage() {
  const supabase = await createClient();

  // ONLY fetch published videos — drafts are strictly excluded!
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  const videoList = videos || [];

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-20 relative z-10">
          <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
            Videos & Highlights
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
            Academy Video Gallery
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Watch live training sessions, self-defence masterclasses, championships, and workshops led by Richa Gaur.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {videoList.length === 0 ? (
            <div className="card p-12 text-center max-w-xl mx-auto">
              <VideoIcon className="w-12 h-12 text-brand-navy dark:text-brand-green mx-auto mb-4 opacity-50" />
              <h2 className="font-heading font-bold text-2xl text-foreground mb-2">No Videos Published Yet</h2>
              <p className="text-foreground-secondary text-sm">
                Check back soon for new technique masterclasses and event highlights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(videoList as any[]).map((video: any) => {
                const ytId = getYouTubeId(video.youtube_url);
                const thumbUrl =
                  video.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

                return (
                  <div
                    key={video.id}
                    className="card overflow-hidden group hover:border-brand-green/30 transition flex flex-col"
                  >
                    {/* Video Player / Embed */}
                    <div className="aspect-video bg-black relative overflow-hidden">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      ) : thumbUrl ? (
                        <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-deep-navy text-white/40">
                          <VideoIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {video.category && (
                            <Badge variant="navy" className="text-[10px]">
                              {video.category}
                            </Badge>
                          )}
                          {video.featured && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-brand-navy dark:group-hover:text-brand-green transition">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-foreground-secondary mt-1.5 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between text-xs">
                        <a
                          href={video.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-navy dark:text-brand-green-light hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          Watch on YouTube <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
