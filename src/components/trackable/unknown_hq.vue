<script setup>
import Button from 'primevue/button';
import { useTrackableStore } from "@/di/trackables.js"
import { computed, onBeforeMount } from 'vue';

const storeTrackable = useTrackableStore();

const props = defineProps({
  'trackingNumber': { type: String, default: "", required: true },
})
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center row-gap-0" style="height: 100%;">
    <div class="font-bold font-huge">?</div>
    <div class="font-big">Trackable <b>{{props.trackingNumber}}</b> existiert nicht.</div>
  </div>
</template>

<style scoped>
div > div {
  text-align: center;
}
.font-huge {
  font-size: 30vh;
}
.font-big {
  font-size: 24pt;
}
.font-normal {
  font-size: 16pt;
}
</style>
