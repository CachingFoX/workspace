
<script setup>
import { ref, computed, watch, watchEffect, onBeforeMount} from "vue";
import { useTrackableListStore } from "@/di/trackables.js"
import Carousel from 'primevue/carousel';
import PersistentPanel from '@/components/trackable/panel.vue'
import TrackableCard from '@/components/TrackableCard.vue';

const storeTrackables = useTrackableListStore();
const props = defineProps({
  'series': { type: String, required: true, default: ""},
  'self': { type: String, required: true, default: ""}
})

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(t =>
    t.series == props.series && ( t.private_code != props.self && t.public_code != props.self )
  )
})
</script>


<template>
  <PersistentPanel storage-key="trackable.details.trackablesseries" title="Trackables aus der gleichen Serie"
    :badge="trackables.length"
  >
     <Carousel :value="trackables" :numVisible="3" :numScroll="3" class="w-full">
      <template #item="slotProps">
        <TrackableCard :trackable="slotProps.data"
          trackable-owner="south-west"
          trackable-icon="north-west"
          trackable-number="north-east"
        />
      </template>
    </Carousel>
  </PersistentPanel>
</template>

<style scoped>
</style>
