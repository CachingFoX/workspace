<script setup>
import { watch, onMounted } from 'vue'
// Components
import TrackableDetails from '../components/TrackableDetails.vue';
import TrackableLoad from '../components/TrackableLoad.vue';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import CenterLayout from '@/components/layout/CenterLayout.vue';
import Navbar from '@/components/Navbar.vue';
import { STATE_UNKNOWN, STATE_LOADING, STATE_NO_INIT, STATE_READY } from '../stores/trackableStore.js'
import { useRoute, useRouter } from 'vue-router';
import { useTrackableStore } from "../di/trackables.js"
import { useTagsStore } from "@/di/trackables.js"

const storeTrackable = useTrackableStore();
const storeTags = useTagsStore();
const router = useRouter();
const route = useRoute();

watch(
  () => storeTrackable.state,
  (newState, oldState) => {
    console.log("storeTrackable.state changed:", oldState, "-->", newState)
    if (newState === STATE_UNKNOWN) {
      router.push("/trackable/unknown/"+storeTrackable.trackingNumber);
    } else {
    }
  }
)

watch(
  () => storeTrackable.progress,
  (newState, oldState) => {
    console.log("storeTrackable.progress changed:", oldState, "->", newState);
    // TODO show progress spinner with blocked background in UI
  }
)

watch(
  () => storeTags.progress,
  (newState, oldState) => {
    console.log("storeTags.progress changed:", oldState, "->", newState);
    // TODO show progress spinner with blocked background in UI
  }
)

onMounted(async () => {
  await storeTags.load();
  storeTrackable.loadTrackable(route.params.id.toUpperCase());
})
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <TrackableLoad         v-if="storeTrackable.state == STATE_NO_INIT"/>
      <TrackableLoad    v-else-if="storeTrackable.state == STATE_LOADING"/>
      <TrackableDetails v-else-if="storeTrackable.state == STATE_READY" />
      <CenterLayout     v-else>
        Unhandled state '{{storeTrackable.state}}'
      </CenterLayout>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
