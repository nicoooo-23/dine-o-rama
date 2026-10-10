<template>
  <nav>
    <div class="navin">
      <a class="brand" href="#" @click.prevent="$router.push('/')">
        <img src="/src/assets/images/dino.png" alt="Dine-O-Rama logo">
        <span>Dine-O-Rama</span>
      </a>

      <button class="menu-toggle" @click="isOpen = !isOpen" :aria-expanded="isOpen">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-links" :class="{ active: isOpen }">
        <a class="link" :class="{ on: $route.path === '/' }" @click.prevent="$router.push('/')">Home</a>
        <a class="link" :class="{ on: $route.path === '/restaurants' }" @click.prevent="$router.push('/restaurants')">Restaurants</a>
        <a class="link" :class="{ on: $route.path === '/terms' }" @click.prevent="$router.push('/terms')">Terms of Service</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
