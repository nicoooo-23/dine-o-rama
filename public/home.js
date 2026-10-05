// Restaurant listing: public search and restaurant cards
let restaurants = [];

function search(q) {
  const cuisine = $('cuisineFilter').value;
  const minimumRating = Number($('ratingFilter').value) || 0;
  const location = $('locationFilter').value;
  const normalizedQuery = q.toLowerCase();
  const data = restaurants.filter(r => {
    const matchesQuery = !normalizedQuery || [r.name, r.cuisine, r.address]
      .some(value => String(value || '').toLowerCase().includes(normalizedQuery));
    return matchesQuery
      && (!cuisine || r.cuisine === cuisine)
      && (!location || r.address === location)
      && Number(r.rating) >= minimumRating;
  });

  $('heading').textContent = q ? `Results for "${q}"` : 'All restaurants';
  $('resultCount').textContent = `${data.length} restaurant${data.length === 1 ? '' : 's'} found`;
  $('results').innerHTML = data.length ? data.map(r => `
    <article class="card"><span class="tag">${esc(r.cuisine || 'Restaurant')}</span>
      <h3>${esc(r.name)}</h3>
      <p class="stars">&#9733; ${esc(Number(r.rating).toFixed(1))} / 5</p>
      <p>${esc(r.address)}</p><p>${esc(r.contact)}</p></article>`).join('')
    : '<p class="empty">No restaurants match those filters. Try changing your search or filters.</p>';
}

function populateFilterOptions(select, values) {
  const firstOption = select.options[0].outerHTML;
  const options = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  select.innerHTML = firstOption + options.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('');
}

async function loadRestaurants() {
  const { ok, data } = await api('/api/restaurants');
  if (!ok) throw new Error(data.error || 'Request failed.');
  if (!Array.isArray(data)) throw new Error('Invalid restaurant data received.');
  restaurants = data;
  populateFilterOptions($('cuisineFilter'), restaurants.map(r => r.cuisine));
  populateFilterOptions($('locationFilter'), restaurants.map(r => r.address));
  const query = new URLSearchParams(window.location.search).get('q') || '';
  $('q').value = query;
  search(query);
}

$('searchForm').addEventListener('submit', e => { e.preventDefault(); search($('q').value.trim()); });
['cuisineFilter', 'ratingFilter', 'locationFilter'].forEach(id => {
  $(id).addEventListener('change', () => search($('q').value.trim()));
});
$('clearFilters').addEventListener('click', () => {
  $('cuisineFilter').value = '';
  $('ratingFilter').value = '';
  $('locationFilter').value = '';
  $('q').value = '';
  search('');
});
loadRestaurants().catch(error => {
  $('resultCount').textContent = `Unable to load restaurants: ${error.message}`;
});
