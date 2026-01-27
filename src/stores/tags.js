import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { TagService } from "../services/TagService.js";

// https://stackoverflow.com/questions/74072848/multiple-instance-of-pinia-store-possible-in-same-page-or-same-component

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
