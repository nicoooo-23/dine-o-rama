<template>
  <main>
    <div id="msg" v-if="notification" :class="['msg', { err: isError }]">{{ notification }}</div>

    <section class="login" v-if="!isAdmin">
      <h2>Admin login</h2>
      <form @submit.prevent="handleLogin">
        <label for="pw">Password</label>
        <input id="pw" v-model="password" type="password" autocomplete="current-password" required>
        <button class="btn" type="submit">Log in</button>
      </form>
    </section>

    <section v-else>
      <div class="bar">
        <h2>Manage restaurants</h2>
        <div>
          <button class="btn" @click="openForm()">Add restaurant</button>
          <button class="btn ghost" @click="handleLogout">Log out</button>
        </div>
      </div>

      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Cuisine</th><th>Address</th><th>Rating</th><th>Contact</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in restaurants" :key="r._id">
              <td>{{ r.restaurant_id }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.cuisine }}</td>
              <td>{{ r.address }}</td>
              <td>{{ r.rating }}</td>
              <td>{{ r.contact }}</td>
              <td class="act">
                <button class="btn sm" @click="openForm(r._id)">Edit</button>
                <button class="btn sm warn" @click="confirmDelete(r)">Delete</button>
              </td>
            </tr>
            <tr v-if="restaurants.length === 0">
              <td colspan="7" class="empty">No restaurants yet. Add one to begin.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <dialog v-if="showDialog" ref="dialogRef" @close="showDialog = false">
      <form @submit.prevent="saveRestaurant">
        <h3 id="dlgTitle">{{ editingId ? 'Edit restaurant' : 'Add restaurant' }}</h3>
        <label for="name">Name</label>
        <input id="name" v-model="form.name" maxlength="80" required>
        <label for="cuisine">Cuisine</label>
        <input id="cuisine" v-model="form.cuisine" maxlength="50">
        <label for="address">Address</label>
        <input id="address" v-model="form.address" maxlength="120">
        <label for="rating">Rating (0 to 5)</label>
        <input id="rating" v-model.number="form.rating" type="number" min="0" max="5" step="0.1" required>
        <label for="contact">Contact</label>
        <input id="contact" v-model="form.contact" maxlength="20">
        <p>
          <button class="btn" type="submit">Save</button>
          <button class="btn ghost" type="button" @click="showDialog = false">Cancel</button>
        </p>
      </form>
    </dialog>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { api } from '../services/api';
import { authStore } from '../store/auth';

const restaurants = ref([]);
const password = ref('');
const isAdmin = ref(false);
const notification = ref('');
const isError = ref(false);
const showDialog = ref(false);
const dialogRef = ref(null);

const form = ref({ name: '', cuisine: '', address: '', rating: 0, contact: '' });
const editingId = ref(null);

async function load() {
  const { data } = await api('/api/restaurants');
  restaurants.value = Array.isArray(data) ? data : [];
}

async function handleLogin() {
  const { ok, data } = await api('/api/login', 'POST', { password: password.value });
  if (ok) {
    isAdmin.value = true;
    authStore.isAdmin = true;
    notification.value = '';
    load();
  } else {
    notification.value = data.error || 'Login failed.';
    isError.value = true;
  }
}

async function handleLogout() {
  await api('/api/logout', 'POST', {});
  isAdmin.value = false;
  authStore.isAdmin = false;
  notification.value = 'Logged out.';
  isError.value = false;
}

function openForm(id = null) {
  editingId.value = id;
  if (id) {
    const r = restaurants.value.find(x => x._id === id);
    form.value = { ...r };
  } else {
    form.value = { name: '', cuisine: '', address: '', rating: 0, contact: '' };
  }
  showDialog.value = true;
  nextTick(() => {
    dialogRef.value?.showModal();
  });
}

async function saveRestaurant() {
  const url = editingId.value ? `/api/restaurants/${editingId.value}` : '/api/restaurants';
  const method = editingId.value ? 'PUT' : 'POST';
  const { ok, data } = await api(url, method, form.value);
  if (ok) {
    notification.value = editingId.value ? 'Restaurant updated.' : 'Restaurant added.';
    isError.value = false;
    showDialog.value = false;
    load();
  } else {
    notification.value = data.error || 'Could not save.';
    isError.value = true;
  }
}

async function confirmDelete(r) {
  if (!confirm(`Delete "${r.name}"?`)) return;
  const { ok, data } = await api(`/api/restaurants/${r._id}`, 'DELETE');
  if (ok) {
    notification.value = 'Restaurant deleted.';
    isError.value = false;
    load();
  } else {
    notification.value = data.error || 'Could not delete.';
    isError.value = true;
  }
}

onMounted(async () => {
  await authStore.checkAuth();
  isAdmin.value = authStore.isAdmin;
  if (isAdmin.value) load();
});
</script>
