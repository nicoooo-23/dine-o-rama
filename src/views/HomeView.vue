<template>
  <div class="herowrap">
    <section class="hero hero-home">
      <div class="hero-home-intro">
        <div class="hero-copy">
          <p class="eyebrow">Dine-O-Rama food court presents</p>
          <h1>Find your next meal</h1>
          <p class="tagline">Where every craving finds a table.</p>
          <p class="lead">Search our food court by restaurant, cuisine or location.</p>
        </div>
        <div class="photo">
          <img src="/src/assets/images/logo.png" alt="Dine-O-Rama dinosaur mascot">
        </div>
      </div>
      <form class="search home-search" @submit.prevent="handleSearch">
        <input v-model="query" type="search" maxlength="50" placeholder="Try Filipino, grill, Angeles..." aria-label="Search restaurants">
        <button class="btn" type="submit">Search</button>
      </form>
    </section>
  </div>

  <section class="why-section">
    <div class="section-heading">
      <span class="section-tag">A LITTLE ABOUT US</span>
      <h2>Why <span>Dine-O-Rama?</span></h2>
      <p>Good food, happy tummies, and new places to discover!</p>
    </div>
    <div class="why-grid">
      <article class="why-card">
        <div class="why-icon"><i class="fa-solid fa-utensils"></i></div>
        <h3>Something for Every Craving</h3>
        <p>Discover Filipino favorites and international cuisines all in one place.</p>
      </article>
      <article class="why-card">
        <div class="why-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h3>Easy Restaurant Search</h3>
        <p>Find restaurants by name, cuisine, or location in just a few clicks.</p>
      </article>
      <article class="why-card">
        <div class="why-icon"><i class="fa-solid fa-star"></i></div>
        <h3>Discover Top-Rated Spots</h3>
        <p>Explore restaurant ratings and find inspiration for your next meal.</p>
      </article>
    </div>
  </section>

  <section class="popular-section">
    <div class="section-heading">
      <span class="section-tag">FOODIE FAVORITES</span>
      <h2>Our Top <span>3 Picks!</span></h2>
      <p>Meet the highest-rated restaurants in our directory!</p>
    </div>
    <TopPicksCarousel />
    <div class="popular-action">
      <button @click="$router.push('/restaurants')" class="btn">Explore All Restaurants</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TopPicksCarousel from '../components/TopPicksCarousel.vue';

const router = useRouter();
const query = ref('');

function handleSearch() {
  router.push({ path: '/restaurants', query: { q: query.value } });
}
</script>
