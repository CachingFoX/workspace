import { defineStore } from 'pinia'
import { ref as vueRef, watch } from 'vue'
import { fromURLSearchParams, toURLSearchParameter } from '@/stores/utils.js';

const PARAMETER_TEXT = "text";

export const useFilterParameterStore = defineStore('filter-parameter', () => {
  const text = vueRef(fromURLSearchParams(PARAMETER_TEXT, ''));

  watch(text, (newValue) => {
    toURLSearchParameter(PARAMETER_TEXT, newValue);
  });

  return {
    text,
  }
});
