<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import { useTrackableStore } from "@/di/trackables.js"
import { useLocalStorageRef } from '@/utils/localStorageRef';

// components
import PersistentPanel from '@/components/trackable/panel.vue'

const storeTrackable = useTrackableStore();
const collapsed = useLocalStorageRef('details.layout.images.collapsed', false)

const deleteImage = (image_id) => {
  storeTrackable.deleteImage(image_id);
}
const primaryImage = (image_id) => {
  console.log("***")
  // storeTrackable.deleteImage(image_id);
}
</script>

<template>
  <Panel class="mx-2 my-2" v-model:collapsed="collapsed" header="Bilder" toggleable>
    <Galleria :value="storeTrackable.images" class="w-full"
    :responsiveOptions="responsiveOptions" :numVisible="5"
    :showItemNavigators="true"
    >
      <template #item="slotProps">
        <div class="gallery-image-wrapper">
          <img :src="`http://localhost:8000/images/${slotProps?.item.filename}`" :alt="slotProps.item.filename" class="gallery-image" />

          <div class="gallery-controls-right">
            <Button @click="primaryImage(slotProps?.item.id)" label="❤️ Like" size="small"/>
            <Button @click="deleteImage(slotProps?.item.id)" label="🗑️ Delete" severity="danger" size="small"/>
          </div>
          <div class="gallery-controls-left">
            {{ storeTrackable.images.length }}
          </div>
        </div>
      </template>
      <template #thumbnail="slotProps">
        <!-- <div style="border: 1px solid #ccc; border-radius: 8px; width: 96px; height: 96px; " class="p-2"> -->
        <img :src="`http://localhost:8000/images/${slotProps.item.filename}`" :alt="slotProps.item.filename" style="width: 96px;"/>
        <!-- </div> -->
      </template>
    </Galleria>
  </Panel>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
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

.gallery-controls-right {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}
.gallery-controls-left {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.image-controls button {
}

</style>
