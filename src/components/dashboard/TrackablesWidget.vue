<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import BaseWidget from './BaseWidget.vue';
import Carousel from 'primevue/carousel';
import TrackableCard from '../TrackableCard.vue';

import { useTrackableListStore } from '@/di/trackables.js'

const storeTrackables = useTrackableListStore();

onMounted(() => {
  storeTrackables.fetchTrackables();
});


const tags = computed(() => {
  return storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
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
  <BaseWidget title="Trackables" icon="pi-tags">
    <Carousel :value="storeTrackables.items" :numVisible="2" :numScroll="2" :responsiveOptions="responsiveOptions">
      <template #item="slotProps">
        <TrackableCard :trackable="slotProps.data"/>
      </template>
    </Carousel>
  </BaseWidget>
</template>
