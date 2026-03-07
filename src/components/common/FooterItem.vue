<script setup>
import FooterItem from '@/components/common/FooterItem.vue'

const props = defineProps({
  item: { type: [Object,String], default: null, required: true}
})
</script>

<template>
  <div v-if="props.item" v-tooltip.top="props.item.tooltip"
    class="item-container" :class="props.item.class" :style="props.item.style">
    <span class="pi mr-1" :class="props.item.icon"/>
    <span class="no-select">{{props.item.text}}</span>
  </div>
</template>

<style scoped>
.item-container {
  padding: 0.75rem;
  padding-bottom: 0.2rem;
  padding-top: 0.2rem;
}

.blue {
  background-color: cornflowerblue;
  color: white;
}
.blue:hover {
  background-color: cornflowerblue;
  opacity: 0.850;
  color: white;
}
</style>
