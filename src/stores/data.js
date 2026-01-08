import { defineStore } from 'pinia'
import { ref as vueRef, watch, reactive, computed, onMounted } from 'vue'
import { tbCodeToId } from '@/utils';
import { trackables as __trackablesRaw } from '../trackables.js'
import { useSearchFilterStore } from './search'
import * as filter from '@/stores/search';

function arrayMatch(a, b, c) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length === 0) return true;
  if (c) {
    // Return true only if all elements of a are in b
    return a.every(item => b.includes(item));
  } else {
    // Return true if at least one element of a is in b
    return a.some(item => b.includes(item));
  }
}


export const useDataStore = defineStore('data', () => {
  const storeFilterParameters = useSearchFilterStore();

  let collections = vueRef([]);
  let tags = vueRef([]);
  let trackables = vueRef([]);
  let owners = vueRef(['Alle']);

  const dict = {
    'Signal': ['Frosch', 'Maskottchen'],
    'Moon': "Mond",
  }

  function initData() {

    let _collections = [];
    let _tags = [];
    let _owner = [];

    // trackables = [..._trackables];
    let _trackables = __trackablesRaw;

    for (let i = 0; i < _trackables.length; i++) {
      const item = _trackables[i];

      item.__name = item.name.toLowerCase();
      if (item.originName == "") {
        item.originName = item.name;
      }
      item.__originname = item.originName.toLowerCase();
      item.__note = item.note.toLowerCase();
      item.privateCode = item.privateCode.toUpperCase();

      item.id = tbCodeToId(item.publicCode);
      /*
      if (item.publicCode === undefined) {
        item.publicCode = "";
        item.id = 0;
      } else {
        // calcualte id for from the public code
        item.id = tbCodeToId(item.publicCode);
        item.publicCode = "";
      }

      if (item.privateCode === undefined) {
        item.privateCode = "";
      }
      */

      // split comma separated list of collections and store it in the global list of collections
      _trackables[i].collections = item.collectionsString.split(',').map(col => col.trim()).filter(col => col.length > 0);
      _collections.push(..._trackables[i].collections);

      // split comma separated list of tags and store it in the global list of tags
      item.tags = item.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      item.tags.sort();

      let xtags = [];

      if (item.type) {
        xtags.push("Type: " + item.type);
      }
      if (item.material) {
        xtags.push("Material: " + item.material);
      }
      if (item.edition) {
        xtags.push("Edition: " + item.edition);
      }
      if (item.pin) {
        xtags.push("PIN: " + item.pin);
      }
      xtags.sort();

      item.tags.push(...xtags);
      _tags.push(..._trackables[i].tags);

      // convert attribute "owner" to any array - for easier use with other functions - and store it in a new attribute "owners"
      item.owners = item.owner != "" ? [item.owner] : [];

      // collect all owners
      if (item.owner && item.owner.trim().length > 0) {
        _owner.push(item.owner);
      }


      item.__tags = item.tags.join('🦄').toLowerCase();
    }

    _collections = [...new Set(_collections)];
    _collections.sort();

    _tags = [...new Set(_tags)];
    _tags.sort();

    _owner = [...new Set(_owner)];
    _owner.sort();

    collections.value = [..._collections];
    tags.value = [..._tags];
    owners.value = [..._owner];

    trackables.value = [..._trackables];

    console.log("Data:", _trackables.length, "trackables,", _collections.length, "collections,", _tags.length, "tags", _owner.length, "owners");
  }

  const selectedTrackables = computed(() => {
    const start = performance.now(); // Startzeit erfassen
    const text = storeFilterParameters.inputFreeText.toLowerCase();
    const TEXT = storeFilterParameters.inputFreeText.toUpperCase();

    const fieldName = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_NAME));
    const fieldOrigin = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_ORIGIN_NAME));
    const fieldNote = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_NOTES));
    const fieldTracking = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_TRACKING_NUMBER));
    const fieldTag = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_TAGS));
    const fieldCollection = (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_COLLECTIONS));

    let s = trackables.value.filter(item => {
      let match = false;
      // match with input from the text field
      match = match || (fieldName && item.name.toLowerCase().includes(text));
      match = match || (fieldOrigin && item.originName.toLowerCase().includes(text));
      match = match || (fieldNote && item.note.toLowerCase().includes(text));
      match = match || (fieldTracking && item.privateCode.toUpperCase().startsWith(TEXT));
      if (!match && fieldTag && storeFilterParameters.checkedIncludeTags) {
        for (let tag of item.tags) {
          if (tag.toLowerCase().includes(text)) {
            match = true;
            break;
          }
        }
      }
      if (!match && fieldCollection && storeFilterParameters.checkedIncludeCollections) {
        for (let collection of item.collections) {
          if (collection.toLowerCase().includes(text)) {
            match = true;
            break;
          }
        }
      }
      // match with the selects
      const matchesCollection = arrayMatch(storeFilterParameters.selectedCollections, item.collections, storeFilterParameters.checkedAllCollections);
      const matchesTag = arrayMatch(storeFilterParameters.selectedTags, item.tags, storeFilterParameters.checkedAllTags);
      return matchesCollection && matchesTag && match;
    });

    /*
    // sorting
    let fn = null;
    if (storeFilterParameters.viewOptSorting == filter.KEY_SORTING_ID) {
      fn = (a, b) => a.id > b.id;
      s.sort(fn);
    } else if (storeFilterParameters.viewOptSorting == filter.KEY_SORTING_NAME) {
      fn = (a, b) => a.name.localeCompare(b.name);
      s.sort(fn);
    } else if (storeFilterParameters.viewOptSorting == filter.KEY_SORTING_ORIGIN_NAME) {
      fn = (a, b) => {
        let _a = a.originName != "" ? a.originName : a.name;
        let _b = b.originName != "" ? b.originName : b.name;
        return _a.localeCompare(_b);
      };
      s.sort(fn);
    } else {
      console.warn("Unknown search option:", storeFilterParameters.viewOptSorting);
      fn = (a, b) => a.name.localeCompare(b.name);
      s.sort(fn);
    }

    if (storeFilterParameters.viewOptSortingOrderReverse) {
      s.reverse(fn);
    }
    */

    const end = performance.now(); // Endzeit erfassen
    const dauer = end - start; // Dauer berechnen
    console.log("computed filtered list of", s.length, "trackables in", dauer, "ms");
    return s;
  });



  return {
    collections,
    initData,
    owners,
    tags,
    trackables,
    selectedTrackables,
  };
});
