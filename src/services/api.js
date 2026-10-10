export async function api(url, method = 'GET', body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (method !== 'GET' && body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));

  return { ok: res.ok, data };
}
