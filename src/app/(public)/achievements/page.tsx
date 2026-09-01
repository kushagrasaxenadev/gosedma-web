import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Explore GOSEDMA achievements — competitions, awards, and milestones of our academy and students.',
};

const CREDENTIAL_ICONS: Record<string, string> = {
  award: '🏆',
  championship: '🥇',
  certification: '📜',
  recognition: '🌟',
  media: '📺',
};

export default async function AchievementsPage() {
  const supabase = await createClient();

  // ONLY fetch published credentials — drafts are strictly excluded!
  const { data: credentials } = await supabase
    .from('founder_credentials')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  const credList = credentials || [];

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              <Trophy className="w-3 h-3" /> Our Achievements
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Achievements & Milestones
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Celebrating the achievements, championship wins, and national recognitions of GOSEDMA and Richa Gaur.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {credList.length === 0 ? (
            <div className="card p-12 text-center max-w-xl mx-auto">
              <Trophy className="w-12 h-12 text-brand-navy dark:text-brand-green mx-auto mb-4 opacity-50" />
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3">
                Achievements Coming Soon
              </h2>
              <p className="text-foreground-secondary max-w-md mx-auto text-sm leading-relaxed">
                Verified achievements and competition results will be published here upon confirmation.
                Contact us to learn more about our academy&apos;s track record.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credList.map((cred: any) => {
                const icon = CREDENTIAL_ICONS[cred.credential_type] || '🏆';
                return (
                  <div
                    key={cred.id}
                    className={`card p-6 flex flex-col justify-between transition hover:shadow-md ${
                      cred.featured
                        ? 'border-amber-400/50 bg-amber-50/10 dark:bg-amber-950/10 ring-1 ring-amber-400/20'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{icon}</span>
                        <div className="flex items-center gap-1.5">
                          {cred.year && (
                            <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded text-foreground-secondary">
                              {cred.year}
                            </span>
                          )}
                          {cred.featured && (
                            <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                              <Star className="w-3 h-3 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                        {cred.title}
                      </h3>

                      {(cred.event_name || cred.result || cred.location) && (
                        <p className="text-xs font-medium text-brand-green mb-2">
                          {[cred.event_name, cred.result, cred.location].filter(Boolean).join(' • ')}
                        </p>
                      )}

                      {cred.description && (
                        <p className="text-xs text-foreground-secondary leading-relaxed">
                          {cred.description}
                        </p>
                      )}
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
