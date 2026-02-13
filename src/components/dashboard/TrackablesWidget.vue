<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import TrackableCard from '../TrackableCard.vue';
import Panel from '@/components/common/panel.vue'

import { useTrackableListStore } from '@/di/trackables.js'

const storeTrackables = useTrackableListStore();

const props = defineProps({
  storageKey: { type: String, required: false, default: 'logininfowidget' },
});


onMounted(() => {
  storeTrackables.fetchTrackables();
});

const xresponsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>



<template>
  <Panel title="Trackables" title-icon="pi-bookmark" :storage-key="`${props.storageKey}`" :badge="storeTrackables.items.length">
    <Carousel :value="storeTrackables.items" :numVisible="2" :numScroll="2" :responsiveOptions="responsiveOptions">
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
