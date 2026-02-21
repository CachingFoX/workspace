<script setup>
import FooterItem from '@/components/common/FooterItem.vue'

const props = defineProps({
  item: { type: [Object,String], default: null, required: true}
})
</script>

<template>
  <div v-if="props.item" v-tooltip.top="props.item.tooltip">
    <span class="pi mr-1" :class="props.item.icon"/>
    <span class="no-select" :class="props.item.class">{{props.item.text}}</span>
  </div>
</template>
