/* ============================================================
   MARK GROUPS — Admin Panel
   Mock auth for this first working version: swap checkLogin()
   for a real API/Supabase/Firebase call when a backend exists.
   ============================================================ */

const DEMO_ADMIN = { email: 'admin@markgroups.in', password: 'mark2026' };
const SESSION_KEY = 'mark_admin_session';

/* ---------------- backend lead bridge ----------------
  Lead records are loaded and updated through the admin API. */
const LEAD_PIPELINE = ['NEW','CONTACTED','QUALIFIED','SITE VISIT','QUOTATION','NEGOTIATION','WON','LOST','ON HOLD','CLOSED'];
async function getAllLeads() {
  try {
    const response = await fetch('/api/admin/leads');

    if (!response.ok) {
      throw new Error('Unable to load leads');
    }

    const data = await response.json();

    return (data.leads || []).map(lead => ({
      ...lead,
      sector: lead.sector || lead.interested_in,
      location: lead.location || lead.project_location,
      date: lead.date || lead.created_at
    }));
  } catch (error) {
    console.error('GET ALL LEADS ERROR:', error);
    return [];
  }
}
async function updateLeadStatus(leadId, newStatus) {
  try {
    const response = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message || 'Unable to update lead status'
      );
    }

    console.log('Lead status updated successfully');

    await renderDashboard();
    await renderEnquiriesTable();
  } catch (error) {
    console.error('UPDATE LEAD STATUS ERROR:', error);

    alert('Unable to update lead status. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem(SESSION_KEY)) {
    showAdmin();
  } else {
    showLogin();
  }
  wireLogin();
});

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminShell').style.display = 'none';
}

function showAdmin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminShell').style.display = 'flex';
  initRouter();
  wireSidebarMobile();
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.hash = '';
    showLogin();
  });
}

function wireLogin() {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.getElementById('loginError').style.display = 'none';
      showAdmin();
    } else {
      document.getElementById('loginError').style.display = 'block';
    }
  });
  const pwToggle = document.getElementById('pwToggle');
  const pwInput = document.getElementById('loginPassword');
  pwToggle.addEventListener('click', () => {
    const show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    pwToggle.textContent = show ? 'Hide' : 'Show';
  });
}

/* ---------------- mobile sidebar ---------------- */
function wireSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle = document.getElementById('sidebarToggle');
  toggle.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
  overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
  document.querySelectorAll('.a-nav a').forEach(a => a.addEventListener('click', () => {
    sidebar.classList.remove('open'); overlay.classList.remove('open');
  }));
}

/* ---------------- routing ---------------- */
const VIEW_TITLES = {
  dashboard: 'Dashboard', projects: 'Projects', properties: 'Properties',
  enquiries: 'Lead Management', materials: 'Materials', media: 'Media Library',
  content: 'Basic Site Content', settings: 'Settings'
};

function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
  renderDashboard();
  renderProjectsTable();
  renderPropertiesTable();
  renderEnquiriesTable();
  renderMaterialsGrid();
  renderMediaGrid();
  wireContentForm();
  wireSettingsForm();
  wireAddButtons();
  wireFilters();
  wireQuickActions();
}

function renderRoute() {
  const view = (location.hash || '#dashboard').replace('#', '');
  document.querySelectorAll('.a-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.a-nav a').forEach(a => a.classList.remove('active'));
  const target = document.getElementById('view-' + view) ? view : 'dashboard';
  document.getElementById('view-' + target).classList.add('active');
  const navLink = document.querySelector(`.a-nav a[data-view="${target}"]`);
  if (navLink) navLink.classList.add('active');
  document.getElementById('topbarTitle').textContent = VIEW_TITLES[target] || 'Dashboard';
  if (target === 'dashboard') renderDashboard();
}

/* ---------------- shared helpers ---------------- */
function esc(str) { const d = document.createElement('div'); d.textContent = str == null ? '' : str; return d.innerHTML; }
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(); } catch (e) { return iso; } }

function hashStr(str) {
  let h = 0; for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0;
  return h;
}
function gradientFor(id) {
  const h = hashStr(id) % 360;
  return `linear-gradient(150deg, hsl(${h},22%,26%), hsl(${h},18%,10%))`;
}

