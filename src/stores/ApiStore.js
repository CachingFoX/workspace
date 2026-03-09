import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const createApiStoreWithService = (apiService) => {
  return defineStore('api', () => {
    let timeout = null
    let count = 0;

    // --- State ---
    const _available = ref(false)
    const _result = ref(null)

    // --- Actions ---
    function startConnectToApi() {
      if (_available.value) {
        stopConnectToApi()
      } else {
        timeout = setTimeout(() => {
          try {
            apiService.getBaseInformation().then((result) => {
              _result.value = result;
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

    const api_version = computed(() => { return _result.value ? _result.value.api.version : "n/a" })
    const api_name = computed(() => { return _result.value ? _result.value.api.name : "n/a" })
    const database_integrity = computed(() => { return _result.value ? _result.value.database.integrity : "n/a" })
    const database_url = computed(() => { return _result.value ? _result.value.database.url : "n/a" })
    const upload_path = computed(() => { return _result.value ? _result.value.api.upload_path : "n/a" })

    // --- Expose ---
    return {
      api_name,
      api_version,
      available,
      database_integrity,
      database_url,
      upload_path,

      startConnectToApi,
      stopConnectToApi
    };
  });
};
