<script setup>
import { watch, onMounted, computed, onBeforeMount, ref, reactive } from 'vue'
// Components
import TrackableDetails from '../components/TrackableDetails.vue';
import TrackableLoad from '../components/TrackableLoad.vue';
import TrackableUnknown from '@/components/trackable/unknown.vue';
import TrackableUnknownHQ from '@/components/trackable/unknown_hq.vue';

import BaseLayout from '@/components/layout/BaseLayout.vue';
import CenterLayout from '@/components/layout/CenterLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import { STATE_UNKNOWN_DB, STATE_UNKNOWN_HQ,
  STATE_LOADING_DB, STATE_LOADING_HQ,
  STATE_NO_INIT, STATE_READY } from '../stores/trackableStore.js'
import { useRoute, useRouter } from 'vue-router';
import { useTrackableStore } from "../di/trackables.js"
import { useTagsStore } from "@/di/trackables.js"

const storeTrackable = useTrackableStore();
const storeTags = useTagsStore();
const router = useRouter();
const route = useRoute();

watch(
  () => route.params.id,
  (newState, oldState) => {
    storeTrackable.readTrackable(route.params.id.toUpperCase());
  }
)

const trackingNumber = computed(()=>{
  return route.params.id.toUpperCase()
})

const autoload = computed(()=>{
  return route.query.masterdata == "autoload" ? true : false
})

onBeforeMount(()=>{
  storeTrackable.$reset()
})

onMounted(async () => {
  await storeTags.load();
  // TODO place it better
  storeTrackable.readTrackable(trackingNumber.value);
})


const litems = reactive([
  {
    icon: computed(()=>{return storeTrackable.progress ? 'pi-spin pi-cog' : 'pi-cog'}),
    text: computed(()=>{return storeTrackable.progress ? "In Arbeit" : "Bereit" }),
    show: true,
  }
])
const ritems = reactive([]);
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <TrackableLoad           v-if="storeTrackable.state == STATE_NO_INIT" text="Lade Trackable"/>
      <TrackableLoad      v-else-if="storeTrackable.state == STATE_LOADING_DB" :text="`Lade ${trackingNumber}`"/>
      <TrackableLoad      v-else-if="storeTrackable.state == STATE_LOADING_HQ" :text="`Lade ${trackingNumber} von www.geocaching.com`"/>
      <TrackableUnknown   v-else-if="storeTrackable.state == STATE_UNKNOWN_DB" :tracking-number="trackingNumber" :auto-load="autoload"/>
      <TrackableUnknownHQ v-else-if="storeTrackable.state == STATE_UNKNOWN_HQ" :tracking-number="trackingNumber"/>
      <TrackableDetails   v-else-if="storeTrackable.state == STATE_READY" />
      <CenterLayout     v-else>
        Unhandled state '{{storeTrackable.state}}'
      </CenterLayout>
    </template>
    <template v-slot:footer>
      <Footer :left="litems" :right="ritems"/>
    </template>

  </BaseLayout>
</template>

<style scoped>
</style>
