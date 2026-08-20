import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- MOCK SERVER STORE (READ-ONLY DEMO) ---
const SEED_DATA: Record<string, any[]> = {
  programs: [
    { id: '1', title: 'Taekwondo', category: 'Martial Art', pricing_mode: 'enquire', featured: true, published: true, sort_order: 1 },
    { id: '2', title: 'Muay Thai', category: 'Striking Art', pricing_mode: 'enquire', featured: true, published: true, sort_order: 2 },
    { id: '3', title: 'Krav Maga', category: 'Self Defence', pricing_mode: 'enquire', featured: true, published: true, sort_order: 3 }
  ],
  branches: [
    { id: '1', name: 'Malviya Nagar', city: 'Jaipur', address: 'Malviya Nagar, Jaipur, Rajasthan', phone: '+91-9999999999', published: true, sort_order: 1 },
    { id: '2', name: 'Sitapura', city: 'Jaipur', address: 'Sitapura, Jaipur, Rajasthan', phone: '+91-9999999999', published: true, sort_order: 2 }
  ],
  gallery_albums: [
    { id: '1', title: 'State Championships 2023', published: true, sort_order: 1 },
    { id: '2', title: 'Summer Camp Self Defence', published: true, sort_order: 2 }
  ],
  videos: [
    { id: '1', title: 'Self Defence Masterclass', youtube_url: 'https://youtube.com/watch?v=demo', featured: true, published: true, sort_order: 1 }
  ],
  events: [
    { id: '1', title: 'Winter Grading 2024', status: 'published', event_date: '2024-12-15' },
    { id: '2', title: 'Women Safety Workshop', status: 'published', event_date: '2024-11-20' }
  ],
  founder_credentials: [
    { id: '1', title: 'Black Belt 4th Dan', credential_type: 'certification', verification_status: 'source_verified', published: true, sort_order: 1 },
    { id: '2', title: 'National Gold Medalist', credential_type: 'award', verification_status: 'source_verified', published: true, sort_order: 2 }
  ],
  contact_enquiries: [
    { id: '1', name: 'Rahul Sharma', phone: '+91-9876543210', email: 'rahul@example.com', subject: 'Class timings', message: 'Hi, what are the timings for adult Taekwondo?', status: 'new', created_at: new Date().toISOString() },
    { id: '2', name: 'Priya Patel', phone: '+91-8765432109', email: 'priya@example.com', subject: 'Fees inquiry', message: 'How much are the monthly fees?', status: 'responded', created_at: new Date().toISOString() }
  ],
  trial_enquiries: [
    { id: '1', student_name: 'Aarav Gupta', student_age: '12', parent_name: 'Sneha Gupta', phone: '+91-7654321098', branch_id: '1', status: 'new', created_at: new Date().toISOString() },
    { id: '2', student_name: 'Vihaan Singh', student_age: 'Adult', parent_name: '', phone: '+91-6543210987', branch_id: '2', status: 'contacted', created_at: new Date().toISOString() }
  ],
  workshop_enquiries: [
    { id: '1', institution_name: 'Delhi Public School', contact_person: 'Mr. Verma', phone: '+91-5432109876', workshop_type: 'school_safety', status: 'new', created_at: new Date().toISOString() },
    { id: '2', organization_name: 'TechCorp India', contact_person: 'Anita Roy', phone: '+91-4321098765', workshop_type: 'corporate', status: 'proposal_sent', created_at: new Date().toISOString() }
  ],
  site_settings: [
    { key: 'primary_phone', value: { value: '+91-9999999999' } },
    { key: 'primary_email', value: { value: 'info@gosedma.com' } }
  ]
};

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client with a server-side "in-memory" database for demo purposes
    return {
      from: (table: string) => ({
        select: () => {
          let data = [...(SEED_DATA[table] || [])];
          
          const chain: any = {
            order: (col: string, opts: any) => {
              data.sort((a, b) => {
                const valA = a[col] || '';
                const valB = b[col] || '';
                if (valA < valB) return opts?.ascending === false ? 1 : -1;
                if (valA > valB) return opts?.ascending === false ? -1 : 1;
                return 0;
              });
              return chain;
            },
            eq: (col: string, val: any) => {
              data = data.filter(row => row[col] === val);
              return chain;
            },
            limit: (num: number) => {
              data = data.slice(0, num);
              return chain;
            },
            then: (resolve: any) => resolve({ data, error: null })
          };
          
          return chain;
        },
        update: () => ({ eq: () => ({ then: (res: any) => res({ error: null }) }) }),
        delete: () => ({ eq: () => ({ then: (res: any) => res({ error: null }) }) }),
        insert: () => ({ then: (res: any) => res({ error: null }) }),
        upsert: () => ({ then: (res: any) => res({ error: null }) })
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured in environment variables') }),
        signOut: async () => ({ error: null }),
      }
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component ignore
          }
        },
      },
    }
  );
}
