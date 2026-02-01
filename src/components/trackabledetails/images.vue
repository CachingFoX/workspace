<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Panel from 'primevue/panel';
import Galleria from 'primevue/galleria';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import Upload from '@/components/Upload.vue'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const data = storeTrackable.data;
</script>

<template>
  <Panel class="m-2" toggleable>
    <template #header>
      <div class="flex align-items-center gap-2">
        <span class="font-bold text-xl" style="color: var(--p-surface-500)">Bilder</span>
      </div>
    </template>
    <div class="flex flex-row gap-2 w-full">
      <div v-if="storeTrackable.images.length" class="flex-grow-1 flex-shrink-0">
        <Galleria v-model:activeIndex="activeIndex" :value="storeTrackable.images" class="w-full"
        :responsiveOptions="responsiveOptions" :numVisible="5"
        :showItemNavigators="true"
        >
          <template #item="slotProps">
            <div class="gallery-image-wrapper">
              <img :src="`http://localhost:8000/images/${slotProps.item.filename}`" :alt="slotProps.item.filename" class="gallery-image" />

              <div class="image-controls">
                <input type="checkbox"/>Primär
                <button @click="likeImage(index)">❤️ Like</button>
                <button @click="deleteImage(index)">🗑️ Delete</button>
              </div>
            </div>
          </template>
          <template #thumbnail="slotProps">
            <!-- <div style="border: 1px solid #ccc; border-radius: 8px; width: 96px; height: 96px; " class="p-2"> -->
            <img :src="`http://localhost:8000/images/${slotProps.item.filename}`" :alt="slotProps.item.filename" style="width: 96px;"/>
            <!-- </div> -->
          </template>
        </Galleria>
      </div>
      <div class="flex-grow-1 flex-shrink-1">
        <Upload :name="data?.private_code" class="w-full h-full"></Upload>
      </div>
    </div>
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
