-- ============================================
-- GOSEDMA — Supabase RLS Policies
-- ============================================

-- Helper functions to check user roles
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


-- ─── Profiles RLS ─────────────────────────────
create policy "Allow public view profiles"
    on public.profiles for select
    using (true);

create policy "Allow individual profile update"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Allow super admin full control of profiles"
    on public.profiles for all
    using (public.is_super_admin());


-- ─── Site Settings RLS ────────────────────────
create policy "Allow public read site settings"
    on public.site_settings for select
    using (true);

create policy "Allow admin full control site settings"
    on public.site_settings for all
    using (public.is_admin());


-- ─── Branches RLS ─────────────────────────────
create policy "Allow public read published branches"
    on public.branches for select
    using (published = true);

create policy "Allow admin full control branches"
    on public.branches for all
    using (public.is_admin());


-- ─── Programs RLS ─────────────────────────────
create policy "Allow public read published programs"
    on public.programs for select
    using (published = true);

create policy "Allow admin full control programs"
    on public.programs for all
    using (public.is_admin());


-- ─── Program Branches RLS ─────────────────────
create policy "Allow public read program branches"
    on public.program_branches for select
    using (true);

create policy "Allow admin full control program branches"
    on public.program_branches for all
    using (public.is_admin());


-- ─── Founder Credentials RLS ──────────────────
create policy "Allow public read published founder credentials"
    on public.founder_credentials for select
    using (published = true and verification_status != 'draft');

create policy "Allow admin full control founder credentials"
    on public.founder_credentials for all
    using (public.is_admin());


-- ─── Achievements RLS ─────────────────────────
create policy "Allow public read published achievements"
    on public.achievements for select
    using (published = true and verification_status != 'draft');

create policy "Allow admin full control achievements"
    on public.achievements for all
    using (public.is_admin());


-- ─── Events RLS ───────────────────────────────
create policy "Allow public read published events"
    on public.events for select
    using (status = 'published');

create policy "Allow admin full control events"
    on public.events for all
    using (public.is_admin());


-- ─── News Posts RLS ───────────────────────────
create policy "Allow public read published news posts"
    on public.news_posts for select
    using (status = 'published');

create policy "Allow admin full control news posts"
    on public.news_posts for all
    using (public.is_admin());


-- ─── Gallery Albums RLS ───────────────────────
create policy "Allow public read published albums"
    on public.gallery_albums for select
    using (published = true);

create policy "Allow admin full control albums"
    on public.gallery_albums for all
    using (public.is_admin());


-- ─── Media Items RLS ──────────────────────────
create policy "Allow public read approved media items"
    on public.media_items for select
    using (
        published = true 
        and (
            contains_minors = false 
            or (consent_confirmed = true and publication_approved = true)
        )
    );

create policy "Allow admin full control media items"
    on public.media_items for all
    using (public.is_admin());


-- ─── Videos RLS ───────────────────────────────
create policy "Allow public read published videos"
    on public.videos for select
    using (published = true);

create policy "Allow admin full control videos"
    on public.videos for all
    using (public.is_admin());


-- ─── Testimonials RLS ─────────────────────────
create policy "Allow public read published testimonials"
    on public.testimonials for select
    using (published = true and permission_confirmed = true);

create policy "Allow admin full control testimonials"
    on public.testimonials for all
    using (public.is_admin());


-- ─── FAQs RLS ─────────────────────────────────
create policy "Allow public read published faqs"
    on public.faqs for select
    using (published = true);

create policy "Allow admin full control faqs"
    on public.faqs for all
    using (public.is_admin());


-- ─── Trial Enquiries RLS ──────────────────────
create policy "Allow anonymous creation of trial enquiries"
    on public.trial_enquiries for insert
    with check (true);

create policy "Allow admin full control trial enquiries"
    on public.trial_enquiries for all
    using (public.is_admin());


-- ─── Workshop Enquiries RLS ────────────────────
create policy "Allow anonymous creation of workshop enquiries"
    on public.workshop_enquiries for insert
    with check (true);

create policy "Allow admin full control workshop enquiries"
    on public.workshop_enquiries for all
    using (public.is_admin());


-- ─── Contact Enquiries RLS ─────────────────────
create policy "Allow anonymous creation of contact enquiries"
    on public.contact_enquiries for insert
    with check (true);

create policy "Allow admin full control contact enquiries"
    on public.contact_enquiries for all
    using (public.is_admin());


-- ─── Enquiry Notes RLS ────────────────────────
create policy "Allow admin full control enquiry notes"
    on public.enquiry_notes for all
    using (public.is_admin());


-- ─── Audit Logs RLS ───────────────────────────
create policy "Allow admin select audit logs"
    on public.audit_logs for select
    using (public.is_admin());

create policy "Allow system insert audit logs"
    on public.audit_logs for insert
    with check (true);
