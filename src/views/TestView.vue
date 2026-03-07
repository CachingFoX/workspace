<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"

import { seriesService } from "@/di/trackables.js"
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const storeTrackables = useTrackableListStore();
const storeTags = useTagsStore();
const series = ref(null)

const emits = defineEmits(['change'])

onMounted(() => {

});

const visible = ref(false)
</script>

<template>

</template>

<style scoped>

</style>
