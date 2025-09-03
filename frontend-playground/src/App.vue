<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="content">
    <h1>Policy & Access Request Endpoint Tester</h1>
    <nav>
      <RouterLink to="/policies">Policy Endpoint Tester</RouterLink>
      <RouterLink to="/requests">Access Request Endpoint Tester</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
.content {
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  color: #444;
  background: #f3f3f3;
}

nav a:hover {
  background: #e2e2e2;
  transform: translateY(-2px);
}

nav a.router-link-active {
  background: #007bff;
  color: white;
}
</style>
