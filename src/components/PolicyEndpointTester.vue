<script setup lang="ts">
import EndpointTester from './EndpointTester.vue';
import { sendPolicyRequest } from '@/lib/requests';
</script>

<template>
    <EndpointTester
        title="Policy Endpoint Tester"
        default-endpoint-url="http://localhost:5000"
        default-path="/uma/policies"
        :send-request="sendPolicyRequest"
    />
</template>

<style>

</style>
