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
  router.push("/tag/"+e.id)
}
</script>

<template>
  <CloudWidget
    title="Schlagwörter"
    title-icon="pi-tags"
    badge
    :items="results"
    :ready="ready"
    text-label="name"
    badge-label="use"
    icon="pi-tag"
    clickable
    empty-text="<unnamed>"
    empty-icon="pi-times"
    @select="onClick"
  />
</template>
