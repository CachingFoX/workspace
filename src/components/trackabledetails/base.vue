<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Panel from 'primevue/panel';
import Avatar from 'primevue/avatar';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import TrackableGridItem from '@/components/TrackableGridItem.vue';

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();

const xOwner = computed(() => {
  return storeTrackable.activated ? storeTrackable.owner : "not activated"
});

const items = [
  { 'name': 'Trackable Code', 'model': 'private_code', 'type': 'read-only' },
  { 'name': 'Public Code', 'model': 'public_code', 'type': 'read-only' },
  { 'name': 'Serie', 'model': 'series', 'type': 'read-only' },
  { 'name': 'Owner', 'model': xOwner, 'type': 'read-only' },
  { 'name': 'Created', 'model': 'created', 'type': 'read-only' },
  { 'name': 'Updated', 'model': 'updated', 'type': 'read-only'},
]


function yyy(x) {
  if (typeof x == 'string') {
    return storeTrackable[x]
  } else {
    return x.value;
  }
}
</script>

<template>
  <Panel header="Basis Information" class="m-2">
    <template #header>
      <div class="flex align-items-center gap-2">
        <Avatar :image="storeTrackable.icon" shape="circle" />
        <span class="font-bold text-xl">{{ storeTrackable.name }}</span>
      </div>
    </template>

    <div class="grid-container">
      <TrackableGridItem v-for="(item, index) in items" :key="index"
        :label="item.name" :attribute="item.model" :type="item.type">
        <template #read-only>
          <div class="px-2">
            <span class="px-1" style="border: 1px solid transparent;">{{ yyy(item.model) }}</span>
          </div>
        </template>
      </TrackableGridItem>
    </div>
  </Panel>
</template>

<style scoped>

  .title {
  margin:0;
  font-size: 26pt;
  font-weight: bold;
}

/* Container für das Grid */
.grid-container {
  display: grid; /* Grid aktivieren */
  grid-template-columns: auto 1fr;
  grid-gap: 10px; /* Abstand zwischen den Elementen */
  padding: 0;
}

/* Grid-Items */
.grid-container > div {
  padding: 0 12px0px;
  text-align: left;
  align-self: center;
}

.grid-container > div:nth-child(odd) {
  font-weight: bold;
}

.grid-container > div.top-left-corner {
  align-self: start;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.gallery-image-wrapper {
  /*
  width: 512px;
  height: 512px;
  */
  width: 384px;
  height: 384px;
  display: flex;
  justify-content: center; /* horizontal zentrieren */
  align-items: center;     /* vertikal zentrieren */
  overflow: hidden;        /* überschüssiges Bild abschneiden */
  background-color: #f5f5f5; /* optional, für leere Flächen */
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Bild skalieren, ohne das Seitenverhältnis zu verzerren */
}

/* Overlay oben rechts */
.image-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}
.image-controls button {
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

</style>
