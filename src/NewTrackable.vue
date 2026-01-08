<script setup>
import { computed,ref } from 'vue'
/*
import { defineProps } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
  */


const trackingCode = ref('')
const message = ref('')
const loading = ref(false)
const ok = ref(false);
const warning = ref(false);
let data = ref(null)


const checkTracking = async () => {
  message.value = ''
  loading.value = true
  data.value = null;

  try {
    const response = await fetch(
      `http://localhost:8000/extern/trackables/?trackingcode=${encodeURIComponent(trackingCode.value)}`
    )

    const text = await response.text()

    ok.value = false;
    if (response.status === 200) {
      ok.value = true;
      data = JSON.parse(text)
    } else if (response.status === 404) {
      message.value = 'TB-Code existiert nicht'
    } else {
      message.value = `Status: ${response.status}\nAntwort: ${text}`
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Trackable-Daten:', error)
    message.value = 'Server nicht erreichbar'
  } finally {
    loading.value = false
  }
}

const create_trackable = async () => {

  // POST-Request mit fetch
  fetch("http://127.0.0.1:8000/trackables", {
    method: "POST",               // POST-Methode
    headers: {
      "Content-Type": "application/json"  // Wir senden JSON
    },
    body: JSON.stringify(data)  // JS-Objekt in JSON umwandeln
  })
  .then(response => {
    if (!response.ok) {
      // Fehler abfangen
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();  // Antwort JSON parsen
  })
  .then(data => {
    console.log("trackable erstellt:", data);
  })
  .catch(error => {
    console.error("Fehler beim Erstellen des Users:", error);
  });
}

</script>

<template>
  <h1>New Trackable</h1>

    <input
      v-model="trackingCode"
      placeholder="Tracking-Code eingeben"
      @keyup.enter="checkTracking"
    />

    <button @click="checkTracking">Absenden</button>

    <div v-if="loading">
      Lade...
    </div>

    <div v-show="!ok">
      <div >{{message}}</div>
    </div>

    <div v-show="!loading && ok && data">
      <div class="flex flex-column justify-between items-start gap-0" v-if="data">
        <div class="flex gap-1">
          <div style="padding: 2px;"><img style="width: 36px;" :src="`https://www.geocaching.com${data.icon_url}`" :alt="data.name" /></div>
          <div style="flex: 1;">
            <div class="font-bold">{{ data.title }}</div>
            <div><span class="font-medium text-surface-000 dark:text-surface-000 text-sm">{{ data.series }}</span></div>
          </div>
          <div>
            Owner: {{data.owner}}
          </div>
          <div>
            <!--
            <button v-show="!data.activated" @click="create_trackable" style="height: 100%; padding: 0 12px;">Hinzufügen</button>
            <button v-show="data.activated" style="height: 100%; padding: 0 12px;">Anzeigen</button>
          -->
            <button @click="create_trackable" style="height: 100%; padding: 0 12px;">Hinzufügen</button>
          </div>
        </div>

      </div>
    </div>
    <hr/>

</template>

<style scoped>
.trackable-header {
  background: #fff;/* #f0f0f0;*/
  display: flex;
  font-weight: bold;
  margin-right: 0px;
  margin-left: 0px;
  padding: 8px 0px;
  width: 100%;
}
.trackable-line {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
.trackable-line:hover {
  background: #f5f5f5;
}
</style>
