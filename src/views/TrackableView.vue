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

const storeTrackable = useTrackableStore();
const router = useRouter();
const route = useRoute();

watch(
  () => storeTrackable.status,
  (newState, oldState) => {
    if (newState === STATE_UNKNOWN) {
      router.push("/trackable/unknown/"+storeTrackable.load_code);
    } else {
      console.log("status changed:", oldState, "-->", newState)
    }
  }
)

onMounted(async () => {
  storeTrackable.loadTrackable(route.params.id.toUpperCase());
})
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <TrackableLoad         v-if="storeTrackable.status == STATE_NO_INIT"/>
      <TrackableLoad    v-else-if="storeTrackable.status == STATE_LOADING"/>
      <TrackableDetails v-else-if="storeTrackable.status == STATE_READY" />
      <CenterLayout     v-else>
        Unhandled state '{{storeTrackable.status}}'
      </CenterLayout>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
