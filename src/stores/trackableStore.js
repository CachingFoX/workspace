import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const STATE_NO_INIT = "no_init";
export const STATE_LOADING = "loading";
export const STATE_UNKNOWN = "unknown";
export const STATE_READY = "ready";
export const STATE_FAIL = "fail";

export const createTrackableStore = (trackableService) => {
  return defineStore('trackable', () => {
    // --- State ---
    const _status = ref(STATE_NO_INIT);
    const _data = ref({});
    const _load_code = ref('');

    // --- Actions ---
    const loadTrackable = async (tracking_number) => {
      _status.value = STATE_NO_INIT;
      _data.value = {};
      _load_code.value = tracking_number;

      try {
        _status.value = STATE_LOADING;
        const result = await trackableService.getTrackableByNumber(tracking_number);
        _data.value = result;
        _status.value = STATE_READY;
      } catch (error) {
        _status.value = STATE_FAIL;
        // TODO toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
        console.log(error);
      }
    };

    // --- Getter ---
    const data = computed(() => _data.value);
    const load_code = computed(() => _load_code.value);
    const status = computed(() => _status.value);


    // --- Expose ---
    return {
      data,
      load_code,
      status,
      loadTrackable
    };
  });
};


/*

const createNewTag = (tag_name) => {
  TagService.newTagForTrackableId(private_code, tag_name).then((result) => {
    // TODO update trackable tags
    tagStore.loadAllTags();
  });
};

const removeTag = (tag_id) => {
  console.log("removeTag", private_code, tag_id)
  TagService.removeTagForTrackableId(private_code, tag_id).then((result)=>{
    // update list of tags
    loadTrackableTags(private_code);
  });
}

const addTag = (tag_id) => {
  console.log("addTag", private_code, tag_id)
  TagService.setTagForTrackableId(private_code, tag_id).then((result) => {
    // update list of tags
    loadTrackableTags(private_code);
  });
}

const loadTrackableTags = (trackable_id) => {
  TagService.getTagsByTrackableId(trackable_id).then((result) => {
    trackable_tags.value = result;
  });
}

const sendUpdate = async () => {
  let r = diffDeep(data.value, copyData);
  console.log(copyData);
  console.log(r)

  try {
    const response = await fetch(`http://localhost:8000/trackables/${private_code}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"  // Wir senden JSON
      },
      body: JSON.stringify(r)  // JS-Objekt in JSON umwandeln
    });
    const result = await response.json();

    data.value = result;
    copyData = { ...result };
  } catch (err) {
    console.error(err);
    error.value = err
  } finally {
    isLoading.value = false
  }
};
*/

/*

export const useTrackableViewStore = defineStore('trackable-viewx', () => {
  const _route = useRoute()

  const trackable_data = ref({});
  const _status = ref(STATE_NO_INIT);

  function fetch(tracking_code) {
    _status.value = STATE_LOADING;
    trackable_data.value = {};

    try {
      TrackableService.getTrackableByTrackingNumber(tracking_code).then((result) => {
        if (result.okay) {
          trackable_data.value = result.trackable;
          // TODO tagStore.loadAllTags();
          // TODO loadTrackableTags(private_code);
          _status.value = STATE_READY;
        } else {
          _status.value = STATE_UNKNOWN;
        }
      });
    } catch (err) {
      console.error(err);
      _status.value = STATE_FAIL;
    } finally {
    }
  }


  function init() {
  }

  const trackable_reference_code = computed(() => '??????');
  const status = computed(() => _status.value);

  return {
    fetch,
    init,
    status,
    trackable_data,
    trackable_reference_code,
  }
});

*/
