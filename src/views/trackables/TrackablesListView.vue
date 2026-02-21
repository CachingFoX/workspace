<script setup>
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'

const storeTrackables = useTrackableListStore();
</script>

<template>
  <TrackablesSubView :trackables="storeTrackables.trackables"/>
</template>
