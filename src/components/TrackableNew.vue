<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
// import { TrackableService } from "../services/TrackableService.js";
import { trackableService } from "../di/trackables.js"
import ProgressSpinner from 'primevue/progressspinner';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import { createGeocachingService } from '@/services/GeocachingService';
import { defaultAPIConfiguration } from '@/di/services.js'

// --- Service ---
const geocachingService = createGeocachingService(defaultAPIConfiguration);
const toast = useToast();
const router = useRouter();


const props = defineProps({
  name: {
    type: String,
    required: true
  },
})

const trackable_reference_code = ref(props.name) // use reference the trackable by this code
const data = ref(null);
const isImageLoaded = ref(false);

async function onCreate() {
  try {
    const result = await trackableService.createTrackable(data.value);
    router.push('/trackable/'+data.value.private_code);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
    console.log(error);
  }
}

async function onLoad() {
  try {
    const result = await geocachingService.getTrackableData(trackable_reference_code.value);
    data.value = result;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
    console.log(error);
  }
}

onMounted(async () => {
  onLoad();
})
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center">
    <ProgressSpinner v-if="!data"/>
    <div v-if="!data" class="message">Fetch data for trackable {{trackable_reference_code}}</div>
    <div v-if="data">
      <div class="grid pt-3" style="width: 750px;">
        <div class="col-12">
          <div class="flex gap-1 pb-2" style="border-bottom: 1px solid #ccc;">
            <div style="width: 38px; height: 38px;">
              <Skeleton v-show="!isImageLoaded"
                shape="circle"
                size="100%"
                style="padding: 2px;"/>
              <img v-show="isImageLoaded"
                style="width: 100%"
                :src="`https://www.geocaching.com${data.icon_url}`"
                :alt="data.name"
                @load="isImageLoaded = true;"/>
            </div>
            <div style="flex: 1; align-self: center;">
              <div class="title">{{ data?.title }}</div>
            </div>
          </div>
        </div>
        <div class="col-3">Private Code</div>
        <div class="col-9">{{ data.private_code }}</div>
        <div class="col-3">Public Code</div>
        <div class="col-9">{{ data.public_code }}</div>
        <div class="col-3">Series</div>
        <div class="col-9">{{ data.series  }}</div>
        <div class="col-3" v-if="data.activated">Owner</div>
        <div class="col-9" v-if="data.activated">{{ data.owner }}</div>
        <div class="col-12" v-if="!data.activated">not activated</div>
        <div class="col-12"><Button label="New" @click="onCreate"/></div>
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
.grid div:nth-child(2n+1) {
  font-weight: bold;;
}
</style>
