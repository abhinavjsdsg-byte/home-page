MARK GROUPS — STEP 1 READY PACKAGE

1. Open backend/.env.example
2. Copy it and rename the copy to .env
3. Put your Supabase URL in SUPABASE_URL
4. Put your Supabase secret key in SUPABASE_SERVICE_ROLE_KEY
5. In Supabase SQL Editor, run backend/supabase/001_create_leads.sql
6. Open a terminal in backend and run:
   npm install
   npm start

Do NOT put the secret key in contact.html or any frontend JS.
Do NOT send the secret key to anyone.

The current website/admin files are inside MARK_CONTACT_DELIVERY.
