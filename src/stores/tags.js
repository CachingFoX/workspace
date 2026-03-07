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

    const newTag = async (tagName) => {
      try {
        _progress.value = true;
        _state.value = STATE_LOADING;
        const tag = await tagService.create(tagName);
        _tags.value = await tagService.read_with_use();
        _state.value = STATE_READY;
        return tag
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
      if (!_tags.value?.length) {
        load();
      }

      let field = _sortBy.value;
      let direction = _sortDirection.value;
      let r = sortByAttribute(_tags.value, field, direction ? 'desc' : 'asc');
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
      newTag,
    };
  });
};

export const useTagStore = defineStore('tag-store', () => {
  const all_tags = ref([]); // stores all tags from the database
  const trackable_tags = ref([]); // stores all tags of a trackable

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
