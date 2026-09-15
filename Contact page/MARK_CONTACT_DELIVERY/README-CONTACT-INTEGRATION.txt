MARK GROUPS — CONTACT PAGE + LEAD MANAGEMENT INTEGRATION

WHAT CHANGED
1. Added contact.html — separate luxury Contact Us page matching the approved UI.
2. Added css/contact.css — responsive contact page styling.
3. Added js/contact.js — 2-minute form, validation, UTM/referrer capture, lead ID and localStorage lead bridge.
4. Updated index.html — Contact / Quote CTAs now open contact.html; sector CTAs preselect the correct sector.
5. Updated js/main.js — safe when the old embedded contact section is removed.
6. Updated admin.html — uses the fuller existing admin UI and labels Enquiries as Lead Management.
7. Updated js/admin.js — merges public contact leads into the existing enquiryService and supports the lead pipeline.
8. Kept the existing js/data.js untouched. IMPORTANT: copy/merge these files into the existing project; do not delete your existing js/data.js.

LEAD FLOW
Website Contact Page
  -> localStorage key: mark_public_leads
  -> Admin Lead Management
  -> NEW
  -> CONTACTED
  -> QUALIFIED
  -> SITE VISIT
  -> QUOTATION
  -> NEGOTIATION
  -> WON / LOST / ON HOLD

CAPTURED DATA
Lead ID, name, phone, email, sector, project location, message, source,
landing page, UTM source/medium/campaign, referrer, date/time and status.

IMPORTANT
This phase is a working front-end/localStorage integration. It is NOT a secure production backend.
For production hosting, replace the localStorage bridge with an API/Supabase/PostgreSQL endpoint.
The admin panel currently keeps its existing development login/data architecture.
