// Admin page: login + add / edit / delete (the server also checks admin rights on every write)
const fields = ['name', 'cuisine', 'address', 'rating', 'contact'];
let list = [], editingId = null;

function notify(text, err) {
  $('msg').innerHTML = text ? `<div class="msg${err ? ' err' : ''}">${esc(text)}</div>` : '';
}
function show(isAdmin) { $('loginBox').hidden = isAdmin; $('manager').hidden = !isAdmin; if (isAdmin) load(); }

// Load restaurants into the table
async function load() {
  const { data } = await api('/api/restaurants');
  list = Array.isArray(data) ? data : [];
  $('rows').innerHTML = list.map(r => `<tr><td>${esc(r.restaurant_id)}</td><td>${esc(r.name)}</td>
    <td>${esc(r.cuisine)}</td><td>${esc(r.address)}</td><td>${esc(r.rating)}</td><td>${esc(r.contact)}</td>
    <td class="act"><button class="btn sm" data-edit="${esc(r._id)}">Edit</button>
    <button class="btn sm warn" data-del="${esc(r._id)}">Delete</button></td></tr>`).join('')
    || '<tr><td colspan="7" class="empty">No restaurants yet. Add one to begin.</td></tr>';
}

function openForm(id) {
  editingId = id || null;
  const r = list.find(x => x._id === id) || {};
  $('dlgTitle').textContent = id ? 'Edit restaurant' : 'Add restaurant';
  fields.forEach(f => $(f).value = r[f] ?? '');
  $('dlg').showModal();
}

// Login / logout
$('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const { ok, data } = await api('/api/login', 'POST', { password: $('pw').value });
  $('pw').value = '';
  if (ok) { notify(''); show(true); } else notify(data.error || 'Login failed.', true);
});
$('logout').onclick = async () => { await api('/api/logout', 'POST', {}); notify('Logged out.'); show(false); };

// Add / update
$('form').addEventListener('submit', async () => {
  const body = {}; fields.forEach(f => body[f] = $(f).value);
  const { ok, data } = editingId ? await api('/api/restaurants/' + editingId, 'PUT', body) : await api('/api/restaurants', 'POST', body);
  if (ok) { notify(editingId ? 'Restaurant updated.' : 'Restaurant added.'); load(); }
  else { notify(data.error || 'Could not save.', true); if (data.error === 'Admin login required.') show(false); }
});

// Edit / delete buttons (event delegation, no inline scripts)
$('rows').addEventListener('click', async e => {
  const edit = e.target.dataset.edit, del = e.target.dataset.del;
  if (edit) return openForm(edit);
  if (del) {
    const r = list.find(x => x._id === del);
    if (!confirm(`Delete "${r.name}"?`)) return;
    const { ok, data } = await api('/api/restaurants/' + del, 'DELETE');
    if (ok) { notify('Restaurant deleted.'); load(); } else notify(data.error || 'Could not delete.', true);
  }
});
$('addBtn').onclick = () => openForm();
$('cancel').onclick = () => $('dlg').close();

api('/api/me').then(({ data }) => show(!!data.admin));
