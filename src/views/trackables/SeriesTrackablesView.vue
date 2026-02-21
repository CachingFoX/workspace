<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'

const storeTrackables = useTrackableListStore();
const route = useRoute()

const series = ref(null)
const filter = ref({})

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(t => t.series == series.value );
})

watchEffect(() => {
  series.value = route.params.series;
  filter.value = {
    'label': series.value,
    'icon': 'pi pi-question',
    'avatar': trackables?.value[0]?.icon_url
  }
});


</script>

<template>
  <TrackablesSubView :trackables="trackables" :filter="filter"/>
</template>
