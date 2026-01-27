import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const STATE_NO_INIT = "NO_INIT";
export const STATE_LOADING = "LOADING";
export const STATE_UNKNOWN = "UNKNOWN";
export const STATE_READY = "READY";
export const STATE_FAIL = "FAIL";

export const createTrackableStore = (trackableService) => {
  return defineStore('trackable', () => {
    // --- State ---
    const _state = ref(STATE_NO_INIT);
    const _progress = ref(false)
    const _data = ref({});
    const _load_code = ref('');

    // --- Actions ---
    const loadTrackable = async (tracking_number) => {
      _state.value = STATE_NO_INIT;
      _data.value = {};
      _load_code.value = tracking_number;

      try {
        _progress.value = true;
        _state.value = STATE_LOADING;
        _data.value = await trackableService.getTrackableByNumber(tracking_number);
        _state.value = STATE_READY;
        _progress.value = false;
      } catch (error) {
        _state.value = STATE_FAIL;
        _progress.value = false;
      }
    };

    const updateTrackableFields = async (fields) => {
      Object.assign(_data.value, fields); // TODO in the future _data.value.properties ????
      try {
        _progress.value = true;
        await trackableService.updateTrackable(_data.value.id, fields);
        _progress.value = false;
      } catch (error) {
        _progress.value = false;
      }
    }

    const deleteTrackable = async () => {
      try {
        _progress.value = true;
        await trackableService.updateTrackable(_data.value.id, fields);
        _data.value = {}
        _state.value = STATE_NO_INIT
        _progress.value = false;
      } catch (error) {
        _progress.value = true;
      }
    }

    // --- Getter ---
    const data = computed(() => _data.value);
    const load_code = computed(() => _load_code.value);
    const state = computed(() => _state.value);
    const progress = computed(() => _progress.value);

    // --- Expose ---
    return {
      data,
      load_code,
      state,
      progress,
      loadTrackable,
      updateTrackableFields,
      deleteTrackable,
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
  const _state = ref(STATE_NO_INIT);

  function fetch(tracking_code) {
    _state.value = STATE_LOADING;
    trackable_data.value = {};

    try {
      TrackableService.getTrackableByTrackingNumber(tracking_code).then((result) => {
        if (result.okay) {
          trackable_data.value = result.trackable;
          // TODO tagStore.loadAllTags();
          // TODO loadTrackableTags(private_code);
          _state.value = STATE_READY;
        } else {
          _state.value = STATE_UNKNOWN;
        }
      });
    } catch (err) {
      console.error(err);
      _state.value = STATE_FAIL;
    } finally {
    }
  }


  function init() {
  }

  const trackable_reference_code = computed(() => '??????');
  const state = computed(() => _state.value);

  return {
    fetch,
    init,
    state,
    trackable_data,
    trackable_reference_code,
  }
});

*/
