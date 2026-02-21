<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'

const storeTrackables = useTrackableListStore();
const route = useRoute()

const owner = ref(null)
const filter = ref({})

watchEffect(() => {
  owner.value = route.params.owner
  filter.value = {
    'label': owner?.value != "" ? owner?.value : "not activated",
    'icon': owner.value ? 'pi pi-user' : 'pi pi-times',
    'avatar': null // 'https://s3.amazonaws.com/gs-geo-images/cc65b23d-60f6-4e76-93e1-3dccddab9eb3_a.jpg' // null
  }
});

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(item => item.owner == owner.value );
})
</script>

<template>
  <TrackablesSubView :trackables="trackables" :filter="filter"/>
</template>
