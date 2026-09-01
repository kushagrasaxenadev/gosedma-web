import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  Users, 
  MapPin, 
  Award, 
  Calendar, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch metrics data from Database
  // Enquiries counts
  const { count: contactCount } = await supabase
    .from('contact_enquiries')
    .select('*', { count: 'exact', head: true });

  const { count: trialCount } = await supabase
    .from('trial_enquiries')
    .select('*', { count: 'exact', head: true });

  const { count: workshopCount } = await supabase
    .from('workshop_enquiries')
    .select('*', { count: 'exact', head: true });

  // CMS Content counts
  const { count: programCount } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true });

  const { count: branchCount } = await supabase
    .from('branches')
    .select('*', { count: 'exact', head: true });

  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: achievementCount } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true });

  // Recent enquiries feed
  const { data: recentContacts } = await supabase
    .from('contact_enquiries')
    .select('id, name, email, phone, message, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: recentTrials } = await supabase
    .from('trial_enquiries')
    .select('id, name, student_name, parent_name, phone, interested_program, selected_program, status, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: recentWorkshops } = await supabase
    .from('workshop_enquiries')
    .select('id, institution_name, contact_person, phone, workshop_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  const contactList = recentContacts?.map((c: any) => ({
    id: c.id,
    type: 'Contact Enquiry',
    title: c.name,
    subtitle: c.message ? (c.message.length > 60 ? c.message.substring(0, 60) + '...' : c.message) : 'No message provided',
    date: new Date(c.created_at).toLocaleDateString(),
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    link: '/admin/enquiries/contact'
  })) || [];

  const trialList = recentTrials?.map((t: any) => ({
    id: t.id,
    type: 'Trial Booking',
    title: `${t.student_name || t.name || 'Student'} (${t.selected_program || t.interested_program || 'Trial'})`,
    subtitle: `Parent: ${t.parent_name || 'N/A'} • Status: ${t.status}`,
    date: new Date(t.created_at).toLocaleDateString(),
    badgeColor: 'bg-brand-green/10 text-brand-green-dark border-brand-green/20',
    link: '/admin/enquiries/trial'
  })) || [];

  const workshopList = recentWorkshops?.map((w: any) => ({
    id: w.id,
    type: 'Workshop Request',
    title: w.institution_name || 'Organization',
    subtitle: `Contact: ${w.contact_person} • Type: ${w.workshop_type}`,
    date: new Date(w.created_at).toLocaleDateString(),
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    link: '/admin/enquiries/workshop'
  })) || [];

  const combinedEnquiries = [...contactList, ...trialList, ...workshopList]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalEnquiries = (contactCount || 0) + (trialCount || 0) + (workshopCount || 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Welcome to the Dashboard
        </h2>
        <p className="text-foreground-secondary mt-1 text-base">
          Manage website content, review leads, and track analytics from one central control panel.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-surface rounded-xl border border-border-light p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-brand-navy/10 dark:bg-brand-green/10 flex items-center justify-center text-brand-navy dark:text-brand-green-light">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider block">
              Total Enquiries
            </span>
            <span className="text-3xl font-bold text-foreground block mt-0.5">
              {totalEnquiries}
            </span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-surface rounded-xl border border-border-light p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green-dark">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider block">
              Programs
            </span>
            <span className="text-3xl font-bold text-foreground block mt-0.5">
              {programCount || 0}
            </span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface rounded-xl border border-border-light p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider block">
              Branches
            </span>
            <span className="text-3xl font-bold text-foreground block mt-0.5">
              {branchCount || 0}
            </span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-surface rounded-xl border border-border-light p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-700">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider block">
              Events & News
            </span>
            <span className="text-3xl font-bold text-foreground block mt-0.5">
              {(eventCount || 0) + (achievementCount || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Enquiries */}
        <div className="lg:col-span-2 bg-surface border border-border-light rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-light flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              Latest Enquiries & Leads
            </h3>
            <span className="text-xs bg-brand-navy/5 dark:bg-brand-green/10 text-brand-navy dark:text-brand-green-light font-semibold px-2.5 py-1 rounded-full border border-brand-navy/10">
              Live Feed
            </span>
          </div>

          <div className="flex-1 divide-y divide-border-light">
            {combinedEnquiries.length > 0 ? (
              combinedEnquiries.map((enq) => (
                <div key={enq.id} className="p-6 hover:bg-muted/30 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${enq.badgeColor}`}>
                        {enq.type}
                      </span>
                      <span className="text-xs text-foreground-secondary font-medium">
                        {enq.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-base leading-tight">
                      {enq.title}
                    </h4>
                    <p className="text-sm text-foreground-secondary leading-normal">
                      {enq.subtitle}
                    </p>
                  </div>
                  <Link
                    href={enq.link}
                    className="text-xs font-semibold text-brand-navy dark:text-brand-green-light hover:text-brand-navy-light flex items-center gap-1 self-start sm:self-auto group transition"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-foreground-secondary">
                <Inbox className="w-10 h-10 mx-auto text-foreground-secondary/40 mb-3" />
                <p className="font-medium text-base">No enquiries received yet.</p>
                <p className="text-sm mt-0.5">Leads submitted via contact or registration forms will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Stats & Resource Shortcuts */}
        <div className="bg-surface border border-border-light rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground border-b border-border-light pb-4">
              Enquiry Breakdown
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-foreground">Contact Form leads</span>
                  <span className="text-foreground font-bold">{contactCount || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalEnquiries ? ((contactCount || 0) / totalEnquiries) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-foreground">Trial Class bookings</span>
                  <span className="text-foreground font-bold">{trialCount || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-brand-green h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalEnquiries ? ((trialCount || 0) / totalEnquiries) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-foreground">Workshop requests</span>
                  <span className="text-foreground font-bold">{workshopCount || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalEnquiries ? ((workshopCount || 0) / totalEnquiries) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-light pt-6 mt-6 space-y-3">
            <h4 className="text-xs uppercase font-bold text-foreground-secondary tracking-widest mb-1">
              CMS Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/admin/programs"
                className="flex items-center gap-1.5 p-2 rounded-lg bg-muted hover:bg-brand-navy/5 dark:bg-brand-green/10 text-foreground-secondary hover:text-brand-navy text-xs font-semibold transition border border-transparent hover:border-brand-navy/10"
              >
                <FileText className="w-3.5 h-3.5" />
                Programs
              </Link>
              <Link 
                href="/admin/branches"
                className="flex items-center gap-1.5 p-2 rounded-lg bg-muted hover:bg-brand-navy/5 dark:bg-brand-green/10 text-foreground-secondary hover:text-brand-navy text-xs font-semibold transition border border-transparent hover:border-brand-navy/10"
              >
                <MapPin className="w-3.5 h-3.5" />
                Branches
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
