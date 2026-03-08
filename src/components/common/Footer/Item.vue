<script setup>
const props = defineProps({
  item: { type: [Object,String], default: null, required: true}
})
</script>

<template>
  <div v-if="props.item" v-tooltip.top="props.item.tooltip"
    class="item-container" :class="props.item.class" :style="props.item.style">
    <span class="pi mr-2" :class="props.item.icon"/>
    <span class="no-select">{{props.item.text}}</span>
  </div>
</template>

<style scoped>
.item-container {
  padding: 0.5rem;
  padding-bottom: 0.2rem;
  padding-top: 0.2rem;
}
.item-container:hover {
  filter: brightness(1.15);
}

.information {
  background-color: cornflowerblue;
  color: white;
}
</style>