const STATUS_CLASS_MAP = {
  'completed': 'green', 'available': 'green', 'published': 'green', 'active': 'green',
  'ongoing': 'blue', 'contacted': 'blue', 'in progress': 'blue',
  'upcoming': 'gold', 'coming soon': 'gold', 'new': 'gold', 'draft': 'gold',
  'sold out': 'muted', 'archived': 'muted', 'closed': 'muted'
};
function statusBadge(status) {
  const cls = STATUS_CLASS_MAP[(status || '').toLowerCase()] || 'gold';
  return `<span class="badge ${cls}">${esc(status || '—')}</span>`;
}

/* ---------------- dashboard ---------------- */
async function renderDashboard() {
  const projects = projectService.getAll();
  const properties = propertyService.getAll();
  const enquiries = await getAllLeads();
  const materials = materialService.getAll();

  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statProperties').textContent = properties.length;
  document.getElementById('statEnquiries').textContent = enquiries.filter(e => e.status === 'NEW').length;
  document.getElementById('statMaterials').textContent = materials.length;

  document.getElementById('trendProjects').textContent = 'All-time';
  document.getElementById('trendProjects').className = 'stat-trend';
  document.getElementById('trendProperties').textContent = 'All-time';
  document.getElementById('trendProperties').className = 'stat-trend';
  document.getElementById('trendMaterials').textContent = 'All-time';
  document.getElementById('trendMaterials').className = 'stat-trend';

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = enquiries.filter(e => new Date(e.created_at).getTime() >= weekAgo).length;
  const trendE = document.getElementById('trendEnquiries');
  trendE.textContent = thisWeek > 0 ? `+${thisWeek} this wk` : 'No new';
  trendE.className = 'stat-trend ' + (thisWeek > 0 ? 'up' : '');

  const recentE = document.getElementById('recentEnquiries');
  recentE.innerHTML = enquiries.slice(0, 5).map(e => `
    <tr><td data-label="Name">${esc(e.name)}</td><td data-label="Sector">${esc(e.interested_in || '—')}</td><td data-label="Email">${esc(e.email)}</td><td data-label="Date">${fmtDate(e.created_at)}</td><td data-label="Status">${statusBadge(e.status)}</td></tr>
  `).join('') || `<tr class="empty-row"><td colspan="5">No enquiries yet.</td></tr>`;

  const recentP = document.getElementById('recentProjects');
  recentP.innerHTML = projects.slice(0, 5).map(p => `
    <tr><td data-label="Title">${esc(p.title)}</td><td data-label="Sector">${esc(p.sector)}</td><td data-label="Location">${esc(p.location)}</td><td data-label="Year">${p.year}</td><td data-label="Status">${statusBadge(p.status)}</td></tr>
  `).join('') || `<tr class="empty-row"><td colspan="5">No projects yet.</td></tr>`;
}

function wireQuickActions() {
  document.getElementById('qaAddProject').addEventListener('click', () => { location.hash = '#projects'; setTimeout(() => openProjectModal(null), 50); });
  document.getElementById('qaAddProperty').addEventListener('click', () => { location.hash = '#properties'; setTimeout(() => openPropertyModal(null), 50); });
  document.getElementById('qaViewEnquiries').addEventListener('click', () => { location.hash = '#enquiries'; });
  document.getElementById('qaManageMaterials').addEventListener('click', () => { location.hash = '#materials'; });
}

/* ---------------- filter row toggles ---------------- */
function wireFilters() {
  document.getElementById('pjFilterToggle').addEventListener('click', () => document.getElementById('pjFilterRow').classList.toggle('open'));
  document.getElementById('prFilterToggle').addEventListener('click', () => document.getElementById('prFilterRow').classList.toggle('open'));
  document.getElementById('enFilterToggle').addEventListener('click', () => document.getElementById('enFilterRow').classList.toggle('open'));
}

function populateSelect(select, values, placeholder) {
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  [...new Set(values)].filter(Boolean).forEach(v => {
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v;
    if (v === current) opt.selected = true;
    select.appendChild(opt);
  });
}

