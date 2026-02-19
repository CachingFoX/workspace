<script setup>
import { watch, onMounted, computed, onBeforeMount } from 'vue'
// Components
import TrackableDetails from '../components/TrackableDetails.vue';
import TrackableLoad from '../components/TrackableLoad.vue';
import TrackableUnknown from '@/components/trackable/unknown.vue';

import BaseLayout from '@/components/layout/BaseLayout.vue';
import CenterLayout from '@/components/layout/CenterLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import { STATE_UNKNOWN,
  STATE_LOADING_DB, STATE_LOADING_HQ,
  STATE_NO_INIT, STATE_READY } from '../stores/trackableStore.js'
import { useRoute, useRouter } from 'vue-router';
import { useTrackableStore } from "../di/trackables.js"
import { useTagsStore } from "@/di/trackables.js"

const storeTrackable = useTrackableStore();
const storeTags = useTagsStore();
const router = useRouter();
const route = useRoute();


/*
watch(
  () => storeTrackable.state,
  (newState, oldState) => {
    console.log("storeTrackable.state changed:", oldState, "-->", newState)
    if (newState === STATE_UNKNOWN) {

    if (newState === STATE_UNKNOWN) {
      // router.push("/trackable/unknown/"+storeTrackable.trackingNumber);
    } else {
    }
  }
)
*/

/*
watch(
  () => storeTrackable.progress,
  (newState, oldState) => {
    console.log("storeTrackable.progress changed:", oldState, "->", newState);
    // TODO show progress spinner with blocked background in UI
  }
)
*/

/*
watch(
  () => storeTags.progress,
  (newState, oldState) => {
    console.log("storeTags.progress changed:", oldState, "->", newState);
    // TODO show progress spinner with blocked background in UI
  }
)
*/

watch(
  () => route.params.id,
  (newState, oldState) => {
    storeTrackable.loadTrackable(route.params.id.toUpperCase());
  }
)

const trackingNumber = computed(()=>{
  return route.params.id.toUpperCase()
})

onBeforeMount(()=>{
  storeTrackable.$reset()
})

onMounted(async () => {
  await storeTags.load();
  // TODO place it better
  storeTrackable.loadTrackable(trackingNumber.value);
})
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>

Fetch data for trackable {{storeTrackable.trackingNumber}}

    <template v-slot:mainstage>
      <TrackableLoad          v-if="storeTrackable.state == STATE_NO_INIT" text="Lade Trackable"/>
      <TrackableLoad     v-else-if="storeTrackable.state == STATE_LOADING_DB" :text="`Lade ${trackingNumber}`"/>
      <TrackableLoad     v-else-if="storeTrackable.state == STATE_LOADING_HQ" :text="`Lade ${trackingNumber} von www.geocaching.com`"/>
      <TrackableUnknown  v-else-if="storeTrackable.state == STATE_UNKNOWN" :tracking-number="trackingNumber"/>
      <TrackableDetails  v-else-if="storeTrackable.state == STATE_READY" />
      <CenterLayout     v-else>
        Unhandled state '{{storeTrackable.state}}'
      </CenterLayout>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
