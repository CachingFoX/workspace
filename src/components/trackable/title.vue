<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import IconField from 'primevue/iconfield';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import Panel from 'primevue/panel';
import Image from 'primevue/image';
import Avatar from 'primevue/avatar';
import { useRouter, useRoute } from 'vue-router';
import Galleria from 'primevue/galleria';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
// components

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const data = storeTrackable.data;
const isImageLoaded = ref(false)
</script>

<template>
  <div class="p-2 pb-0 flex flex-column justify-between items-start gap-0 content-center w-full" >
    <div class="flex gap-1 pb-2" style="border-bottom: 1px solid #ccc;">
      <div style="width: 38px; height: 38px;">
        <Skeleton v-show="!isImageLoaded"
          shape="circle"
          size="100%"
          style="padding: 2px;"/>
        <img v-show="isImageLoaded"
          style="width: 100%"
          :src="storeTrackable.icon"
          :alt="storeTrackable.name"
          @load="isImageLoaded = true;"/>
      </div>
      <div style="flex: 1; align-self: center;">
        <div class="title">{{ storeTrackable.name }}</div>
      </div>
    </div>
  </div>
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
