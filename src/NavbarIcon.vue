<script setup>
import './main.css'
import 'primeflex/primeflex.css';
import { computed } from 'vue'
import { getCurrentInstance } from 'vue'
import { onBeforeMount, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useSearchFilterStore} from '@/stores/search'
import * as filter from '@/stores/search';
import CategorizedDataItem from './CategorizedDataItem.vue'
import SearchBar from './SearchBar.vue'
import TrackableDataItem from './TrackableDataItem.vue'
import { createPinia } from 'pinia';
import { useFilteredDataStore } from '@/stores/filtereddata'
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const storeFilteredData = useFilteredDataStore();
const store = useSearchFilterStore();
const dataStore = useDataStore();

onBeforeMount(() => {
  dataStore.initData();
});



const __selectedTrackables = computed(() => {
  const start = performance.now(); // Startzeit erfassen
  const text = store.inputFreeText.toLowerCase();
  const TEXT = store.inputFreeText.toUpperCase();

  let s = dataStore.trackables.filter(item => {
    let match = false;
    // match with input from the text field
    match = match || ((store.fields.length == 0 || store.fields.includes("name")) && item.name.toLowerCase().includes(text));
    match = match || ((store.fields.length == 0 || store.fields.includes("origin")) && item.originName.toLowerCase().includes(text));
    match = match || ((store.fields.length == 0 || store.fields.includes("note")) && item.note.toLowerCase().includes(text));
    match = match || ((store.fields.length == 0 || store.fields.includes("tracking")) && item.privateCode.toUpperCase().startsWith(TEXT));
    if (!match && (store.fields.length == 0 || store.fields.includes("tag")) && store.checkedIncludeTags) {
      for (let tag of item.tags) {
        if (tag.toLowerCase().includes(text)) {
          match = true;
          break;
        }
      }
    }
    if (!match && (store.fields.length == 0 || store.fields.includes("collection")) && store.checkedIncludeCollections) {
      for (let collection of item.collections) {
        if (collection.toLowerCase().includes(text)) {
          match = true;
          break;
        }
      }
    }
    // match with the selects
    const matchesCollection = arrayMatch(store.selectedCollections, item.collections, store.checkedAllCollections);
    const matchesTag = arrayMatch(store.selectedTags, item.tags, store.checkedAllTags);
    return matchesCollection && matchesTag && match;
  });

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
  console.log("computed filtered list of",s.length, "trackables in", dauer, "ms");
  return s;
});

const version = __APP_VERSION__;
console.log("App version:", __APP_VERSION__);

const xxx = computed(() => {
  if (store.viewOptCategorize == 'collections') {
    return store.selectedCollections.length ? store.selectedCollections : [...dataStore.collections,'']
  } else if (store.viewOptCategorize == 'tags') {
    return store.selectedTags.length ? store.selectedTags : [...dataStore.tags,'']
  } else if (store.viewOptCategorize == 'owners') {
    return [...dataStore.owners,'']; // TODO
  }
  console.error("dkfjaslkdfklasdf");
  return [''];
});



function screen() {
  return window.innerWidth + " " + window.innerHeight;
}

</script>


<template>
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="42" height="48"
  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 75 75">
    <defs>
      <mask id="mask" x="19.44" y="22.88" width="36.45" height="36.98" maskUnits="userSpaceOnUse">
        <g id="c"><rect id="b" class="cls-1" x="23.12" y="31.14" width="32.52" height="16.5" rx="2" ry="2" transform="translate(-16.31 39.38) rotate(-45)"/></g></mask></defs><title>illo_drop</title><rect class="cls-2" x="12.52" y="25.29" width="50.97" height="30.71" rx="1" ry="1"/><path class="cls-2" d="M11.69,21.4a1,1,0,0,1,1-1L64,21.16a.88.88,0,0,1,.88,1l-.13,1.15a1.14,1.14,0,0,1-1.11,1l-51-.31a1,1,0,0,1-1-1Z"/><rect id="a" class="cls-1" x="22.38" y="30.38" width="34" height="18" rx="3" ry="3" transform="translate(-16.31 39.38) rotate(-45)"/><rect class="cls-3" x="22.88" y="30.88" width="33" height="17" rx="3" ry="3" transform="translate(-16.31 39.38) rotate(-45)"/><rect id="b-2" data-name="b" class="cls-1" x="23.12" y="31.14" width="32.52" height="16.5" rx="2" ry="2" transform="translate(-16.31 39.38) rotate(-45)"/><g class="cls-4"><polygon class="cls-5" points="31.64 59.86 43.48 23.62 19.44 47.66 31.64 59.86"/></g><path class="cls-6" d="M41.25,38.67,41,40.27s-2.89,4.15-5,2,2-5.05,2-5.05l1.6-.25,1.7,1.7Zm.95-.46c-.39.39-.79.61-1.79-.4S39.62,36.4,40,36a1.62,1.62,0,0,1,2.19,2.19Z"/><path class="cls-7" d="M42.26,36.74l1.24-.16.7.23M41.48,36l.16-1.24L41.4,34M41,40.35,42,41l1.28-.43m-5.46-3.34-.63-1,.43-1.28m1.54,7.26.63,1-.62,1.1M36.07,39l-1-.63-1.1.62"/><rect class="cls-8" x="12.53" y="25.3" width="51.96" height="31.7" rx="1" ry="1"/><rect class="cls-8" x="12.32" y="21.25" width="51.9" height="3.59" rx="1" ry="1"/>
      <path class="cls-9" d="M29.91,21.25V18.55a.89.89,0,0,1,.87-.89H46.63a.88.88,0,0,1,.87.89v2.69"/>
  </svg>
</template>

<style scoped>
.cls-1{fill:#fff;}
.cls-2{fill:#1eb265;}
.cls-3,.cls-6,.cls-7,.cls-8,.cls-9{fill:none;}
.cls-3,.cls-6,.cls-7{stroke:#333232;}
.cls-4{mask:url(#mask);}
.cls-5{fill:#ebeced;}
.cls-6,.cls-7{stroke-width:0.5px;}
.cls-7{stroke-linecap:round;}
.cls-8,.cls-9{stroke:#333;}
.cls-9{stroke-linejoin:round;stroke-width:2px;}
</style>


