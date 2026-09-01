import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Tag, Star, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming championships, camps, workshops, and events at GOSEDMA.',
};

export default async function EventsPage() {
  const supabase = await createClient();

  // ONLY fetch published events — drafts are strictly excluded!
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: false });

  const eventList = events || [];

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-20 relative z-10">
          <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
            Events & Schedules
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
            Upcoming & Academy Events
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Stay updated with martial arts championships, belt grading ceremonies, training camps, and special workshops.
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
          {eventList.length === 0 ? (
            <div className="card p-12 text-center max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-brand-navy dark:text-brand-green mx-auto mb-4 opacity-50" />
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3">No Scheduled Events</h2>
              <p className="text-foreground-secondary text-sm leading-relaxed">
                There are currently no active public events. Please check back soon or follow our social channels for announcements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventList.map((event: any) => {
                const eventDate = event.event_date || event.start_date;
                const formattedDate = eventDate
                  ? new Date(eventDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : null;

                return (
                  <div
                    key={event.id}
                    className={`card overflow-hidden group hover:border-brand-green/30 transition flex flex-col justify-between ${
                      event.featured ? 'border-amber-400/50 ring-1 ring-amber-400/20' : ''
                    }`}
                  >
                    <div>
                      {/* Image / Header bar */}
                      <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-navy/15 to-brand-green/15 flex flex-col items-center justify-center text-foreground-secondary/40">
                            <Calendar className="w-12 h-12 mb-2" />
                            <span className="text-xs uppercase font-semibold tracking-wider">GOSEDMA Event</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {event.category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow bg-brand-navy text-white">
                              {event.category}
                            </span>
                          )}
                        </div>

                        {event.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {formattedDate && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green mb-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>
                        )}

                        <h3 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-brand-navy dark:group-hover:text-brand-green transition">
                          {event.title}
                        </h3>

                        {event.summary && (
                          <p className="text-sm text-foreground-secondary line-clamp-3 leading-relaxed">
                            {event.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-border-light mt-4 flex items-center justify-between text-xs">
                      <Link
                        href="/contact"
                        className="text-brand-navy dark:text-brand-green font-bold inline-flex items-center gap-1 hover:underline"
                      >
                        Enquire About Event <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
