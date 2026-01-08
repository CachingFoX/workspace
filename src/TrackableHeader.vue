

<script setup>
/*
import { defineProps } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
  */

function handleTagClick(tag) {
  // Hier kannst du z.B. ein Event emitten oder eine Navigation auslösen
  console.log('Tag clicked:', tag)
}

function handleCollectionClick(collection) {
  // Hier kannst du z.B. ein Event emitten oder eine Navigation auslösen
  console.log('Collection clicked:', collection)
}

</script>

<template>
  <div class="trackable-header">
    <div style="flex: 0 0 32px; display: flex; align-items: center; margin-right: 10px; margin-left: 10px;"></div>
    <div style="flex: 1 1 auto; display: flex; align-items: center;">Name</div>
    <div style="flex: 0 0 64px; display: flex; align-items: center;"></div>
    <div style="flex: 0 0 100px; display: flex; align-items: center;"></div>
    <div style="flex: 0 0 100px; display: flex; align-items: center;">Link</div>
  </div>


</template>

<style scoped>
.trackable-header {
  background: #fff;/* #f0f0f0;*/
  display: flex;
  font-weight: bold;
  margin-right: 0px;
  margin-left: 0px;
  padding: 8px 0px;
  width: 100%;
}
.trackable-line {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
.trackable-line:hover {
  background: #f5f5f5;
}
</style>
