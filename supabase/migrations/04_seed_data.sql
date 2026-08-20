-- ============================================
-- GOSEDMA — Supabase Seed Data
-- ============================================

-- ─── Insert Default Branches ──────────────────
insert into public.branches (name, slug, address, city, state, postal_code, phone, whatsapp, email, published, sort_order)
values 
('Malviya Nagar', 'malviya-nagar', 'Malviya Nagar, Jaipur, Rajasthan', 'Jaipur', 'Rajasthan', '302017', '+91-9999999999', '919999999999', 'info@gosedma.com', true, 1),
('Sitapura', 'sitapura', 'Sitapura, Jaipur, Rajasthan', 'Jaipur', 'Rajasthan', '302022', '+91-9999999999', '919999999999', 'info@gosedma.com', true, 2)
on conflict (slug) do nothing;


-- ─── Insert Default Site Settings ─────────────
insert into public.site_settings (key, value, description)
values
('contact_details', '{"phone": "+91-9999999999", "whatsapp": "919999999999", "email": "info@gosedma.com"}', 'Global contact values used throughout the site'),
('social_links', '{"facebook": "https://facebook.com/gosedma", "instagram": "https://instagram.com/gosedma", "youtube": "https://youtube.com/@gosedma"}', 'Social media profile URLs')
on conflict (key) do update set value = excluded.value;


-- ─── Insert Default Programs ─────────────────
insert into public.programs (title, slug, category, description, short_description, pricing_mode, show_price_on_card, show_price_on_detail, featured, published, sort_order)
values
('Taekwondo', 'taekwondo', 'Martial Art', 'Olympic-style martial arts focusing on speed, precision kicks, forms (poomsae), and discipline.', 'Olympic-style martial arts focusing on speed, precision kicks, and discipline.', 'enquire', false, true, true, true, 1),
('Muay Thai', 'muay-thai', 'Striking Art', 'The art of eight limbs — powerful striking techniques using fists, elbows, knees, and shins. Excellent for fitness and self-defence.', 'The art of eight limbs — powerful striking techniques for fitness and self-defence.', 'enquire', false, true, true, true, 2),
('Krav Maga', 'krav-maga', 'Self Defence', 'Israel-developed self-defence system designed for real-world survival situations. Practical, direct, and effective.', 'Real-world self-defence system designed for practical survival situations.', 'enquire', false, true, true, true, 3),
('MMA', 'mma', 'Mixed Martial Arts', 'Mixed Martial Arts combining striking, grappling, and ground techniques from multiple disciplines.', 'Mixed Martial Arts combining striking, grappling, and ground techniques.', 'enquire', false, true, true, true, 4),
('Women''s Self Defence', 'womens-self-defence', 'Self Defence', 'Specialized self-defence designed for women — practical techniques, situational awareness, and confidence building.', 'Specialized self-defence designed for women — practical, empowering, and confidence-building.', 'enquire', false, true, true, true, 5)
on conflict (slug) do nothing;
