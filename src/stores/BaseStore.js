import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'


// https://stackoverflow.com/questions/74072848/multiple-instance-of-pinia-store-possible-in-same-page-or-same-component

export const createBaseStore = (baseService) => {
  return defineStore('base', () => {

    // --- State ---
    const _baseInfo = ref({})

    // --- Actions ---
    const init = async () => {
      _baseInfo.value = {};
      try {
        _baseInfo.value = await baseService.getBaseInformation();
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    // --- Getter ---
    const baseInfo = computed(() => _baseInfo.value);

    // --- Expose ---
    return {
      baseInfo,

      // methods
      init,
    };
  });
};
