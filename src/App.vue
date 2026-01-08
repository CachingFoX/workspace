<script setup>
import './main.css'
import 'primeflex/primeflex.css';
import { computed,ref } from 'vue'
import { onBeforeMount, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useSearchFilterStore} from '@/stores/search'
import SearchBar from './SearchBar.vue'
import TrackableDataItem from './TrackableDataItem.vue'

import { useFilteredDataStore } from '@/stores/filtereddata'

const storeFilteredData = useFilteredDataStore();
const store = useSearchFilterStore();
const dataStore = useDataStore();

onBeforeMount(() => {
  dataStore.initData();
  storeFilteredData.doFilter();
});
</script>

<template>
  <div class="container">
    <div class="header">
      <SearchBar
        :collections="dataStore.collections"
        :tags="dataStore.tags"
        :owners="dataStore.owners"/>
    </div>
    <div class="content">
      <div class="scrollable-content">
        <router-view></router-view>
        <!--
        <TrackableDataItem  :items="storeFilteredData.data"
          @selectCollection="store.addNewCollection($event)"
          @selectTag="store.addNewTag($event)"/>
      -->
      </div>
    </div>
    <div class="footer">
      <div style="display: flex; width: 100%;" class="text-sm">
        <div style="flex: 1; text-align: left;" class="hidden sm:hidden md:block">
            {{ storeFilteredData.data.length}} von {{ dataStore.trackables.length }} Trackables
        </div>
        <div style="flex: 1; text-align: left;" class="hidden md:hidden sm:block">
            {{ storeFilteredData.data.length}} von {{ dataStore.trackables.length }}
        </div>
        <div style="flex: 1; text-align: center;" class="hidden sm:hidden md:block" >{{ dataStore.collections.length }} Sammlungen, {{ dataStore.tags.length }} Schlagwörter</div>
        <!-- <div style="flex: 1; text-align: right;">v{{ version }}</div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* zwei Spalten gleiche Breite */
  gap: 10px; /* Abstand zwischen Zellen */
}

.cell {
  border: 1px solid #333;
  padding: 10px;
  text-align: center;
}

.cell.header {
  font-weight: bold;
  background-color: #f0f0f0;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.header {
  width: 100%;
  /* Höhe passt sich dem Inhalt an */
  flex-shrink: 0;
  background: #fff;
  padding-bottom: 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}
.content {
  width: 100%;
  flex: 1 1 0;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.footer {
  width: 100%;
  /* Höhe passt sich dem Inhalt an */
  flex-shrink: 0;
  background: #fafafa;
  padding: 1rem;
  padding-bottom: 0.1rem;
  padding-top: 0.1rem;
  box-sizing: border-box;
  border-top: 2px solid #eee;
}
.scrollable-content {
  overflow-y: auto;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
</style>


