// Helpers shared by both pages
const $ = id => document.getElementById(id);
// Escape text before putting it in HTML (prevents script injection)
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// JSON fetch helper; returns {ok, data}
// JSON fetch helper; returns {ok, data}
async function api(url, method = 'GET', body) {
  const opts = { method, headers: {} };
  if (method !== 'GET') {            // every write request is labeled as JSON
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body ?? {});
  }
  const res = await fetch(url, opts);
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

// Navigation 
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
  // Close menu after clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}