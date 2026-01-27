<script setup>
import { ref } from 'vue';
import { useClickOutside } from '../utils/useClickOutside.js';

const edit = ref(false);


const box = ref(null);

useClickOutside(box, () => {
  edit.value = false;
});
</script>

<template>
  <div class="x-container" ref="box"
    :class="{ edit: edit}"
    @click="edit = !edit;">
    <slot :edit="edit"></slot>
    <div v-if="$slots.edit" v-show="edit">
      <slot name="edit"></slot>
    </div>
    <span class="pi pi-pencil icon"/>
  </div>
</template>

<style scoped>
.x-container {
  padding: 1px;
  border: 2px dashed #fff;
  box-sizing: border-box;
  position: relative; /* Bezugspunkt */
}
.x-container:hover, .edit {
  border: 2px dashed #ccc;
}
.icon {
  position: absolute;
  top: 6px;
  right: 6px;
  color: #888;
}
.x-container .icon {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
}
.x-container:hover .icon, .edit .icon {
  opacity: 1;
  visibility: visible;
}

</style>

