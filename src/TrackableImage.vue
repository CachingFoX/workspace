<script setup>
import { ref, computed } from 'vue'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import Image from 'primevue/image';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  altImage: {
    type: String,
    required: false,
    default: '../no-picture.bmp'
  }
});

const src = ref(props.src);

function imgError() {
  //src.value = props.altImage;
}

const image = computed(() => {
  if (props.src === null || props.src === undefined || props.src.trim() == "" ) {
    return "../images/"+props.altImage;
  }
  return "../images/"+props.src;
});

const preview = computed(() => {
  if (props.src === null || props.src === undefined || props.src.trim() == "" ) {
    return false;
  }
  return true;
});

</script>

<template>
  <Image alt="Image" :preview="preview">
    <template #previewicon>
        <i class="pi pi-search"></i>
    </template>
    <template #image>
        <img :src="image" alt="image" style="width: 128px; height: 128px; object-fit:cover;"  />
    </template>
    <template #preview="slotProps">
        <img :src="image" alt="preview" :style="slotProps.style" @click="slotProps.onClick" />
    </template>

  </Image>
</template>

