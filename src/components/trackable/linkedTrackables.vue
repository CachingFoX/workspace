
<script setup>
import { ref, computed, watch, watchEffect, onBeforeMount} from "vue";
import { useTrackableStore } from "@/di/trackables.js"
import Carousel from 'primevue/carousel';
import Panel from 'primevue/panel'
import TrackableCard from '@/components/TrackableCard.vue';
import { useLocalStorageRef } from '@/utils/localStorageRef';

const storeTrackable = useTrackableStore();
const linkedTrackables = ref(null)
const property_name = 'linkedTrackables'
const collapsed = useLocalStorageRef('details.layout.linked-trackables.collapsed', false)

watchEffect(async () => {
  linkedTrackables.value = storeTrackable.getPropertyByName(property_name);
})

const trackables = computed(()=>{
  if (!linkedTrackables.value || !linkedTrackables.value.property_value) {
    return []
  }
  let tokens = linkedTrackables.value.property_value.split(' ');
  if (tokens.length == 0) {
    return []
  }

  return tokens;
})
</script>


<template>
  <Panel class="mx-2 mt-2" v-model:collapsed="collapsed" header="Verlinkte Trackables" toggleable>
    <Carousel :value="trackables" :numVisible="3" :numScroll="3" class="w-full">
      <template #item="slotProps">
        <TrackableCard :trackable="slotProps.data"
          trackable-owner="south-west"
          trackable-icon="north-west"
          trackable-number="north-east"
        />
      </template>
    </Carousel>
  </Panel>
</template>

<style scoped>
</style>
