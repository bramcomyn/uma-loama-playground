<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app-content">
    <h1>Policy & Access Request Endpoint Tester</h1>
    <div class="app-container">
      <nav>
        <RouterLink to="/policies">Policy Endpoint Tester</RouterLink>
        <RouterLink to="/requests">Access Request Endpoint Tester</RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
}

.app-content {
  max-width: 100%;
  max-height: 100%;
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
  margin: 0 2rem 2rem;
  padding: 2rem 0 0;
  display: flex;
  flex-direction: column;
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
