<script setup>
import './main.css'
import Toast from 'primevue/toast';
import { onBeforeMount } from 'vue';
import { tagService, trackableService, commonService, tokenService, trackablePropertiesService, trackableImagesService } from "./di/trackables.js"
import { useToast } from 'primevue';


const toast = useToast();

async function onError(owner, message, response) {
  const status = response.status;
  const body = await response.text();
  console.error(`${owner}: ${message} (status=${status}): ${body}`);
  toast.add({
    severity: 'error',
    summary: `API Error at ${owner}`,
    detail: `${message} (${status}): ${body}`,
    life: 10000,
  });
  // throw new Error(`${owner}: ${message} (${status}): ${body}`);
}

onBeforeMount(() => {
  commonService.registerErrorNotification(onError);
  tagService.registerErrorNotification(onError);
  tokenService.registerErrorNotification(onError);
  trackableService.registerErrorNotification(onError);
  trackablePropertiesService.registerErrorNotification(onError);
  trackableImagesService.registerErrorNotification(onError);
  // TODO GeocachingService
});
</script>

<template>
  <router-view/>
  <Toast/>
</template>

<style scoped>
</style>


