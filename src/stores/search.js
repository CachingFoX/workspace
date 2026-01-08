import { defineStore } from 'pinia'
import { ref as vueRef, watch } from 'vue'

function updateURLSearchParameter(key, value) {
  const params = new URLSearchParams(window.location.search);
  if (value === undefined) {
    params.delete(key);
  } else if (Array.isArray(value) && value.length == 0) {
      params.delete(key);
  } else if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(','));
  } else if (typeof value === 'string' && value.trim() !== '') {
      params.set(key, value.trim());
  } else if (typeof value === 'string' && value.trim() === '') {
      params.delete(key);
  } else if (typeof value === 'boolean') {
      params.set(key, value ? '1' : '0');
  } else {
    console.error("Invalid type/value for URL parameter:", typeof value, value);
    params.delete(key);
  }

  const newUrl =
    window.location.pathname +
    (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState({}, '', newUrl);
}

function fromURLSearchParams(key, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key) || defaultValue;
  if (typeof defaultValue === 'boolean' && typeof value === 'string' ) {
    return value === '1' || value === 'true';
  }
  if (typeof defaultValue === 'string') {
    return value;
  }
  if (Array.isArray(defaultValue) && typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  if (Array.isArray(defaultValue) && Array.isArray(value)) {
    return value;
  }
  console.error("Invalid type/value for URL parameter", key, ":", typeof value, typeof defaultValue);
  return value
}

// --- public consts
export const KEY_SORTING_ID = "id";
export const KEY_SORTING_NAME = "name";
export const KEY_SORTING_ORIGIN_NAME = "origin_name";
export const KEY_SORT_ORDER_ASC = false; // not reverse
export const KEY_SORT_ORDER_DESC = true; // reverse
export const KEY_CATEGORY_NONE = "";
export const KEY_CATEGORY_COLLECTION = "collections";
export const KEY_CATEGORY_TAG = "tags";
export const KEY_CATEGORY_OWNER = "owners";

export const VALUE_FIELD_NAME = "name";
export const VALUE_FIELD_ORIGIN_NAME = "origin"
export const VALUE_FIELD_TAGS = "tags";
export const VALUE_FIELD_COLLECTIONS = "collections";
export const VALUE_FIELD_NOTES = "notes";
export const VALUE_FIELD_TRACKING_NUMBER = "tracking";

// --- private consts

// parameter for filtering
const PARAMETER_TEXT = 'text';
const PARAMETER_COLLECTIONS = 'collections';
const PARAMETER_TAGS = 'tags';
const PARAMETER_ALL_COLLECTIONS = 'allCollections';
const PARAMETER_ALL_TAGS = 'allTags';
const PARAMETER_INCLUDE_COLLECTIONS = 'includeCollections';
const PARAMETER_INCLUDE_TAGS = 'includeTags';
const PARAMETER_OWNER = 'owner';
const PARAMETER_FIELDS = "fields";

// parameter for viewing
const PARAMETER_CATEGORY = "category";
const PARAMETER_SORTING = "sort";
const PARAMETER_SORT_REVERSE = "reverse";

export const useSearchFilterStore = defineStore('search-filter', () => {
  const inputFreeText = vueRef(fromURLSearchParams(PARAMETER_TEXT, ''));
  const selectedCollections = vueRef(fromURLSearchParams(PARAMETER_COLLECTIONS, []));
  const selectedTags = vueRef(fromURLSearchParams(PARAMETER_TAGS, []));
  const checkedAllCollections = vueRef(fromURLSearchParams(PARAMETER_ALL_COLLECTIONS, false));
  const checkedAllTags = vueRef(fromURLSearchParams(PARAMETER_ALL_TAGS, false));
  const checkedIncludeTags = vueRef(fromURLSearchParams(PARAMETER_INCLUDE_COLLECTIONS, true));
  const checkedIncludeCollections = vueRef(fromURLSearchParams(PARAMETER_INCLUDE_TAGS, true));
  const selectedOwner = vueRef(fromURLSearchParams(PARAMETER_OWNER, ''));

  const fields = vueRef(fromURLSearchParams(PARAMETER_FIELDS,[]));
  watch(fields, (newValue) => {
    updateURLSearchParameter(PARAMETER_FIELDS, newValue);
  })

  const viewOptCategorize = vueRef(fromURLSearchParams(PARAMETER_CATEGORY, KEY_CATEGORY_NONE));
  watch(viewOptCategorize, (newValue) => {
    updateURLSearchParameter(PARAMETER_CATEGORY, newValue);
  })

  const viewOptSorting = vueRef(fromURLSearchParams(PARAMETER_SORTING, KEY_SORTING_NAME));
  watch(viewOptSorting, (newValue) => {
    updateURLSearchParameter(PARAMETER_SORTING, newValue);
  });

  const viewOptSortingOrderReverse = vueRef(fromURLSearchParams(PARAMETER_SORT_REVERSE, KEY_SORT_ORDER_ASC));
  watch(viewOptSortingOrderReverse, (newValue) => {
    updateURLSearchParameter(PARAMETER_SORT_REVERSE, newValue);
  });

  watch(selectedOwner, (newValue) => {
    updateURLSearchParameter(PARAMETER_OWNER, newValue);
  });
  watch(selectedCollections, (newValue) => {
    updateURLSearchParameter(PARAMETER_COLLECTIONS, newValue);
  });
  watch(selectedTags, (newValue) => {
    updateURLSearchParameter(PARAMETER_TAGS, newValue);
  });
  watch(checkedAllCollections, (newValue) => {
    updateURLSearchParameter(PARAMETER_ALL_COLLECTIONS, newValue);
  });
  watch(checkedAllTags, (newValue) => {
    updateURLSearchParameter(PARAMETER_ALL_TAGS, newValue);
  });
  watch(checkedIncludeCollections, (newValue) => {
    updateURLSearchParameter(PARAMETER_INCLUDE_COLLECTIONS, newValue);
  });
  watch(checkedIncludeTags, (newValue) => {
    updateURLSearchParameter(PARAMETER_INCLUDE_TAGS, newValue);
  });
  watch(inputFreeText, (newValue) => {
    updateURLSearchParameter(PARAMETER_TEXT, newValue);
  });


  function addNewCollection(newElement) {
    if (selectedCollections.value.includes(newElement)) {
      return;
    }
    selectedCollections.value = [...selectedCollections.value, newElement];
  }
  function addNewTag(newElement) {
    if (selectedTags.value.includes(newElement)) {
      return;
    }
    selectedTags.value = [...selectedTags.value, newElement];
  }

  return {
    addNewCollection,
    addNewTag,
    checkedAllCollections,
    checkedAllTags,
    checkedIncludeCollections,
    checkedIncludeTags,
    fields,
    inputFreeText,
    selectedCollections,
    selectedOwner,
    selectedTags,
    viewOptCategorize,
    viewOptSorting,
    viewOptSortingOrderReverse
  }
})


