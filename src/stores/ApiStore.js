import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const createApiStoreWithService = (apiService) => {
  return defineStore('api', () => {
    let timeout = null
    let count = 0;

    // --- State ---
    const _available = ref(false)

    // --- Actions ---
    function startConnectToApi() {
      if (_available.value) {
        stopConnectToApi()
      } else {
        timeout = setTimeout(() => {
          try {
            apiService.getBaseInformation().then((result) => {
              console.log("API answers with", result)
              _available.value = result ? true : false;
            });
          } catch (error) {
            console.error(error);
          } finally {
          }
          startConnectToApi();
        }, count < 20 ? 200 : 2000);
      }
      count++;
    }

    function stopConnectToApi() {
      clearTimeout(timeout);
    }

    // --- Getter ---
    const available = computed(() => {
      if (!_available.value) {
        startConnectToApi();
      }
      return _available.value
    });

    // --- Expose ---
    return {
      available,

      startConnectToApi,
      stopConnectToApi
    };
  });
};
