import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const createTrackableListStore = (trackableService) => {
  return defineStore('all_trackable', () => {
    // --- State ---
    const items = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // --- Actions ---
    const refresh = async () => {
      loading.value = true;
      error.value = null;
      items.value = [];

      try {
        const data = await trackableService.getAllTrackables();
        items.value = data;
      } catch (err) {
        error.value = err;
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const trackables = computed(() => {
      if (items.value == null) {
        refresh().then(() => {
          return items.value
        })
      }
      return items.value
    });

    // --- Expose ---
    return {
      loading,
      error,
      trackables,

      // actions
      refresh,
    };
  });
};
