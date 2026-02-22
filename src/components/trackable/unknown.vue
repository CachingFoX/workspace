<script setup>
import Button from 'primevue/button';
import { useTrackableStore } from "@/di/trackables.js"
import { computed } from 'vue';

const storeTrackable = useTrackableStore();

const props = defineProps({
  'trackingNumber': { type: String, default: "", required: true },
})

function onClick() {
  storeTrackable.readTrackableHQ(props.trackingNumber);
}

const isPublicCode = computed(()=>{
  return props.trackingNumber.startsWith("TB")
})
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center row-gap-0" style="height: 100%;">
    <div class="font-bold font-huge">?</div>
    <div class="font-big">Trackable <b>{{props.trackingNumber}}</b> ist nicht in der Datenbank enthalten</div>
    <div class="font-normal mt-2" v-show="!isPublicCode">
      Den Trackable bei www.geocaching.com abfragen?
    </div>
    <Button class="mt-2" v-show="!isPublicCode" label="Abfragen" @click="onClick"/>
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
