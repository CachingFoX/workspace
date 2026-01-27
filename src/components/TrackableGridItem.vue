<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  attribute: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: null
  },
})
</script>

<template>
  <div class="grid-item left" :class="{ 'multi-line': props.type == 'textarea' }" >{{ props.label }}</div>
  <div class="grid-item right">
    <slot v-if="props.type == null"/>
    <slot v-else :name="props.type"/>
  </div>
</template>

<style scoped>
.grid-item.left {
  font-weight: bold;
  align-self: center;
}
.grid-item.multi-line {
  align-self: start;
}
.grid-item.right {
}
</style>
