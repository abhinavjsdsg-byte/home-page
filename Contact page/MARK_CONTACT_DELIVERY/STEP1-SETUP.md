# MARK GROUPS — Step 1: Real Lead Database + API

This step fixes the cross-device `localStorage` bug without changing the approved MARK UI.

## Architecture

Customer phone/laptop
→ `contact.html`
→ `POST /api/leads`
→ Node/Express API
→ Supabase PostgreSQL

The Supabase `service_role` key stays on the server and is never sent to the browser.

## Setup

### 1. Create a Supabase project

Create a project in Supabase, then open **SQL Editor**.

Run:

`supabase/001_create_leads.sql`

### 2. Configure the API

Copy `.env.example` to `.env` and fill:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT=3000`

**Never commit `.env` or expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.**

### 3. Install and run

```bash
npm install
npm start
```

Open:

`http://localhost:3000/contact.html`

Health check:

`http://localhost:3000/api/health`

### 4. Verify the database

Submit the contact form and check the `public.leads` table in Supabase.

Expected status:

`201 Created`

Expected first status:

`NEW`

## Production

When the site and API are deployed separately, set `MARK_API_BASE` before loading `js/contact.js`, for example:

```html
<script>window.MARK_API_BASE = 'https://api.markgroups.in';</script>
<script src="js/contact.js"></script>
```

Then set `ALLOWED_ORIGINS` on the API to your real website origin(s).

## What is deliberately NOT done in Step 1

- Admin reads are not connected yet.
- Admin status updates are not connected yet.
- No localStorage lead storage remains in the contact page.
- UI/CSS is not redesigned.

Those belong to Step 2: Admin → Supabase.
