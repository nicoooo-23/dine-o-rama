<template>
  <main id="restaurants">
    <h1>Explore our restaurants</h1>
    <form class="search restaurant-search" @submit.prevent="handleSearch">
      <input v-model="query" type="search" maxlength="50" placeholder="Try Filipino, grill, Angeles..." aria-label="Search restaurants">
      <button class="btn" type="submit">Search</button>
    </form>

    <h2 id="heading">{{ heading }}</h2>

    <div class="filters" aria-label="Filter restaurants">
      <label>Cuisine
        <select v-model="filters.cuisine">
          <option value="">All cuisines</option>
          <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label>Rating
        <select v-model="filters.rating">
          <option value="">Any rating</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </label>
      <label>Location
        <select v-model="filters.location">
          <option value="">All locations</option>
          <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
        </select>
      </label>
      <button class="btn ghost" @click="clearFilters" type="button">Clear filters</button>
    </div>

    <p class="result-count" role="status" aria-live="polite">{{ resultCount }}</p>
    <div class="grid" aria-live="polite">
      <RestaurantCard v-for="r in filteredRestaurants" :key="r._id" :restaurant="r" />
      <p v-if="filteredRestaurants.length === 0" class="empty">
        No restaurants match those filters. Try changing your search or filters.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard.vue';

const route = useRoute();
const router = useRouter();

const restaurants = ref([]);
const query = ref(route.query.q || '');
const filters = ref({ cuisine: '', rating: '', location: '' });

const cuisines = computed(() => [...new Set(restaurants.value.map(r => r.cuisine).filter(Boolean))].sort());
const locations = computed(() => [...new Set(restaurants.value.map(r => r.address).filter(Boolean))].sort());

const filteredRestaurants = computed(() => {
  const q = query.value.toLowerCase();
  return restaurants.value.filter(r => {
    const matchesQuery = !q || [r.name, r.cuisine, r.address].some(v => String(v || '').toLowerCase().includes(q));
    const matchesCuisine = !filters.value.cuisine || r.cuisine === filters.value.cuisine;
    const matchesLocation = !filters.value.location || r.address === filters.value.location;
    const matchesRating = !filters.value.rating || Number(r.rating) >= Number(filters.value.rating);
    return matchesQuery && matchesCuisine && matchesLocation && matchesRating;
  });
});

const heading = computed(() => query.value ? `Results for "${query.value}"` : 'All restaurants');
const resultCount = computed(() => `${filteredRestaurants.value.length} restaurant${filteredRestaurants.value.length === 1 ? '' : 's'} found`);

async function load() {
  const { ok, data } = await api('/api/restaurants');
  if (ok) restaurants.value = Array.isArray(data) ? data : [];
}

function handleSearch() {
  router.push({ query: { q: query.value } });
}

function clearFilters() {
  filters.value = { cuisine: '', rating: '', location: '' };
  query.value = '';
  router.push({ query: {} });
}

onMounted(load);

watch(() => route.query.q, (newQ) => {
  query.value = newQ || '';
});
</script>
