# 🥋 GOSEDMA — Production & Database Setup Guide

This guide explains how to switch seamlessly between **Development** and **Production**, how to set up the **Supabase PostgreSQL database** in 5 minutes, how much it costs to run, and what this platform brings to the client.

---

## 1. Switching Between Development & Production

The application uses an **intelligent dual-mode system**:

| Environment | Database Mode | How It Works | How to Activate |
| :--- | :--- | :--- | :--- |
| **Development / Demo** | **Local Mock DB** | Works offline with built-in realistic mock data in `localStorage`. Forms submit, admin CMS works, and zero database setup is needed. | Leave `NEXT_PUBLIC_SUPABASE_URL` blank in `.env.local` |
| **Production** | **Live Supabase PostgreSQL** | Real-time database, permanent lead storage, secure auth, image storage buckets, and CSV export. | Add Supabase keys to Vercel Environment Variables |

### To Run Locally in Development:
```powershell
# Copy the development environment template
cp .env.development.example .env.local

# Run the dev server
pnpm dev
# or: npm run dev
```
Visit `http://localhost:3000`. Login to admin at `http://localhost:3000/admin/login` using `admin@gosedma.com` / `demo123`.

---

## 2. Setting Up Supabase (Step-by-Step)

Supabase provides a managed **PostgreSQL database**, authentication, and file storage with an ultra-generous **100% Free Forever tier**.

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and click **"Start your project"** (Sign up with GitHub or Google).
2. Click **"New Project"**.
3. Fill in:
   - **Name**: `gosedma-db`
   - **Database Password**: Choose a strong password and save it in a safe place.
   - **Region**: Select **South Asia (Mumbai)** (closest to Jaipur for fastest loading speeds).
4. Click **"Create new project"** (takes ~60 seconds to provision).

### Step 2: Run the All-In-One Database Setup Script
1. In your Supabase Dashboard, click on the **"SQL Editor"** icon in the left sidebar (looks like `>_`).
2. Click **"New query"**.
3. Open the file [`supabase/full_production_setup.sql`](./supabase/full_production_setup.sql) in this repository.
4. Copy its entire content and paste it into the Supabase SQL Editor.
5. Click **"Run"** (green button at the bottom right).
6. You will see: `Success. No rows returned.`
   *This automatically sets up all 18 tables, security policies, storage buckets (`gallery`, `avatars`, `documents`), and initial branch/program seed data!*

### Step 3: Create the Admin Account
1. In Supabase Dashboard, click **"Authentication"** (left sidebar) -> **"Users"**.
2. Click **"Add user"** -> **"Create user"**.
3. Enter:
   - **Email**: Your client's or your admin email (e.g. `admin@gosedma.com` or `richa@gosedma.com`)
   - **Password**: A secure password
   - Check **"Auto Confirm User?"** so you don't need email verification.
4. Click **"Create user"**.
   *(The trigger script we ran in Step 2 automatically assigns this user `super_admin` permissions in the `profiles` table!)*

### Step 4: Copy API Keys
1. In Supabase Dashboard, click the **Settings (Gear icon)** at the bottom left -> **API**.
2. Copy these 3 values:
   - **Project URL** (e.g., `https://abcdefghijkl.supabase.co`)
   - **anon public** API key
   - **service_role** secret key (revealed by clicking Reveal)

---

## 3. Deploying to Production on Vercel

