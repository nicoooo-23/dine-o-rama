<template>
  <div class="terms-container">
    <h1>Terms of Service</h1>
    <p class="last-updated">Last Updated: October 10, 2026</p>

    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Dine-O-Rama, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
    </section>

    <section>
      <h2>2. Use of Service</h2>
      <p>Dine-O-Rama provides a directory of food court restaurants. We strive for accuracy, but we do not guarantee that the restaurant information (ratings, contact, addresses) is always current or correct.</p>
    </section>

    <section>
      <h2>3. User Conduct</h2>
      <p>You agree not to use the service for any unlawful purpose or to attempt to interfere with the proper working of the site, including unauthorized access to the admin panel.</p>
    </section>

    <section>
      <h2>4. Limitation of Liability</h2>
      <p>Dine-O-Rama is provided "as is". We are not responsible for any inaccuracies in the listings or for the actual service provided by the restaurants listed in our directory.</p>
    </section>

    <section>
      <h2>5. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of the updated terms.</p>
    </section>

    <div class="terms-footer">
      <button @click="$router.push('/')" class="btn ghost">Return Home</button>
    </div>
  </div>
</template>

<style scoped>
.terms-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  line-height: 1.6;
  color: #333;
}
.last-updated {
  font-style: italic;
  color: #666;
  margin-bottom: 2rem;
}
section {
  margin-bottom: 2rem;
}
h1 {
  text-align: center;
  color: var(--green);
}
h2 {
  color: var(--bar);
  border-bottom: 2px solid var(--cream);
  padding-bottom: 0.5rem;
}
.terms-footer {
  text-align: center;
  margin-top: 3rem;
}
</style>
