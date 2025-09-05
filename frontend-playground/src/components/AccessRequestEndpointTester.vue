<script setup lang="ts">
import EndpointTester from './EndpointTester.vue';
import { sendAccessRequest } from '@/lib/requests';
</script>

<template>
    <EndpointTester
        title="Access Request Endpoint Tester"
        default-endpoint-url="http://localhost:4000"
        default-path="/uma/requests"
        selected-resource-name="request"
        :send-request="sendAccessRequest"
    />
</template>

<style>

</style>
