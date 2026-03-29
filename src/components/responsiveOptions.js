import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";

export const responsiveOptions = ref([
  {
    breakpoint: '1499px',
    numVisible: 4,
    numScroll: 3
  },
  {
    breakpoint: '1250px',
    numVisible: 3,
    numScroll: 2
  },
  {
    breakpoint: '970px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '700px',
    numVisible: 1,
    numScroll: 1
  }
]);
