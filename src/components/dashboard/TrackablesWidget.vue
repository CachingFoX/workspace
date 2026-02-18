<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import TrackableCard from '../TrackableCard.vue';
import Panel from '@/components/common/panel.vue'
import { useSafeModel, defineGetterSetter } from '@/components/dashboard/interface.js'
import { useTrackableListStore } from '@/di/trackables.js'

const storeTrackables = useTrackableListStore();

/* --- Dashboard widget interface --- */
const localConfiguration = ref({});
const modelConfiguration = defineModel('configuration');
const configuration = useSafeModel(modelConfiguration, localConfiguration);
const collapsed = defineGetterSetter(configuration, "collapsed", false)
/* --------------------------------- */

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
  <Panel title="Trackables" title-icon="pi-bookmark" :badge="storeTrackables.items.length"
  v-model:collapsed="collapsed">
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
