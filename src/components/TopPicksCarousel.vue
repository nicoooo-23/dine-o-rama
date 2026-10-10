<template>
  <div class="popular-grid" ref="grid">
    <p v-if="loading">Loading our top picks...</p>
    <template v-else-if="topThree.length > 0">
      <article v-for="(r, i) in topThree" :key="r._id" class="popular-card" @click="selectedRestaurant = r">
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

  <!-- Expanded Modal Overlay -->
  <Transition name="fade">
    <div v-if="selectedRestaurant" class="modal-overlay" @click.self="selectedRestaurant = null">
      <div class="expanded-card">
        <button class="close-btn" @click="selectedRestaurant = null">&times;</button>
        <span class="popular-rank">Featured Pick</span>
        <h3>{{ selectedRestaurant.name }}</h3>
        <span class="popular-cuisine">{{ selectedRestaurant.cuisine }}</span>
        <p class="popular-rating">★ {{ Number(selectedRestaurant.rating).toFixed(1) }} / 5</p>
        <p class="popular-address">
          <i class="fa-solid fa-location-dot" style="color: black; margin-right: 6px;"></i>
          {{ selectedRestaurant.address }}
        </p>
        <p class="popular-contact" v-if="selectedRestaurant.contact">☎ {{ selectedRestaurant.contact }}</p>
      </div>
    </div>
  </Transition>

  <div class="popular-dots" ref="dots"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';

const restaurants = ref([]);
const loading = ref(true);
const grid = ref(null);
const dots = ref(null);
const selectedRestaurant = ref(null);

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

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 20px;
}

.expanded-card {
  background: #fff;
  padding: 40px;
  border-radius: 32px;
  position: relative;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  text-align: center;
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--bar);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--deep);
  display: grid;
  place-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
