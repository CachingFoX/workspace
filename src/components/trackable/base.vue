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
import PersistentPanel from '@/components/trackable/panel.vue'
import PropertySeries from '@/components/trackable/details/property_series.vue'
import PropertyString from '@/components/trackable/details/property_string.vue'
import PropertyOwner from '@/components/trackable/details/property_owner.vue'
import PropertyCode from '@/components/trackable/details/property_code.vue'


const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();

const xOwner = computed(() => {
  return
});
const xCreatedDate = computed(()=> {
  console.log(storeTrackable.created);
});

const items = ref([
  { 'name': 'Trackable Code', 'component': PropertyCode,   value: storeTrackable.private_code },
  { 'name': 'Public Code',    'component': PropertyCode,   value: storeTrackable.public_code },
  { 'name': 'Serie',          'component': PropertySeries, value: storeTrackable.series },
  { 'name': 'Owner',          'component': PropertyOwner,  value: { 'activated': storeTrackable.activated, 'owner': storeTrackable.owner } },
  { 'name': 'Created',        'component': PropertyString, value: storeTrackable.created },
  { 'name': 'Updated',        'component': PropertyString, value: storeTrackable.updated },
]);


function yyy(x) {
  if (typeof x == 'string') {
    return storeTrackable[x]
  } else {
    return x.value;
  }
}
</script>

<template>
  <PersistentPanel storage-key="trackable.details.basics">
    <template #header>
      <div class="flex align-items-center gap-2">
        <Avatar :image="storeTrackable.icon" shape="circle" />
        <span class="font-bold text-xl">{{ storeTrackable.name }}</span>
      </div>
    </template>
    <div class="grid-container">
      <template v-for="(item, index) in items" :key="index" >
        <div v-if="item.value">{{item.name}}</div>
        <div v-if="item.value"><component :is="item.component" :value="item.value"></component></div>
      </template>

    </div>
  </PersistentPanel>
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
  grid-gap: 2px; /* Abstand zwischen den Elementen */
  column-gap: 10px;
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
