<script setup lang="ts">
import EndpointTester from './EndpointTester.vue';
import { sendPolicyRequest } from '@/lib/requests';
</script>

<template>
    <EndpointTester
        title="Policy Endpoint Tester"
        default-endpoint-url="http://localhost:4000"
        default-path="/uma/policies"
        selected-resource-name="policy"
        :send-request="sendPolicyRequest"
    />
</template>

<style>

</style>
