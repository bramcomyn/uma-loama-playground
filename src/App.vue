<script setup lang="ts">
import { computed } from 'vue';
import { useControllerStore } from './stores/controller';

const controllerStore = useControllerStore();
const types = computed(() => Array.from(controllerStore.types));
</script>

<template>
  <h1>Authorization Server Selection</h1>
  <div>
    <label for="authorization-server-url">Select your Authorization Server</label>
    <input
      id="authorization-server-url"
      v-model="controllerStore.authorizationServerURL"
      @change="console.log(controllerStore.authorizationServerURL)"
      placeholder="Enter your AS's URL"
    />
  </div>
  <div>
    <label for="authorization-server-type">Select the type of your Authorization Server</label>
    <select
      v-model="controllerStore.currentControllerType"
      @change="console.log(controllerStore.type)"
    >
      <option v-for="type of types" :key="type">{{ type }}</option>
    </select>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}

input:focus,
select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

select {
  background-color: #fff;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em;
  cursor: pointer;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

input:hover,
select:hover {
  border-color: #888;
}

.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
