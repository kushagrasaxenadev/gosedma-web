-- ==============================================================================
-- GOSEDMA — Complete Production Database Setup (All-In-One Script)
-- ==============================================================================
-- Run this entire script in your Supabase Project's SQL Editor to set up:
-- 1. All Database Tables with Foreign Keys & Constraints
-- 2. User Profile Auto-Creation Trigger
-- 3. Row Level Security (RLS) Helper Functions & Policies
-- 4. Storage Buckets & Policies (Gallery, Avatars, Documents)
-- 5. Seed Data (Initial Branches, Programs, Site Settings)
-- ==============================================================================

-- ─── 1. EXTENSIONS ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 2. TABLES ─────────────────────────────────────────────────────────────────

-- Profiles (Linked to auth.users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    avatar_url text,
    role text not null default 'super_admin' check (role in ('super_admin', 'content_admin')),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Site Settings
create table if not exists public.site_settings (
    id uuid default gen_random_uuid() primary key,
    key text not null unique,
    value jsonb not null,
    description text,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    updated_by uuid references public.profiles(id)
);

-- Branches
create table if not exists public.branches (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    address text not null,
    city text not null,
    state text not null,
    postal_code text,
    phone text,
    whatsapp text,
    email text,
    map_url text,
    latitude double precision,
    longitude double precision,
    opening_hours jsonb,
    description text,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Programs
create table if not exists public.programs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    subtitle text,
    category text not null,
    description text not null,
    short_description text,
    image_url text,
    icon text,
    pricing_mode text not null default 'enquire' check (pricing_mode in ('exact', 'starting_from', 'range', 'enquire', 'hidden')),
    currency text default '₹' not null,
    price integer,
    min_price integer,
    max_price integer,
    billing_unit text,
    public_pricing_note text,
    private_admin_note text,
    show_price_on_card boolean default false not null,
    show_price_on_detail boolean default true not null,
    show_enquiry_cta boolean default true not null,
    show_whatsapp_cta boolean default true not null,
    show_trial_cta boolean default true not null,
    featured boolean default false not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- Program Branches
create table if not exists public.program_branches (
    id uuid default gen_random_uuid() primary key,
    program_id uuid references public.programs(id) on delete cascade not null,
    branch_id uuid references public.branches(id) on delete cascade not null,
    unique(program_id, branch_id)
);

-- Founder Credentials
create table if not exists public.founder_credentials (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    credential_type text not null check (credential_type in ('award', 'championship', 'certification', 'recognition', 'media')),
    event_name text,
    result text,
    year text,
    location text,
    description text,
    source_url text,
    verification_status text not null default 'source_verified' check (verification_status in ('draft', 'client_verified', 'source_verified')),
    verification_source text,
    verification_note text,
    verification_date timestamptz,
    featured boolean default false not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Achievements
create table if not exists public.achievements (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    achievement_type text not null check (achievement_type in ('team', 'founder', 'student', 'competition', 'award', 'milestone')),
    event_name text,
    athlete_or_team text,
    result text,
    achievement_date date,
    location text,
    description text,
    source_url text,
    image_url text,
    verification_status text not null default 'source_verified' check (verification_status in ('draft', 'client_verified', 'source_verified')),
    featured boolean default false not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Events
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    summary text,
    body text,
    event_date date,
    start_date date,
    end_date date,
    branch_id uuid references public.branches(id) on delete set null,
    image_url text,
    category text,
    featured boolean default false not null,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz default timezone('utc'::text, now()),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- News Posts
create table if not exists public.news_posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    summary text,
    body text,
    image_url text,
    category text,
    featured boolean default false not null,
    status text not null default 'published' check (status in ('draft', 'published')),
    published_at timestamptz default timezone('utc'::text, now()),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- Gallery Albums
create table if not exists public.gallery_albums (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    description text,
    cover_image_url text,
    album_date date,
    branch_id uuid references public.branches(id) on delete set null,
    event_id uuid references public.events(id) on delete set null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Media Items
create table if not exists public.media_items (
    id uuid default gen_random_uuid() primary key,
    album_id uuid references public.gallery_albums(id) on delete cascade not null,
    media_type text not null check (media_type in ('image', 'video')),
    url text not null,
    thumbnail_url text,
    title text,
    caption text,
    alt_text text,
    photographer text,
    event_date date,
    contains_minors boolean default false not null,
    consent_confirmed boolean default true not null,
    publication_approved boolean default true not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Videos
create table if not exists public.videos (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    youtube_url text not null,
    thumbnail_url text,
    category text,
    featured boolean default false not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Testimonials
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    relationship_type text not null check (relationship_type in ('student', 'parent', 'school', 'organization', 'other')),
    quote text not null,
    organization text,
    photo_url text,
    permission_confirmed boolean default true not null,
    featured boolean default false not null,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- FAQs
create table if not exists public.faqs (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    category text,
    published boolean default true not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Trial Enquiries
create table if not exists public.trial_enquiries (
    id uuid default gen_random_uuid() primary key,
    student_name text,
    name text,
    student_age text,
    parent_name text,
    age_group text,
    phone text not null,
    whatsapp text,
    email text,
    preferred_branch uuid references public.branches(id) on delete set null,
    branch_id text,
    interested_program text,
    selected_program text,
    experience_level text,
    preferred_time text,
    message text,
    privacy_consent boolean default true,
    status text default 'new' not null check (status in ('new', 'contacted', 'converted', 'lost')),
    admin_notes text,
    follow_up_date timestamptz,
    assigned_to uuid references public.profiles(id) on delete set null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Workshop Enquiries
create table if not exists public.workshop_enquiries (
    id uuid default gen_random_uuid() primary key,
    institution_name text not null,
    institution_type text,
    contact_person text not null,
    designation text,
    phone text not null,
    whatsapp text,
    email text,
    city text,
    student_grade_range text,
    participant_count integer,
    preferred_date date,
    preferred_duration text,
    venue text,
    workshop_type text not null,
    goals text,
    message text,
    privacy_consent boolean default true,
    status text default 'new' not null check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'booked', 'completed', 'lost')),
    admin_notes text,
    follow_up_date timestamptz,
    assigned_to uuid references public.profiles(id) on delete set null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Contact Enquiries
create table if not exists public.contact_enquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    email text,
    subject text,
    message text not null,
    branch_id uuid references public.branches(id) on delete set null,
    privacy_consent boolean default true,
    status text default 'new' not null check (status in ('new', 'read', 'responded', 'closed')),
    admin_notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enquiry Notes
create table if not exists public.enquiry_notes (
    id uuid default gen_random_uuid() primary key,
    enquiry_type text not null check (enquiry_type in ('trial', 'workshop', 'contact')),
    enquiry_id uuid not null,
    note text not null,
    created_by uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Audit Logs
create table if not exists public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    table_name text not null,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── 3. AUTO USER PROFILE TRIGGER ──────────────────────────────────────────────
-- Automatically create an admin profile whenever an account is added in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'super_admin')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 4. ROW LEVEL SECURITY (RLS) ───────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.branches enable row level security;
alter table public.programs enable row level security;
alter table public.program_branches enable row level security;
alter table public.founder_credentials enable row level security;
alter table public.achievements enable row level security;
alter table public.events enable row level security;
alter table public.news_posts enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.media_items enable row level security;
alter table public.videos enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.trial_enquiries enable row level security;
alter table public.workshop_enquiries enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.audit_logs enable row level security;

-- Helper functions
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('super_admin', 'content_admin')
  );
end;
$$ language plpgsql;

create or replace function public.is_super_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'super_admin'
  );
end;
$$ language plpgsql;

-- Public read policies
create policy "Allow public view profiles" on public.profiles for select using (true);
create policy "Allow individual profile update" on public.profiles for update using (auth.uid() = id);
create policy "Allow super admin full control profiles" on public.profiles for all using (public.is_super_admin());

create policy "Allow public read site settings" on public.site_settings for select using (true);
create policy "Allow admin full control site settings" on public.site_settings for all using (public.is_admin());

create policy "Allow public read published branches" on public.branches for select using (published = true);
create policy "Allow admin full control branches" on public.branches for all using (public.is_admin());

create policy "Allow public read published programs" on public.programs for select using (published = true);
create policy "Allow admin full control programs" on public.programs for all using (public.is_admin());

create policy "Allow public read program branches" on public.program_branches for select using (true);
create policy "Allow admin full control program branches" on public.program_branches for all using (public.is_admin());

create policy "Allow public read published credentials" on public.founder_credentials for select using (published = true);
create policy "Allow admin full control credentials" on public.founder_credentials for all using (public.is_admin());

create policy "Allow public read published achievements" on public.achievements for select using (published = true);
create policy "Allow admin full control achievements" on public.achievements for all using (public.is_admin());

create policy "Allow public read published events" on public.events for select using (status = 'published');
create policy "Allow admin full control events" on public.events for all using (public.is_admin());

create policy "Allow public read published news" on public.news_posts for select using (status = 'published');
create policy "Allow admin full control news" on public.news_posts for all using (public.is_admin());

create policy "Allow public read published albums" on public.gallery_albums for select using (published = true);
create policy "Allow admin full control albums" on public.gallery_albums for all using (public.is_admin());

create policy "Allow public read published media" on public.media_items for select using (published = true);
create policy "Allow admin full control media" on public.media_items for all using (public.is_admin());

create policy "Allow public read published videos" on public.videos for select using (published = true);
create policy "Allow admin full control videos" on public.videos for all using (public.is_admin());

create policy "Allow public read published testimonials" on public.testimonials for select using (published = true);
create policy "Allow admin full control testimonials" on public.testimonials for all using (public.is_admin());

create policy "Allow public read published faqs" on public.faqs for select using (published = true);
create policy "Allow admin full control faqs" on public.faqs for all using (public.is_admin());

-- Form submission policies (Public can insert, only Admins can view/update)
create policy "Allow public insert trial enquiries" on public.trial_enquiries for insert with check (true);
create policy "Allow admin full control trial enquiries" on public.trial_enquiries for all using (public.is_admin());

create policy "Allow public insert workshop enquiries" on public.workshop_enquiries for insert with check (true);
create policy "Allow admin full control workshop enquiries" on public.workshop_enquiries for all using (public.is_admin());

create policy "Allow public insert contact enquiries" on public.contact_enquiries for insert with check (true);
create policy "Allow admin full control contact enquiries" on public.contact_enquiries for all using (public.is_admin());

create policy "Allow admin full control enquiry notes" on public.enquiry_notes for all using (public.is_admin());
create policy "Allow admin read audit logs" on public.audit_logs for select using (public.is_admin());

-- ─── 5. STORAGE BUCKETS & POLICIES ─────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies
create policy "Allow public read access to gallery" on storage.objects for select using (bucket_id = 'gallery');
create policy "Allow public read access to avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Allow public read access to documents" on storage.objects for select using (bucket_id = 'documents');

create policy "Allow admin full control of gallery objects" on storage.objects for all using (bucket_id = 'gallery' and (select public.is_admin()));
create policy "Allow admin full control of avatars objects" on storage.objects for all using (bucket_id = 'avatars' and (select public.is_admin()));
create policy "Allow admin full control of documents objects" on storage.objects for all using (bucket_id = 'documents' and (select public.is_admin()));

-- ─── 6. SEED DATA ──────────────────────────────────────────────────────────────

-- Branches
insert into public.branches (name, slug, address, city, state, postal_code, phone, whatsapp, email, published, sort_order)
values 
('Malviya Nagar', 'malviya-nagar', 'Plot No. 12, Calgiri Marg, Malviya Nagar, Jaipur, Rajasthan', 'Jaipur', 'Rajasthan', '302017', '+91-9999999999', '919999999999', 'info@gosedma.com', true, 1),
('Sitapura', 'sitapura', 'RIICO Industrial Area, Sitapura, Jaipur, Rajasthan', 'Jaipur', 'Rajasthan', '302022', '+91-9999999999', '919999999999', 'info@gosedma.com', true, 2)
on conflict (slug) do nothing;

-- Programs
insert into public.programs (title, slug, category, description, short_description, pricing_mode, show_price_on_card, show_price_on_detail, featured, published, sort_order)
values
('Taekwondo', 'taekwondo', 'Martial Art', 'Olympic-style martial arts focusing on speed, precision kicks, forms (poomsae), and discipline. Suitable for all age groups from 4+ years to adults.', 'Olympic-style martial arts focusing on speed, precision kicks, and discipline.', 'enquire', false, true, true, true, 1),
('Muay Thai', 'muay-thai', 'Striking Art', 'The art of eight limbs — powerful striking techniques using fists, elbows, knees, and shins. Excellent for cardiovascular endurance and self-defence.', 'The art of eight limbs — powerful striking techniques for fitness and self-defence.', 'enquire', false, true, true, true, 2),
('Krav Maga', 'krav-maga', 'Self Defence', 'Israel-developed practical self-defence system designed for real-world survival. Instinctive movements, aggressive defense, and threat neutralization.', 'Real-world self-defence system designed for practical survival situations.', 'enquire', false, true, true, true, 3),
('MMA', 'mma', 'Mixed Martial Arts', 'Mixed Martial Arts combining stand-up striking, clinch fighting, and ground grappling. Comprehensive multi-disciplinary training.', 'Mixed Martial Arts combining striking, grappling, and ground techniques.', 'enquire', false, true, true, true, 4),
('Women''s Self Defence', 'womens-self-defence', 'Self Defence', 'Specialized program by Richa Gaur focused on real-world threat de-escalation, vital point strikes, situational awareness, and boundary setting.', 'Specialized self-defence designed for women — practical, empowering, and confidence-building.', 'enquire', false, true, true, true, 5)
on conflict (slug) do nothing;

-- Site Settings
insert into public.site_settings (key, value, description)
values
('contact_details', '{"phone": "+91-9999999999", "whatsapp": "919999999999", "email": "info@gosedma.com", "address": "Jaipur, Rajasthan"}', 'Primary contact values'),
('social_links', '{"facebook": "https://facebook.com/gosedma", "instagram": "https://instagram.com/gosedma", "youtube": "https://youtube.com/@gosedma"}', 'Social media URLs')
on conflict (key) do update set value = excluded.value;
