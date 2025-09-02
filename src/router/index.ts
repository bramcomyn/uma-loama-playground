import PolicyEndpointTester from '@/components/PolicyEndpointTester.vue';
import AccessRequestEndpointTester from '@/components/AccessRequestEndpointTester.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/policies', component: PolicyEndpointTester },
    { path: '/requests', component: AccessRequestEndpointTester }
  ],
});

export default router;
