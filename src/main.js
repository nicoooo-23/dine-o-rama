import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import RestaurantsView from './views/RestaurantsView.vue';
import AdminView from './views/AdminView.vue';
import TermsView from './views/TermsView.vue';
import './assets/style.css';

const routes = [
  { path: '/', component: HomeView },
  { path: '/restaurants', component: RestaurantsView },
  { path: '/admin', component: AdminView },
  { path: '/terms', component: TermsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
