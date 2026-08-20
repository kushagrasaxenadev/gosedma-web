-- ============================================
-- GOSEDMA — Supabase Initial Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    avatar_url text,
    role text not null check (role in ('super_admin', 'content_admin')),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Site Settings ────────────────────────────
create table if not exists public.site_settings (
    id uuid default gen_random_uuid() primary key,
    key text not null unique,
    value jsonb not null,
    description text,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    updated_by uuid references public.profiles(id)
);

-- ─── Branches ─────────────────────────────────
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
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Programs ─────────────────────────────────
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
    pricing_mode text not null check (pricing_mode in ('exact', 'starting_from', 'range', 'enquire', 'hidden')),
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
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- ─── Program Branches ─────────────────────────
create table if not exists public.program_branches (
    id uuid default gen_random_uuid() primary key,
    program_id uuid references public.programs(id) on delete cascade not null,
    branch_id uuid references public.branches(id) on delete cascade not null,
    unique(program_id, branch_id)
);

-- ─── Founder Credentials ──────────────────────
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
    verification_status text not null check (verification_status in ('draft', 'client_verified', 'source_verified')),
    verification_source text,
    verification_note text,
    verification_date timestamptz,
    featured boolean default false not null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Achievements ─────────────────────────────
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
    verification_status text not null check (verification_status in ('draft', 'client_verified', 'source_verified')),
    featured boolean default false not null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Events ───────────────────────────────────
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
    status text not null check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- ─── News Posts ───────────────────────────────
create table if not exists public.news_posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    summary text,
    body text,
    image_url text,
    category text,
    featured boolean default false not null,
    status text not null check (status in ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_by uuid references public.profiles(id)
);

-- ─── Gallery Albums ───────────────────────────
create table if not exists public.gallery_albums (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    description text,
    cover_image_url text,
    album_date date,
    branch_id uuid references public.branches(id) on delete set null,
    event_id uuid references public.events(id) on delete set null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Media Items ──────────────────────────────
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
    consent_confirmed boolean default false not null,
    publication_approved boolean default false not null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Videos ───────────────────────────────────
create table if not exists public.videos (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    youtube_url text not null,
    thumbnail_url text,
    category text,
    featured boolean default false not null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Testimonials ─────────────────────────────
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    relationship_type text not null check (relationship_type in ('student', 'parent', 'school', 'organization', 'other')),
    quote text not null,
    organization text,
    photo_url text,
    permission_confirmed boolean default false not null,
    featured boolean default false not null,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── FAQs ─────────────────────────────────────
create table if not exists public.faqs (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    category text,
    published boolean default false not null,
    sort_order integer default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Trial Enquiries ──────────────────────────
create table if not exists public.trial_enquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    age_group text not null,
    phone text not null,
    whatsapp text,
    email text,
    preferred_branch uuid references public.branches(id) on delete set null,
    interested_program text not null,
    experience_level text,
    preferred_time text,
    message text,
    privacy_consent boolean not null,
    status text default 'new' not null check (status in ('new', 'contacted', 'converted', 'lost')),
    admin_notes text,
    follow_up_date timestamptz,
    assigned_to uuid references public.profiles(id) on delete set null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Workshop Enquiries ────────────────────────
create table if not exists public.workshop_enquiries (
    id uuid default gen_random_uuid() primary key,
    institution_name text not null,
    institution_type text not null,
    contact_person text not null,
    designation text,
    phone text not null,
    whatsapp text,
    email text not null,
    city text not null,
    student_grade_range text,
    participant_count integer,
    preferred_date date,
    preferred_duration text,
    venue text not null,
    workshop_type text not null,
    goals text,
    message text,
    privacy_consent boolean not null,
    status text default 'new' not null check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'booked', 'completed', 'lost')),
    admin_notes text,
    follow_up_date timestamptz,
    assigned_to uuid references public.profiles(id) on delete set null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Contact Enquiries ─────────────────────────
create table if not exists public.contact_enquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    email text,
    subject text,
    message text not null,
    branch_id uuid references public.branches(id) on delete set null,
    privacy_consent boolean not null,
    status text default 'new' not null check (status in ('new', 'read', 'responded', 'closed')),
    admin_notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Enquiry Notes ────────────────────────────
create table if not exists public.enquiry_notes (
    id uuid default gen_random_uuid() primary key,
    enquiry_type text not null check (enquiry_type in ('trial', 'workshop', 'contact')),
    enquiry_id uuid not null,
    note text not null,
    created_by uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ─── Audit Logs ───────────────────────────────
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

-- ─── Enable Row Level Security (RLS) ──────────
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
