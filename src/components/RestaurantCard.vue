<template>
  <article class="card">
    <span class="tag">{{ restaurant.cuisine || 'Restaurant' }}</span>
    <h3>{{ restaurant.name }}</h3>
    <p class="stars">&#9733; {{ Number(restaurant.rating).toFixed(1) }} / 5</p>
    <p>{{ restaurant.address }}</p>
    <p>{{ restaurant.contact }}</p>
  </article>
</template>

<script setup>
defineProps(['restaurant']);
</script>
