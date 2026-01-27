import { defineStore } from 'pinia';
import { ref } from 'vue';

export const createTrackableListStore = (trackableService) => {
  return defineStore('trackable-list', () => {
    // --- State ---
    const items = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // --- Actions ---
    const fetchTrackables = async () => {
      loading.value = true;
      error.value = null;

      try {
        const data = await trackableService.getAllTrackables();
        items.value = data;
      } catch (err) {
        error.value = err;
        throw err; // optional, wenn Aufrufer Fehler abfangen will
      } finally {
        loading.value = false;
      }
    };

    // --- Expose ---
    return {
      items,
      loading,
      error,
      fetchTrackables,
    };
  });
};
