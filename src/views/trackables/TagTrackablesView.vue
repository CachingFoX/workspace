<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'

const storeTrackables = useTrackableListStore();
const route = useRoute()

const tag_id = ref(null)
const tag_name = ref(null)
const filter = ref({})

watchEffect(() => {
  tag_id.value = route.params.tag;
  filter.value = {
    'label': tag_name.value,
    'icon': 'pi pi-tag',
    'avatar': null
  }
});

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(item => {
    const tag = item.tags.find( t => t.id == tag_id.value )
    tag_name.value = tag ? tag.name : tag_name.value
    return tag ? true : false;
  });
})
</script>

<template>
  <TrackablesSubView :trackables="trackables" :filter="filter"/>
</template>
