<script setup>
import { computed, onMounted, ref } from 'vue'
import { seriesService } from "@/di/trackables.js"
import { useRouter, useRoute } from 'vue-router';
import CloudWidget from '@/components/dashboard/CloudWidget.vue'

const router = useRouter();

const props = defineProps({
  storageKey: { type: String, required: false, default: 'seriescloudwidget' },
});

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
    :storage-key="`${props.storageKey}`"
    badge
    :items="results"
    :ready="ready"
    text-label="series"
    badge-label="count"
    image-label="icon_url"
    clickable
    empty-image="https://www.geocaching.com/images/WptTypes/23.gif"
    @select="onClick"
  />
</template>
