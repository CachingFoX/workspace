import { defineStore } from 'pinia'
import { ref as vueRef, watch } from 'vue'
import { fromURLSearchParams, toURLSearchParameter } from '@/stores/utils.js';

const PARAMETER_REVERSE = "reverse";

export const useSortParameterStore = defineStore('sort-parameter', () => {
  const reverse = vueRef(fromURLSearchParams(PARAMETER_REVERSE, false));

  watch(reverse, (newValue) => {
    toURLSearchParameter(PARAMETER_REVERSE, newValue);
  });

  return {
    reverse
  }
});
