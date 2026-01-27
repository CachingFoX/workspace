<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'

const props = defineProps({
  top: {
    type: Number,
    default: 0,
    required: true
  },
  bottom: {
    type: Number,
    default: 0,
    required: true
  },
  centered: {
    type: Boolean,
    default: false,
  },
})

let _top = 0;
let _bottom = 0;

onBeforeMount(() => {
  function ggt(x, y) {
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return Math.abs(x);
  }

  _top = parseInt(props.top);
  _bottom = parseInt(props.bottom);

  _top = _top ? _top : 1;
  _bottom = _bottom ? _bottom : 1;

  const divisor = ggt(_top,_bottom);
  _top = _top / divisor
  _bottom = _bottom / divisor
})

</script>

<template>
  <div class="flex flex-column align-items-stretch h-full">
    <div v-for="n in parseInt(props.top)" class="flex-grow-1 flex-shrink-1"/>
    <div class="flex-grow-1 flex-shrink-0" :class="{ 'text-center': props.centered }">
      <slot/>
    </div>
    <div v-for="index in parseInt(props.bottom)" class="flex-grow-1 flex-shrink-1"/>
  </div>
</template>

<style scoped>
</style>
