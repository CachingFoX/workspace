<script setup>
import { computed, onMounted, ref } from 'vue'
import { tagService } from '@/di/trackables.js'
import { useRouter, useRoute } from 'vue-router';
import CloudWidget from '@/components/dashboard/CloudWidget.vue'

const router = useRouter();

const ready = ref(false);
const results = ref([]);

onMounted(() => {
  tagService.read().then((e)=>{
    results.value = e;
    ready.value = true;
  })
});

function onClick(e) {
  router.push(`/tag/${e.id}?label=${e.name}`)
}
</script>

<template>
  <CloudWidget
    title="Schlagwörter"
    title-icon="pi-tags"
    title-count
    :items="results"
    :ready="ready"
    label-text="name"
    label-count="use"
    default-icon="pi-tag"
    default-text="<unnamed>"
    clickable
    @select="onClick"
  />
</template>