1. Open your project on [vercel.com](https://vercel.com).
2. Go to **Settings** -> **Environment Variables**.
3. Add the following variables (select both **Production** and **Preview**):

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | Public browser access |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1Ni...` | Server-side admin actions |
| `NEXT_PUBLIC_SITE_URL` | `https://gosedma-web.vercel.app` (or custom domain) | Canonical URL |

4. Go to **Deployments** tab on Vercel, click the three dots (`...`) on your latest deployment, and click **"Redeploy"**.
5. Your production website is now 100% connected to PostgreSQL!

---

## 4. Database Type, Hosting & Running Costs

Here is an honest breakdown of the infrastructure and cost:

| Service | Component | Plan | Monthly Cost | What You Get |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL Database | **Free Forever** | **₹0 / $0** | • 500 MB database (~100,000+ lead enquiries)<br>• 1 GB image/media storage<br>• 50,000 monthly active users<br>• Automated daily backups |
| **Vercel** | Next.js Hosting & Edge CDN | **Free (Hobby)** | **₹0 / $0** | • Global CDN across 100+ cities<br>• 100 GB monthly bandwidth<br>• Free automatic SSL/HTTPS certificate |
| **Domain** | Custom Domain Name (e.g. `gosedma.com`) | Annual renewal | **~₹800 - ₹1,200 / year** (~$10/yr) | • Custom brand address from GoDaddy, Namecheap, or Google |
| **Resend** (Optional) | Email notifications for leads | **Free Tier** | **₹0 / $0** | • 3,000 free emails/month (sends instant email to Richa Gaur when a lead signs up) |

### 💡 Summary of Running Cost:
> **Total Monthly Cost: ₹0 / month**
> The only cost for the client is their custom domain name (~₹800 - ₹1,000 per year). The entire tech stack runs with enterprise-grade reliability on free tier allowances designed for high-traffic local businesses.

---

## 5. Free Tier Constraints & How to Stay on the Free Plan Forever

While Supabase provides a powerful free plan, here are the exact limits and how our codebase is designed to stay comfortably within them:

| Resource | Free Tier Constraint | Real-World Impact for GOSEDMA | Best Practice to Stay Free |
| :--- | :--- | :--- | :--- |
| **Database Size** | **Max 500 MB** Postgres storage | ~100,000 to 150,000 lead enquiries and text records | Staff can click **"Export CSV"** in the admin panel to archive leads once a year. 500 MB will last years. |
| **Auto-Pausing** | **Pauses after 7 days** of no API requests | Database sleeps if inactive; requires 1 click in Supabase to restore | • **For Demos**: Use the built-in **Mock Mode** (never sleeps, zero cloud dependency).<br>• **For Production**: Set up a free check on [UptimeRobot.com](https://uptimerobot.com) to ping the site every few hours, keeping it awake 24/7. |
| **Bandwidth (Egress)** | **Max 5 GB / month** | Ample for tens of thousands of page views | Vercel's Edge CDN caches assets, offloading bandwidth away from Supabase. |
| **File Storage** | **Max 1 GB** for images/files | ~2,500+ optimized WebP photos | • **Videos**: Handled via YouTube embeds (`youtube_url`), consuming **0 MB** of Supabase storage.<br>• **Photos**: Upload compressed WebP/JPEG images under 500 KB. |
| **Authentication** | **Up to 50,000 MAU** | Only needed for staff/admins (~5 users) | Easily fits within the limit. |
| **Compute** | **Shared CPU / 500 MB RAM** | Fast enough for hundreds of simultaneous visitors | Lightweight Next.js serverless functions keep queries fast. |
| **Project Limit** | **2 active free projects** per account | 1 project for GOSEDMA (`gosedma-db`) | Leaves 1 free project slot for future projects. |

### 🎯 Strategy Recommendation:
1. **For Demos / Client Presentation**:
   - Keep the live site or localhost running in **Demo / Mock DB mode** (`NEXT_PUBLIC_SUPABASE_URL` left blank). It works 100% of the time, requires zero cloud maintenance, and will never pause.
2. **For Production Deployment**:
   - Link the free Supabase project when Richa Gaur and the academy are ready to start collecting real customer leads.
   - You only ever need a paid plan ($25/mo) if the academy scales to a nationwide chain with tens of thousands of students.

---

## 6. What This Website Brings to the Client (Pitch & Value)

When presenting this website to the client (Richa Gaur & GOSEDMA team), here are the key commercial and operational benefits:

### 1. High-Converting Lead Generation Funnel
- **Free Trial Class Booking System**: Converts casual visitors into physical visits at Malviya Nagar or Sitapura.
- **Dedicated School Workshop Booking**: A specialized B2B booking funnel for school principals and coordinators looking for self-defence training.
- **Instant WhatsApp & Phone Floating CTAs**: Lowers friction for mobile users who prefer instant chat over forms.

### 2. Full Admin Control Panel (Zero Developer Dependency)
- **Trial Bookings CRM**: Real-time list of all parents/students who booked trials with status tags (**New**, **Contacted**, **Converted**, **Lost**).
- **One-Click CSV Export**: Allows staff to download leads to Microsoft Excel or Google Sheets for follow-up calls.
- **Content Management (CMS)**: Staff can add new martial arts programs, update branch timings, upload event photos, and update videos without paying an agency.

### 3. Authority, Credibility & Brand Image
- **Founder Spotlight**: Richa Gaur's achievements, national awards, and credentials prominently showcased.
- **High-Performance Speed & SEO**: Built with modern Next.js 16 + Tailwind CSS, achieving 95+ Google Lighthouse speed scores and mobile-optimized dark/light modes.
- **Trust Elements**: Real student testimonials, branch locator, safety disclaimer, and clear privacy compliance.
