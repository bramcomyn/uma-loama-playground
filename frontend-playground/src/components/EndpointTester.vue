<script setup lang="ts">
import { ref, computed } from 'vue';
import { Method, Party } from '../lib/requests';

// properties for reusability
const props = defineProps<{
    title: string,
    defaultEndpointUrl: string,
    defaultPath: string,
    selectedResourceName: string,
    sendRequest: (method: Method, url: string, id: string, selected?: string) => 
        Promise<{ request: string, response: Response, created?: string }>
}>();

// state

const authorizationServerURL = ref(props.defaultEndpointUrl);
const path = ref(props.defaultPath);
const url = computed(() => authorizationServerURL.value + path.value);

const requestingPartyID = ref("https://example.pod.knows.idlab.ugent.be/profile/card#me");
const resourceOwnerID = ref("https://solidweb.me/harrypodder/profile/card#me");
const party = ref(Party.RP);

const changeParty = () => {
    switch (party.value) {
        case Party.RO:
            party.value = Party.RP ;
            break ;
        case Party.RP:
            party.value = Party.RO ;
            break ;
        default:
            break ;
    }
}

const lastRequest = ref('');
const lastResponse = ref('');
const lastStatus = ref(0);
const lastStatusText = ref('');

const selected = ref('');
const selectedResources = ref([
  props.selectedResourceName
]);

const send = async (method: Method, party: Party) => {
    const id = party === Party.RO ? resourceOwnerID.value : requestingPartyID.value;
    const { request, response, created } = await props.sendRequest(
        method, url.value, id, selected.value
    );

    lastRequest.value = request;
    lastStatus.value = response.status;
    lastStatusText.value = response.statusText;
    
    lastResponse.value = await response.text();

    if (created && !selectedResources.value.includes(created)) {
      selectedResources.value.push(created);
      selected.value = created;
    }
}

const clear = () => {
  lastRequest.value = '';
  lastResponse.value = '';
  lastStatus.value = 0;
  lastStatusText.value = '';
};
</script>

<template>
    <div class="container">
        <h2>{{ props.title }}</h2>
        <div class="content">
            <div class="left">
                <div class="main configuration">
                    <h2>Configuration</h2>
                    <label for="authorization-server-url">Authorization Server</label>
                    <input id="authorization-server-url" type="text" placeholder="enter authorization server URL" v-model="authorizationServerURL" />

                    <label for="path">Path</label>
                    <input id="path" type="text" placeholder="enter path" v-model="path" />

                    <label for="requesting-party-id">Requesting Party</label>
                    <input id="requesting-party-id" type="text" placeholder="enter requesting party webid" v-model="requestingPartyID" />

                    <label for="resource-owner-id">Resource Owner</label>
                    <input id="resource-owner-id" type="text" placeholder="enter resource owner webid" v-model="resourceOwnerID" />

                    <label for="selected-uri">Resource URI</label>
                    <select id="selected-uri" v-model="selected">
                    <option disabled value="">-- choose a resource --</option>
                    <option :value="null">-- create new --</option>
                    <option v-for="resource in selectedResources" :key="resource" :value="resource">
                        {{ resource }}
                    </option>
                    </select>
                </div>
                <div class="main buttons">
                    <button @click.prevent="send(Method.GET, party)" class="get">send GET</button>
                    <button @click.prevent="send(Method.POST, party)" class="post">send POST</button>
                    <button @click.prevent="send(Method.PATCH, party)" class="patch">send PATCH</button>
                </div>
                <div class="main change-party-button">
                    <button :value="party" @click.prevent="changeParty()">Send request as: {{ party }} (click to change)</button>
                </div>
                <div class="main clear-button">
                    <button @click.prevent="clear()">clear request and responses</button>
                </div>
            </div>
            <div class="right">
                <div class="main request">
                    <h2>Request</h2>
                    <pre>{{ lastRequest }}</pre>
                </div>

                <div class="main response">
                    <h2>Response</h2>
                    <h3 v-if="lastStatus">{{ lastStatus }} {{ lastStatusText }}</h3>
                    <pre>{{ lastResponse }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.content {
  display: flex;
  flex-wrap: wrap; /* allows right to fall below left */
  gap: 2rem;
}

.left, .right {
  flex: 1 1 0;        /* flex-grow, flex-shrink, flex-basis */
  min-width: 300px;   /* prevents being too tiny */
}

.left {
  max-width: 40%;
}

.right {
  max-width: 60%;
}

/* Responsive adjustment */
@media (max-width: 800px) {
  .left, .right {
    max-width: 100%;  /* full width when stacked */
  }
}

.configuration {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

label {
  font-weight: 600;
  color: #444;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

button {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.get {
  background: #6caed9; /* matte blue */
  color: white;
}

.post {
  background: #7da87b; /* matte green */
  color: white;
}

.patch {
  background: #d9a46c; /* matte orange */
  color: white;
}

.delete {
  background: #c77b7b; /* matte red */
  color: white;
}

.change-party-button,
.clear-button {
  margin-top: 1rem;
  display: flex;
}

.change-party-button button,
.clear-button button {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.change-party-button button {
  background: #444;   /* dark neutral shade */
}

.clear-button button {
  background: #999;   /* matte gray */
}

.change-party-button button:hover,
.clear-button button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

select {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: system-ui, sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  color: #333;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
}

select option[disabled] {
  color: #888;
}

select option {
  color: #333;
}

.request pre,
.response pre {
  background: #f5f5f5;   /* light background to distinguish */
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1rem;
  max-height: 400px;     /* keeps it from growing infinitely */
  overflow-x: auto;      /* horizontal scroll if line too long */
  overflow-y: auto;      /* vertical scroll if text too tall */
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
