<script setup>
import { computed,ref, watch, onBeforeMount, onMounted, nextTick } from 'vue'

import ProgressBar from 'primevue/progressbar';

import CenterLayout from '@/components/layout/CenterLayout.vue'
import { useTrackableStore } from "@/di/trackables.js"

const storeTrackable = useTrackableStore();

const isDragging = ref(false)
const isUploading = ref(false)
const progress = ref(0);
const current_file = ref('')
let dragCounter = 0

const onDragEnter = (event) => {
  dragCounter++
  isDragging.value = true
}

const onDragOver = (event) => {
  // notwendig damit drop funktioniert
  event.dataTransfer.dropEffect = 'copy'
}

const onDragLeave = () => {
  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

const onDrop = (event) => {
  isDragging.value = false
  dragCounter = 0

  const files = Array.from(event.dataTransfer.files)
  if (files.length) {
    handleUpload(files)
  }
}

/**
 * Skeleton für Upload-Handler
 */
const handleUpload = async (files) => {
  try {
    isUploading.value = true;
    await nextTick();
    // Beispiel-Skeleton:
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    storeTrackable.uploadImages(formData, (percent, currentfile) => {
        progress.value = percent;
        current_file.value = currentfile
      }).then(console.log)
        .catch(console.error);
      } catch (error) {
        // TODO toast
        console.error("Fehler beim Upload:", error)
      } finally {
        isUploading.value = false;
      }
}

</script>

<template>
  <div class="dropzone"
    :class="{ 'dropzone-active': isDragging }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >

    <slot />

    <div v-if="isDragging" class="dropzone-overlay">
      <CenterLayout class="dropzone-overlay-inner">
        <div class="flex flex-column gap-5">
          <div style="text-align: center">
            <div class="dropzone-upload-icon pi pi-upload p-7"></div>
          </div>
          <div class="dropzone-upload-text">Drop the files to upload</div>
        </div>
      </CenterLayout>
    </div>

    <div v-if="isUploading" class="dropzone-overlay">

        <div class="flex flex-column align-items-center">
          <div class="dropzone-upload-text">Uploading</div>

          <div style="text-align: center; width: 400px;" class="my-5">
            <ProgressBar :value="progress"></ProgressBar>
          </div>

          <div class="dropzone-upload-text-sm">{{ current_file }}</div>
        </div>

    </div>
  </div>
</template>

<style scoped>
.xxx {
   display: flex;           /* Flexbox aktivieren */
  flex-direction: column;  /* Kinder untereinander */
  align-items: center;     /* horizontal zentrieren */
  justify-content: flex-start; /* optional: vertikale Ausrichtung oben */
  gap: 10px;
}
.dropzone {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dropzone-active {
  cursor: copy;
}

.dropzone-overlay {
  position: fixed;
  inset: 0;
  background: rgba(128, 128, 128, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 5px;
  color: #64748b;
}

.dropzone-overlay-inner {
  width: 100%;
  height: 100%;
  border-width: 3px;
  border-style: dashed;
  border-radius: 20px;
}

.dropzone-upload-icon {
  font-size: 196px;
  border-radius: 9999px !important;
  border-width: 10px !important;
  border-style: solid;
}

.dropzone-upload-text {
  text-align: center;
  font-size: 36px;
  font-weight: 1000;
}

.dropzone-upload-text-sm {
  text-align: center;
  font-size: 24px;
  font-weight: 1000;
}
</style>
