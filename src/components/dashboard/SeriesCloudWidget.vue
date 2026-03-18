<script setup>
import { computed, onMounted, ref } from 'vue'
import { seriesService } from "@/di/trackables.js"
import { useRouter, useRoute } from 'vue-router';
import CloudWidget from '@/components/dashboard/CloudWidget.vue'

const router = useRouter();

const ready = ref(false);
const results = ref([]);

onMounted(() => {
  seriesService.get_all_series().then((e)=>{
    results.value = e;
    ready.value = true;
  })
});

function onClick(e) {
  router.push("/series/"+e.series)
}
</script>

<template>
  <CloudWidget
    title="Serien"
    title-icon="pi-list"
    title-count
    :items="results"
    :ready="ready"
    label-text="series"
    label-count="count"
    label-image="icon_url"
    clickable
    default-image="https://www.geocaching.com/images/WptTypes/23.gif"
    @select="onClick"
  />
</template>
