<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { seriesService } from "@/di/trackables.js"
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables.js'
import CloudWidget from '@/components/dashboard/CloudWidget.vue'

const router = useRouter();
const storeTrackables = useTrackableListStore();

const ready = ref(false);
const results = ref([]);
const perfix_dict = {
  'CB': 'Cache Buddy',
  'CP': 'Geoswag Coin&Pin Club',
  'EC': 'Earthcache',
  'GS': 'Geoswag',
  'HQ': 'Headquarter',
  'MS': 'Milestone',
  'OC': 'Oakcoin',
  'PC': 'Personal Coin',
  'SB': 'Sepp & Berta',
}

function update() {
  ready.value = false;
  let prefixes = {}
  storeTrackables.trackables.forEach(element => {
    let prefix = element.private_code[0]+element.private_code[1];
    if (prefixes[prefix] === undefined) {
      prefixes[prefix] = { "prefix": prefix, 'title': perfix_dict[prefix] ?? prefix, 'count': 0 }
    }
    prefixes[prefix].count += 1;
  });

  results.value = Object.values(prefixes)
  ready.value = true;
}

watch(() => storeTrackables.trackables, (newValue, oldValue) => {
  update();
})

onMounted(() => {
  update();
});

function onClick(e) {
  router.push("/series/"+e.series)
}
</script>

<template>
  <CloudWidget
    title="Tracking Number Prefixes"
    title-icon="pi-list"
    title-count
    :items="results"
    :ready="ready"
    label-text="title"
    label-avatar="prefix"
    label-count="count"
    clickable
    @select="onClick"
  />
</template>
