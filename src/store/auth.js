import { reactive } from 'vue';

export const authStore = reactive({
  isAdmin: false,
  async checkAuth() {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      this.isAdmin = !!data.admin;
    } catch (e) {
      this.isAdmin = false;
    }
  }
});
