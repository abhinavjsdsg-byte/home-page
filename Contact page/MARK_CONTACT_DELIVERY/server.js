require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------------------------------
   SECURITY AND MIDDLEWARE
--------------------------------------- */

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
  Public website assets live in the public folder.
  Admin-specific assets still live in the project root.
*/
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

/* ---------------------------------------
   NEON DATABASE CONNECTION
--------------------------------------- */

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 5,
  statement_timeout: 8000
});

db.on("error", (error) => {
  console.error("NEON POOL ERROR:", error.message);
});

/* ---------------------------------------
   HELPER FUNCTIONS
--------------------------------------- */

function makeLeadId() {
  return `LEAD-${crypto.randomUUID()}`;
}

function clean(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

/* ---------------------------------------
   HEALTH CHECK
--------------------------------------- */

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1", [], {
      timeout: 5000
    });

    res.json({
      ok: true,
      service: "MARK GROUPS Lead API",
      database: "Neon PostgreSQL"
    });
  } catch (error) {
    console.error("HEALTH CHECK ERROR:", error);

    res.status(500).json({
      ok: false,
      error: "Database connection failed"
    });
  }
});

/* ---------------------------------------
   CREATE NEW LEAD
--------------------------------------- */

app.post("/api/leads", async (req, res) => {
  try {
    const body = req.body || {};

    const name = clean(body.name);
    const phone = clean(body.phone);
    const email = clean(body.email);

    const interestedIn = clean(
      body.interested_in || body.sector
    );

    const projectLocation = clean(
      body.project_location || body.location
    );

    const message = clean(body.message);

    const source = clean(
      body.source || "Website Contact Page"
    );

    const landingPage = clean(body.landing_page);
    const utmSource = clean(body.utm_source);
    const utmMedium = clean(body.utm_medium);
    const utmCampaign = clean(body.utm_campaign);
    const referrer = clean(body.referrer);

    if (!name || !phone || !interestedIn) {
      return res.status(400).json({
        ok: false,
        message:
          "Name, phone and interested sector are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address"
      });
    }

    const leadId = makeLeadId();

    const query = `
      INSERT INTO public.leads (
        id,
        name,
        phone,
        email,
        interested_in,
        project_location,
        message,
        source,
        landing_page,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        status,
        assigned_to,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        'NEW',
        NULL,
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    const values = [
      leadId,
      name,
      phone,
      email || null,
      interestedIn,
      projectLocation || null,
      message || null,
      source,
      landingPage || null,
      utmSource || null,
      utmMedium || null,
      utmCampaign || null,
      referrer || null
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      ok: true,
      message: "Enquiry submitted successfully",
      lead: result.rows[0]
    });
  } catch (error) {
    console.error("NEON INSERT ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: error.message,
      details: error || null
    });
  }
});

app.use((error, req, res, next) => {
  console.error("EXPRESS ERROR:", error);

  res.status(500).json({
    ok: false,
    error: error.message || "Internal server error"
  });
});

// ADMIN: GET ALL LEADS
app.get('/api/admin/leads', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        name,
        phone,
        email,
        interested_in,
        project_location,
        message,
        source,
        status,
        assigned_to,
        created_at,
        updated_at
      FROM public.leads
      ORDER BY created_at DESC
    `);

    res.json({
      ok: true,
      leads: result.rows
    });
  } catch (error) {
    console.error('ADMIN LEADS ERROR:', error.message);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// ADMIN: GET STATISTICS
app.get('/api/admin/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'NEW')::int AS new,
        COUNT(*) FILTER (WHERE status = 'CONTACTED')::int AS contacted,
        COUNT(*) FILTER (WHERE status = 'CLOSED')::int AS closed
      FROM public.leads
    `);

    res.json({
      ok: true,
      stats: result.rows[0]
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error.message);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// ADMIN: UPDATE LEAD STATUS
app.patch('/api/admin/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const result = await db.query(
      `
      UPDATE public.leads
      SET
        status = COALESCE($1, status),
        assigned_to = COALESCE($2, assigned_to),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [
        status || null,
        assigned_to || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Lead not found'
      });
    }

    res.json({
      ok: true,
      lead: result.rows[0]
    });
  } catch (error) {
    console.error('ADMIN UPDATE ERROR:', error.message);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

/* ---------------------------------------
   FRONTEND ROUTES
--------------------------------------- */

app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

/* ---------------------------------------
   FRONTEND FALLBACK
--------------------------------------- */

app.use((req, res) => {
  res.status(404).send("Page not found");
});

/* ---------------------------------------
   START SERVER
--------------------------------------- */

app.listen(PORT, () => {
  console.log(
    `MARK GROUPS SERVER RUNNING ON PORT ${PORT}`
  );
});