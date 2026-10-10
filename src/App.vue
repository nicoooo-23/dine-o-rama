<template>
  <div>
    <NavBar />
    <router-view />
    <footer class="site-footer">
      <b>© ADDBASE. Gozum | Nengasca | Pepito | Rivera. All Rights Reserved.</b>
      <br>
      <b>WCSERVER. Santos</b>
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>