/* ---------------- PROJECTS CRUD ---------------- */
let activeProjectSectorAdmin = 'All';
function renderProjectsTable() {
  const tbody = document.getElementById('projectsTable');
  const all = projectService.getAll();
  const search = (document.getElementById('pjSearch').value || '').toLowerCase();
  const locSel = document.getElementById('pjLocation');
  const statusSel = document.getElementById('pjStatus');
  const yearSel = document.getElementById('pjYear');

  populateSelect(locSel, all.map(p => p.location), 'All Locations');
  populateSelect(statusSel, all.map(p => p.status), 'All Status');
  populateSelect(yearSel, all.map(p => String(p.year)).sort().reverse(), 'All Years');

  const items = all.filter(p =>
    (activeProjectSectorAdmin === 'All' || p.sector === activeProjectSectorAdmin) &&
    (!locSel.value || p.location === locSel.value) &&
    (!statusSel.value || p.status === statusSel.value) &&
    (!yearSel.value || String(p.year) === yearSel.value) &&
    (!search || p.title.toLowerCase().includes(search) || p.location.toLowerCase().includes(search))
  );

  tbody.innerHTML = items.length ? items.map(p => `
    <tr>
      <td data-label="Image"><span class="row-thumb" style="background:${gradientFor(p.id)}"></span></td>
      <td data-label="Title">${esc(p.title)}</td><td data-label="Sector">${esc(p.sector)}</td><td data-label="Location">${esc(p.location)}</td><td data-label="Year">${p.year}</td><td data-label="Status">${statusBadge(p.status)}</td>
      <td class="row-actions" data-label="">
        <button class="icon-action" data-edit-project="${p.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
        <button class="icon-action danger" data-del-project="${p.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="7">No projects match. Try a different search or add a new one.</td></tr>`;

  tbody.querySelectorAll('[data-edit-project]').forEach(b => b.addEventListener('click', () => openProjectModal(b.dataset.editProject)));
  tbody.querySelectorAll('[data-del-project]').forEach(b => b.addEventListener('click', () => {
    if (confirm('Delete this project? This cannot be undone.')) { projectService.remove(b.dataset.delProject); renderProjectsTable(); renderDashboard(); }
  }));
}

function wireProjectTabs() {
  document.querySelectorAll('#projectTabs .a-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('#projectTabs .a-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeProjectSectorAdmin = tab.dataset.sector;
    renderProjectsTable();
  }));
  document.getElementById('pjSearch').addEventListener('input', renderProjectsTable);
  ['pjLocation', 'pjStatus', 'pjYear'].forEach(id => document.getElementById(id).addEventListener('change', renderProjectsTable));
}

