<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import BaseLayout from '@/components/layout/BaseLayout.vue';
import TrackableTitle from '@/components/trackable/title.vue'
import TrackableBase from '@/components/trackable/base.vue'
import TrackableProperties from '@/components/trackable/properties.vue'
import TrackableTags from '@/components/trackable/tags.vue'
import TrackableImages from '@/components/trackable/images.vue'
import TrackableLinkedTrackables from '@/components/trackable/linkedTrackables.vue'
import TrackableSameSeries from '@/components/trackable/TrackablesSameSeries.vue'
import TrackableSameTag from '@/components/trackable/TrackablesSameTag.vue'

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();

function goToListItem(id) {
  router.push("/trackables#trackable-item-"+id)
}

async function onDelete() {
  confirm.require({
    message: 'Möchtest du das Trackable löschen?',
    header: 'Löschen',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
        label: 'Abbrechn',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: 'Löschen',
        severity: 'danger',
    },
    accept: async () => {
      try {
        await storeTrackable.deleteTrackable();
        router.push('/trackables');
      } catch (error) {
        toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
        console.log(error);
      }
    },
    reject: () => {}
  })
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <BaseLayout>
    <template v-slot:header>
      <TrackableTitle/>
    </template>
    <template v-slot:mainstage>
      <TrackableBase/>
      <TrackableImages/>
      <TrackableTags/>
      <TrackableProperties/>
      <TrackableLinkedTrackables property="linkedTrackables"/>
      <TrackableSameSeries :series="storeTrackable.series" :self="storeTrackable.private_code"/>
      <TrackableSameTag :series="storeTrackable.series" :self="storeTrackable.private_code" :tags="storeTrackable.tags"/>
    </template>
    <template v-slot:footer>
      <div class="flex align-items-center pt-2 pb-2">
        <div class="flex-grow-0 flex-shrink-0">
          <Button @click="goToListItem(storeTrackable.id)" label="Zurück" icon="pi pi-angle-double-left"/>
        </div>
        <div class="flex-grow-1 flex-shrink-1" style="text-align: center;">
          <Button @click="onDelete" severity="danger" icon="pi pi-trash" label="Löschen"/>
        </div>
        <div class="flex-grow-0 flex-shrink-0" style="text-align: right;">
          <span v-show="storeTrackable.progress" class="pi pi-spin pi-spinner" style="font-size: 1.5rem"/>
        </div>
        <!--
        <div class="flex-grow-0 flex-shrink-0">
          <Button @click="" icon="pi pi-refresh" label="Aktualisieren" class="mr-2"/>
          <Button @click="" icon="pi pi-save" label="Speichern" class="mr-2"/>
        </div>
        -->
      </div>
    </template>
  </BaseLayout>
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
