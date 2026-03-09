<script setup>
import { onMounted, onUnmounted } from 'vue'
import CenterLayout from '@/components/layout/CenterLayout.vue';
import { useApiStore } from '@/di/trackables.js';
import ProgressSpinner from 'primevue/progressspinner';

const storeApi = useApiStore()

onMounted(() => {
  storeApi.startConnectToApi();
})

onUnmounted(() => {
  storeApi.stopConnectToApi();
})
</script>

<template>
  <CenterLayout>
    <div class="flex flex-column">
      <ProgressSpinner />
      <div class="font-bold text-xl m-9">Wait for the backend</div>
    </div>
  </CenterLayout>
</template>