function openProjectModal(id) {
  const p = id ? projectService.get(id) : null;
  const body = `
    <h2>${p ? 'Edit Project' : 'Add Project'}</h2>
    <form id="entityForm">
      <div class="a-field"><label>Project Name</label><input name="title" value="${esc(p?.title)}" required></div>
      <div class="a-field"><label>Sector</label>
        <select name="sector">${SECTORS.map(s => `<option ${p?.sector===s?'selected':''}>${s}</option>`).join('')}</select>
      </div>
      <div class="a-field"><label>Location</label><input name="location" value="${esc(p?.location)}" required></div>
      <div class="a-field"><label>Year</label><input name="year" type="number" value="${p?.year || new Date().getFullYear()}" required></div>
      <div class="a-field"><label>Status</label>
        <select name="status">
          ${['Ongoing','Completed','Upcoming'].map(s => `<option ${p?.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="a-field"><label>Description</label><textarea name="description">${esc(p?.description)}</textarea></div>
      <div class="a-field"><label>Services (comma separated)</label><input name="services" value="${esc((p?.services||[]).join(', '))}"></div>
      <div class="a-field"><label>Materials (comma separated)</label><input name="materials" value="${esc((p?.materials||[]).join(', '))}"></div>
      <div class="a-modal-actions">
        <button type="button" class="a-btn" id="cancelModal">Cancel</button>
        <button type="submit" class="a-btn gold">Save</button>
      </div>
    </form>`;
  openModal(body, (form) => {
    const d = Object.fromEntries(new FormData(form).entries());
    d.year = parseInt(d.year, 10);
    d.services = d.services.split(',').map(s => s.trim()).filter(Boolean);
    d.materials = d.materials.split(',').map(s => s.trim()).filter(Boolean);
    if (p) projectService.update(p.id, d); else projectService.add(d);
    renderProjectsTable(); renderDashboard(); closeModal();
  });
}

/* ---------------- PROPERTIES CRUD ---------------- */
function renderPropertiesTable() {
  const tbody = document.getElementById('propertiesTable');
  const all = propertyService.getAll();
  const search = (document.getElementById('prSearch').value || '').toLowerCase();
  const locSel = document.getElementById('prLocation');
  const typeSel = document.getElementById('prType');
  const statusSel = document.getElementById('prStatus');

  populateSelect(locSel, all.map(p => p.location), 'All Locations');
  populateSelect(typeSel, all.map(p => p.type), 'All Types');
  populateSelect(statusSel, all.map(p => p.status), 'All Status');

  const items = all.filter(p =>
    (!locSel.value || p.location === locSel.value) &&
    (!typeSel.value || p.type === typeSel.value) &&
    (!statusSel.value || p.status === statusSel.value) &&
    (!search || p.title.toLowerCase().includes(search) || p.location.toLowerCase().includes(search))
  );

  tbody.innerHTML = items.length ? items.map(p => `
    <tr>
      <td data-label="Image"><span class="row-thumb" style="background:${gradientFor(p.id)}"></span></td>
      <td data-label="Title">${esc(p.title)}</td><td data-label="Location">${esc(p.location)}</td><td data-label="Type">${esc(p.type)}</td><td data-label="Budget">${esc(p.budget)}</td><td data-label="Status">${statusBadge(p.status)}</td>
      <td class="row-actions" data-label="">
        <button class="icon-action" data-edit-property="${p.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
        <button class="icon-action danger" data-del-property="${p.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="7">No properties match. Try a different search or add a new one.</td></tr>`;

  tbody.querySelectorAll('[data-edit-property]').forEach(b => b.addEventListener('click', () => openPropertyModal(b.dataset.editProperty)));
  tbody.querySelectorAll('[data-del-property]').forEach(b => b.addEventListener('click', () => {
    if (confirm('Delete this property?')) { propertyService.remove(b.dataset.delProperty); renderPropertiesTable(); renderDashboard(); }
  }));
}

function wirePropertyFilters() {
  document.getElementById('prSearch').addEventListener('input', renderPropertiesTable);
  ['prLocation', 'prType', 'prStatus'].forEach(id => document.getElementById(id).addEventListener('change', renderPropertiesTable));
}

function openPropertyModal(id) {
  const p = id ? propertyService.get(id) : null;
  const body = `
    <h2>${p ? 'Edit Property' : 'Add Property'}</h2>
    <form id="entityForm">
      <div class="a-field"><label>Property Name</label><input name="title" value="${esc(p?.title)}" required></div>
      <div class="a-field"><label>Location</label><input name="location" value="${esc(p?.location)}" required></div>
      <div class="a-field"><label>Property Type</label><input name="type" value="${esc(p?.type)}" placeholder="Villas, Apartments, Plots..." required></div>
      <div class="a-field"><label>Budget</label><input name="budget" value="${esc(p?.budget)}" placeholder="₹85 Lakhs" required></div>
      <div class="a-field"><label>Status</label>
        <select name="status">
          ${['Available','Coming Soon','Sold Out'].map(s => `<option ${p?.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="a-field"><label>Description</label><textarea name="description">${esc(p?.description)}</textarea></div>
      <div class="a-modal-actions">
        <button type="button" class="a-btn" id="cancelModal">Cancel</button>
        <button type="submit" class="a-btn gold">Save</button>
      </div>
    </form>`;
  openModal(body, (form) => {
    const d = Object.fromEntries(new FormData(form).entries());
    if (p) propertyService.update(p.id, d); else propertyService.add(d);
    renderPropertiesTable(); renderDashboard(); closeModal();
  });
}

/* ---------------- ENQUIRIES ---------------- */
async function renderEnquiriesTable() {
  const tbody = document.getElementById('enquiriesTable');
  const all = await getAllLeads();
  const search = (document.getElementById('enSearch').value || '').toLowerCase();
  const statusSel = document.getElementById('enStatus');

  const items = all.filter(e =>
    (!statusSel.value || e.status === statusSel.value) &&
    (!search || (e.name || '').toLowerCase().includes(search) || (e.email || '').toLowerCase().includes(search) || (e.phone || '').includes(search) || (e.project_location || '').toLowerCase().includes(search) || (e.source || '').toLowerCase().includes(search))
  );

  tbody.innerHTML = items.length ? items.map(e => `
    <tr>
      <td data-label="Name">${esc(e.name)}</td><td data-label="Phone">${esc(e.phone)}</td><td data-label="Email">${esc(e.email)}</td><td data-label="Sector">${esc(e.interested_in || '—')}</td><td data-label="Location">${esc(e.project_location || '—')}</td><td data-label="Source">${esc(e.source || 'Website')}</td><td data-label="Date">${fmtDate(e.created_at)}</td>
      <td data-label="Status">
        <select class="status-select" data-status-id="${e.id}">
          ${LEAD_PIPELINE.map(s => `<option ${e.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="8">No leads match the current filters. New website submissions appear here automatically.</td></tr>`;

  tbody.querySelectorAll('[data-status-id]').forEach(sel => sel.addEventListener('change', () => {
    updateLeadStatus(sel.dataset.statusId, sel.value);
  }));
}

function wireEnquiryFilters() {
  document.getElementById('enSearch').addEventListener('input', renderEnquiriesTable);
  document.getElementById('enStatus').addEventListener('change', renderEnquiriesTable);
}

/* ---------------- MATERIALS (tile grid) ---------------- */
let activeMaterialCatAdmin = 'All';
function renderMaterialsGrid() {
  const grid = document.getElementById('materialsTable');
  const tabWrap = document.getElementById('materialTabsAdmin');
  const all = materialService.getAll();
  const search = (document.getElementById('mtSearch').value || '').toLowerCase();

  if (tabWrap.children.length === 1) {
    MATERIAL_CATEGORIES.forEach(cat => {
      if (all.some(m => m.category === cat)) {
        const btn = document.createElement('button');
        btn.className = 'a-tab'; btn.dataset.cat = cat; btn.textContent = cat;
        tabWrap.appendChild(btn);
      }
    });
    tabWrap.querySelectorAll('.a-tab').forEach(btn => btn.addEventListener('click', () => {
      tabWrap.querySelectorAll('.a-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMaterialCatAdmin = btn.dataset.cat;
      renderMaterialsGrid();
    }));
  }

  const items = all.filter(m =>
    (activeMaterialCatAdmin === 'All' || m.category === activeMaterialCatAdmin) &&
    (!search || m.name.toLowerCase().includes(search))
  );

  grid.innerHTML = items.length ? items.map(m => `
    <div class="material-tile-admin">
      <div class="tile-actions">
        <button class="icon-action" data-edit-material="${m.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
        <button class="icon-action danger" data-del-material="${m.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </div>
      <div class="surface" style="background:${gradientFor(m.id)}"></div>
      <div class="info"><div class="cat">${esc(m.category)}</div><div class="nm">${esc(m.name)}</div></div>
    </div>
  `).join('') : `<div class="empty-state-tiles">No materials match. Try a different search or add one.</div>`;

  grid.querySelectorAll('[data-edit-material]').forEach(b => b.addEventListener('click', () => openMaterialModal(b.dataset.editMaterial)));
  grid.querySelectorAll('[data-del-material]').forEach(b => b.addEventListener('click', () => {
    if (confirm('Delete this material?')) { materialService.remove(b.dataset.delMaterial); renderMaterialsGrid(); renderDashboard(); }
  }));
}

function wireMaterialFilters() {
  document.getElementById('mtSearch').addEventListener('input', renderMaterialsGrid);
}

function openMaterialModal(id) {
  const m = id ? materialService.get(id) : null;
  const body = `
    <h2>${m ? 'Edit Material' : 'Add Material'}</h2>
    <form id="entityForm">
      <div class="a-field"><label>Material Name</label><input name="name" value="${esc(m?.name)}" required></div>
      <div class="a-field"><label>Category</label>
        <select name="category">${MATERIAL_CATEGORIES.map(c => `<option ${m?.category===c?'selected':''}>${c}</option>`).join('')}</select>
      </div>
      <div class="a-field"><label>Finish</label><input name="finish" value="${esc(m?.finish)}"></div>
      <div class="a-field"><label>Description</label><textarea name="description">${esc(m?.description)}</textarea></div>
      <div class="a-field"><label>Application</label><input name="application" value="${esc(m?.application)}"></div>
      <div class="a-modal-actions">
        <button type="button" class="a-btn" id="cancelModal">Cancel</button>
        <button type="submit" class="a-btn gold">Save</button>
      </div>
    </form>`;
  openModal(body, (form) => {
    const d = Object.fromEntries(new FormData(form).entries());
    if (m) materialService.update(m.id, d); else materialService.add(d);
    renderMaterialsGrid(); renderDashboard(); closeModal();
  });
}

/* ---------------- MEDIA (tile grid) ---------------- */
let activeMediaCatAdmin = 'All';
function renderMediaGrid() {
  const grid = document.getElementById('mediaTable');
  const tabWrap = document.getElementById('mediaTabsAdmin');
  const all = mediaService.getAll();
  const search = (document.getElementById('mdSearch').value || '').toLowerCase();

  if (tabWrap.children.length === 1) {
    MEDIA_CATEGORIES.forEach(cat => {
      if (all.some(m => m.category === cat)) {
        const btn = document.createElement('button');
        btn.className = 'a-tab'; btn.dataset.cat = cat; btn.textContent = cat;
        tabWrap.appendChild(btn);
      }
    });
    tabWrap.querySelectorAll('.a-tab').forEach(btn => btn.addEventListener('click', () => {
      tabWrap.querySelectorAll('.a-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMediaCatAdmin = btn.dataset.cat;
      renderMediaGrid();
    }));
  }

  const items = all.filter(m =>
    (activeMediaCatAdmin === 'All' || m.category === activeMediaCatAdmin) &&
    (!search || m.name.toLowerCase().includes(search))
  );

  grid.innerHTML = items.length ? items.map(m => `
    <div class="media-tile">
      <div class="tile-actions">
        <button class="icon-action danger" data-del-media="${m.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></button>
      </div>
      <div class="surface" style="background:${gradientFor(m.id)}"></div>
      <div class="info"><div class="nm">${esc(m.name)}</div><div class="cat">${esc(m.category)}</div></div>
    </div>
  `).join('') : `<div class="empty-state-tiles">No media match. Try a different search or upload one.</div>`;

  grid.querySelectorAll('[data-del-media]').forEach(b => b.addEventListener('click', () => {
    if (confirm('Delete this media entry?')) { mediaService.remove(b.dataset.delMedia); renderMediaGrid(); }
  }));
}

function wireMediaFilters() {
  document.getElementById('mdSearch').addEventListener('input', renderMediaGrid);
}

function openMediaModal() {
  const body = `
    <h2>Add Media</h2>
    <p style="font-size:12px;color:var(--a-muted);margin:-8px 0 16px;">Real image upload connects to storage later — for now, media is tracked by name and category.</p>
    <form id="entityForm">
      <div class="a-field"><label>Name</label><input name="name" required></div>
      <div class="a-field"><label>Category</label>
        <select name="category">${MEDIA_CATEGORIES.map(c => `<option>${c}</option>`).join('')}</select>
      </div>
      <div class="a-modal-actions">
        <button type="button" class="a-btn" id="cancelModal">Cancel</button>
        <button type="submit" class="a-btn gold">Save</button>
      </div>
    </form>`;
  openModal(body, (form) => {
    const d = Object.fromEntries(new FormData(form).entries());
    mediaService.add(d);
    renderMediaGrid(); closeModal();
  });
}

/* ---------------- CONTENT ---------------- */
function wireContentForm() {
  const c = contentService.get();
  document.getElementById('cf-heroHeadline').value = c.heroHeadline || '';
  document.getElementById('cf-heroSubtitle').value = c.heroSubtitle || '';
  document.getElementById('cf-aboutText').value = c.aboutText || '';
  document.getElementById('cf-tagline').value = c.tagline || '';
  document.getElementById('cf-contactPhone').value = c.contactPhone || '';
  document.getElementById('cf-contactWhatsapp').value = c.contactWhatsapp || '';
  document.getElementById('cf-contactEmail').value = c.contactEmail || '';
  document.getElementById('cf-contactAddress').value = c.contactAddress || '';
  document.getElementById('cf-footerText').value = c.footerText || '';
  updateContentPreview();

  document.getElementById('cf-heroHeadline').addEventListener('input', updateContentPreview);
  document.getElementById('cf-heroSubtitle').addEventListener('input', updateContentPreview);

  document.getElementById('contentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    contentService.update({
      heroHeadline: document.getElementById('cf-heroHeadline').value,
      heroSubtitle: document.getElementById('cf-heroSubtitle').value,
      aboutText: document.getElementById('cf-aboutText').value,
      tagline: document.getElementById('cf-tagline').value,
      contactPhone: document.getElementById('cf-contactPhone').value,
      contactWhatsapp: document.getElementById('cf-contactWhatsapp').value,
      contactEmail: document.getElementById('cf-contactEmail').value,
      contactAddress: document.getElementById('cf-contactAddress').value,
      footerText: document.getElementById('cf-footerText').value
    });
    const note = document.getElementById('contentSaved');
    note.textContent = 'Saved. Changes are live on the website.';
    setTimeout(() => note.textContent = '', 3000);
  });
}

function updateContentPreview() {
  document.getElementById('pvHeadline').textContent = document.getElementById('cf-heroHeadline').value || 'SPACES\nTHAT\nMATTER.';
  document.getElementById('pvSub').textContent = document.getElementById('cf-heroSubtitle').value || 'Design. Execute. Deliver.';
}

/* ---------------- SETTINGS ---------------- */
function wireSettingsForm() {
  const s = settingsService.get();
  document.getElementById('sf-siteName').value = s.siteName || 'MARK GROUPS';
  document.getElementById('sf-tagline').value = s.tagline || '';
  document.getElementById('sf-contactEmail').value = s.contactEmail || '';
  document.getElementById('sf-contactPhone').value = s.contactPhone || '';

  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    settingsService.update({
      siteName: document.getElementById('sf-siteName').value,
      tagline: document.getElementById('sf-tagline').value,
      contactEmail: document.getElementById('sf-contactEmail').value,
      contactPhone: document.getElementById('sf-contactPhone').value
    });
    const note = document.getElementById('settingsSaved');
    note.textContent = 'Saved.';
    setTimeout(() => note.textContent = '', 3000);
  });

  document.querySelectorAll('.settings-nav button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.settings-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['general', 'users', 'backup'].forEach(p => {
      document.getElementById('settingsPanel-' + p).style.display = p === btn.dataset.panel ? 'block' : 'none';
    });
  }));

  document.getElementById('exportDataBtn').addEventListener('click', async () => {
    const snapshot = {
      projects: projectService.getAll(),
      properties: propertyService.getAll(),
      materials: materialService.getAll(),
      enquiries: await getAllLeads(),
      media: mediaService.getAll(),
      content: contentService.get(),
      settings: settingsService.get()
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mark-groups-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

/* ---------------- add buttons ---------------- */
function wireAddButtons() {
  document.getElementById('addProjectBtn').addEventListener('click', () => openProjectModal(null));
  document.getElementById('addPropertyBtn').addEventListener('click', () => openPropertyModal(null));
  document.getElementById('addMaterialBtn').addEventListener('click', () => openMaterialModal(null));
  document.getElementById('addMediaBtn').addEventListener('click', () => openMediaModal());
  wireProjectTabs();
  wirePropertyFilters();
  wireEnquiryFilters();
  wireMaterialFilters();
  wireMediaFilters();
}

/* ---------------- generic modal ---------------- */
function openModal(html, onSubmit) {
  const bg = document.getElementById('modalBg');
  const content = document.getElementById('modalContent');
  content.innerHTML = html;
  bg.classList.add('open');
  content.querySelector('#cancelModal').addEventListener('click', closeModal);
  content.querySelector('#entityForm').addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmit(e.target);
  });
  bg.onclick = (e) => { if (e.target === bg) closeModal(); };
}
function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
}
