import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'


// https://stackoverflow.com/questions/74072848/multiple-instance-of-pinia-store-possible-in-same-page-or-same-component
export const STATE_NO_INIT = "NO_INIT";
export const STATE_LOADING = "LOADING";
export const STATE_UNKNOWN = "UNKNOWN";
export const STATE_READY = "READY";
export const STATE_FAIL = "FAIL";

export const createTagsStore = (tagService) => {
  return defineStore('tags', () => {

    // --- State ---
    const _progress = ref(false)
    const _state = ref(STATE_NO_INIT);
    const _tags = ref([]);
    const _sortBy = ref("name");
    const _sortDirection = ref(false); // false=asc, true=desc

    // --- Actions ---
    const loadxxx = async () => {
      _state.value = STATE_NO_INIT;
      _progress.value = true;
      _tags.value = [];
      try {
        _state.value = STATE_LOADING;
        _tags.value = await tagService.read();
        _state.value = STATE_READY;
      } catch (error) {
        _state.value = STATE_FAIL;
      } finally {
        _progress.value = false;
      }
    };

    const load = async () => {
      _state.value = STATE_NO_INIT;
      _progress.value = true;
      _tags.value = [];
      try {
        _state.value = STATE_LOADING;
        _tags.value = await tagService.read_with_use();
        _state.value = STATE_READY;
      } catch (error) {
        _state.value = STATE_FAIL;
      } finally {
        _progress.value = false;
      }
    };

    const deleteTag = async (tagId) => {
      try {
        _progress.value = true;
        _state.value = STATE_LOADING;
        await tagService._delete(tagId);
        _tags.value = await tagService.read_with_use();
        _state.value = STATE_READY;
      } catch (error) {
        console.error(error);
        _state.value = STATE_FAIL
      }
      finally {
        _progress.value = false;
      }
    };

    function setSorting(field, direction) {
      _sortBy.value = field;
      _sortDirection.value = direction;
    }

    function sortByAttribute(list, attribute, order = 'asc') {
      return [...list].sort((a, b) => {
        const valA = a[attribute] ?? '';
        const valB = b[attribute] ?? '';

        return order === 'asc'
          ? String(valA).localeCompare(String(valB), 'de', { sensitivity: 'base' })
          : String(valB).localeCompare(String(valA), 'de', { sensitivity: 'base' });
      });
    }

    // --- Getter ---
    const progress = computed(() => _progress.value);
    const state = computed(() => _state.value);
    const tags = computed(() => {
      console.log("Sorting tags by", _sortBy.value, _sortDirection.value ? "DESC" : "ASC");
      let field = _sortBy.value;
      let direction = _sortDirection.value;
      let r = sortByAttribute(_tags.value, field, direction ? 'desc' : 'asc');

      console.log(_tags.value[0]?.name);
      return r;
    });

    const tags_sorted_by_use_asc = computed(() => {
      let r = sortByAttribute(_tags.value, "use", 'asc');
      return r;
    });
    const tags_sorted_by_use_desc = computed(() => {
      let r = sortByAttribute(_tags.value, "use", 'desc');
      return r;
    });
    // --- Expose ---
    return {
      progress,
      state,
      tags,
      tags_sorted_by_use_asc,
      tags_sorted_by_use_desc,

      _sortBy,
      _sortDirection,

      // methods
      setSorting,
      load,
      deleteTag,

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




export const useTagStore = defineStore('tag-store', () => {
  const all_tags = ref([]); // stores all tags from the database
  const trackable_tags = ref([]); // stores all tags of a trackable

  /*
  watch(reverse, (newValue) => {
    toURLSearchParameter(PARAMETER_REVERSE, newValue);
  });
  */

  function loadAllTags() {
    try {
      TagService.getAllTags().then((result) => {
        all_tags.value = result;
        console.debug("TagsStore.loadAllTags()", result.length, "tags");
      });
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  const loadTrackableTags = (trackable_id) => {
    TagService.getTagsByTrackableId(trackable_id).then((result) => {
      trackable_tags.value = result;
      console.debg(result);
    });
  }

  // -------------------

  function $reset() {
    all_tags.value = [];
    trackable_tags.value = [];
  }

  return {
    all_tags,
    trackable_tags,
    loadAllTags,
    loadTrackableTags,
  }
});
