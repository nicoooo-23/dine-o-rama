<template>
  <div class="popular-grid" ref="grid">
    <p v-if="loading">Loading our top picks...</p>
    <template v-else-if="topThree.length > 0">
      <article v-for="(r, i) in topThree" :key="r._id" class="popular-card">
        <span class="popular-rank">No. {{ i + 1 }} Pick</span>
        <h3>{{ r.name || 'Unnamed Restaurant' }}</h3>
        <span class="popular-cuisine">{{ r.cuisine || 'Various Cuisine' }}</span>
        <p class="popular-rating">★ {{ Number(r.rating).toFixed(1) }} / 5</p>
        <p class="popular-address">
          <i class="fa-solid fa-location-dot" style="color: black; margin-right: 6px;"></i>
          {{ r.address || 'Location unavailable' }}
        </p>
        <p class="popular-contact" v-if="r.contact">☎ {{ r.contact }}</p>
      </article>
    </template>
    <p v-else>No rated restaurants to show just yet.</p>
  </div>
  <div class="popular-dots" ref="dots"></div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { api } from '../services/api';

const restaurants = ref([]);
const loading = ref(true);
const grid = ref(null);
const dots = ref(null);

const topThree = computed(() => {
  return [...restaurants.value]
    .filter(r => r.rating !== null && !isNaN(Number(r.rating)))
    .sort((a, b) => Number(b.rating) - Number(a.rating) || Number(a._id) - Number(b._id))
    .slice(0, 3);
});

async function load() {
  loading.value = true;
  const { ok, data } = await api('/api/restaurants');
  if (ok) {
    restaurants.value = Array.isArray(data) ? data : (data.restaurants || []);
  }
  loading.value = false;
  updateDots();
}

function updateDots() {
  if (!dots.value || topThree.value.length < 2) return;
  dots.value.innerHTML = '';
  topThree.value.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'popular-dot';
    dot.onclick = () => {
      const cards = grid.value.querySelectorAll('.popular-card');
      if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    dots.value.appendChild(dot);
  });
}

onMounted(load);
</script>
