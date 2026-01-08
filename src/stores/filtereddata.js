import { defineStore } from 'pinia'
import { ref as vueRef, watch } from 'vue'
import { useFilterParameterStore } from '@/stores/filterparameters'
import { useSortParameterStore } from '@/stores/sortparameters'
import { useDataStore } from '@/stores/data'
import { debounce } from '@/utils/debounce.js'

export const useFilteredDataStore = defineStore('filtered-data', () => {
  const data = vueRef([]);
  const run = vueRef(false);

  // --- stores and helpers
  const storeData = useDataStore();
  const storeFilterParameters = useFilterParameterStore();
  const storeSortParameters = useSortParameterStore();

  // --- functions
  const debouncedFilter = debounce(doFilter, 500);

  function doFilter() {
    const start = performance.now(); // Startzeit erfassen
    const text = storeFilterParameters.text.toLowerCase();
    const TEXT = storeFilterParameters.text.toUpperCase();

    const fieldName = true; // (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_NAME));
    const fieldOrigin = true; // (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_ORIGIN_NAME));
    const fieldNote = true; // (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_NOTES));
    const fieldTracking = true; // (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_TRACKING_NUMBER));
    const fieldTag = true; // (storeFilterParameters.fields.length == 0 || storeFilterParameters.fields.includes(filter.VALUE_FIELD_TAGS));

    let s = storeData.trackables.filter(item => {
      let match = false;
      match = match || (fieldName && item.__name.includes(text));
      match = match || (fieldOrigin && item.__originname.includes(text));
      match = match || (fieldNote && item.__note.includes(text));
      match = match || (fieldTracking && item.privateCode.startsWith(TEXT));
      match = match || (fieldTag && item.__tags.includes(text));
      // TODO check if filters are selected
      // TODO eigentümer
      return match;
    });

    data.value = s;

    doSort();

    const end = performance.now(); // Endzeit erfassen
    const dauer = end - start; // Dauer berechnen
    console.log("filtered list of", s.length, "trackables in", dauer, "ms");

    run.value = false;
  }

  function doSort() {
    const start = performance.now(); // Startzeit erfassen

    // let fn = (a, b) => (reverse ? !(a.name.localeCompare(b.name)) : a.name.localeCompare(b.name));
    // let fn = (a, b) => (a.name.localeCompare(b.name));
    //let fn = ;

    data.value.sort((a, b) => (a.id > b.id));
    if (storeSortParameters.reverse) {
      data.value.reverse();
    }

    const end = performance.now(); // Endzeit erfassen
    const dauer = end - start; // Dauer berechnen
    console.log("sort list of", data.value.length, "trackables in", dauer, "ms");

    // console.log("Sorted trackables, reverse:", storeSortParameters.reverse);
    /*
    let fn = (a, b) => {
      (reverse ? a.id > b.id : a.id < b.id);
    };
    /*if (reverse) {
      fn = (a, b) => (a.id < b.id);
    }*/
    // trackables.value.sort(fn);
    // trackables.value.sort((a, b) => (a.id > b.id));
    /*if (reverse) {
      trackables.value.reverse();
    }*/


    /*
const sortedTrackables = computed(() => {
  const start = performance.now(); // Startzeit erfassen
  const s = trackables;
  // sorting
  let fn = null;
  if (store.viewOptSorting == filter.KEY_SORTING_ID) {
    fn = (a, b) => a.id > b.id;
    s.sort(fn);
  } else if (store.viewOptSorting == filter.KEY_SORTING_NAME) {
    fn = (a, b) => a.name.localeCompare(b.name);
    s.sort(fn);
  } else if (store.viewOptSorting == filter.KEY_SORTING_ORIGIN_NAME) {
    fn = (a, b) => {
      let _a = a.originName != "" ? a.originName : a.name;
      let _b = b.originName != "" ? b.originName : b.name;
      return _a.localeCompare(_b);
    };
    s.sort(fn);
  } else {
    console.warn("Unknown search option:", store.viewOptSorting);
    fn = (a, b) => a.name.localeCompare(b.name);
    s.sort(fn);
  }

  if (store.viewOptSortingOrderReverse) {
    s.reverse(fn);
  }

  const end = performance.now(); // Endzeit erfassen
  const dauer = end - start; // Dauer berechnen
  console.log("sort",s.length, "trackables in", dauer, "ms");
  return s;
});
  */
  }

  // storeFilterParameter beobachten, ob es Änderungen an den Filterparameter gab
  storeFilterParameters.$subscribe((mutation, state) => {
    run.value = true;
    debouncedFilter();
  })

  // storeSortParameter beobachten, ob es Änderungen an den Filterparameter gab
  storeSortParameters.$subscribe((mutation, state) => {
    run.value = true;
    doSort();
    run.value = false;
  })

  return {
    data,
    doFilter,
    doSort,
    run
  }
});


// match with input from the text field
/*
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
*/

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
