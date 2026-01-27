<script setup>
import './main.css'
import Toast from 'primevue/toast';
/*
import 'primeflex/primeflex.css';

import { computed,ref } from 'vue'
import { onBeforeMount, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useSearchFilterStore} from '@/stores/search'
import { useFilteredDataStore } from '@/stores/filtereddata'

const storeFilteredData = useFilteredDataStore();
const store = useSearchFilterStore();
const dataStore = useDataStore();

onBeforeMount(() => {
  dataStore.initData();
  storeFilteredData.doFilter();
});
*/
</script>

<template>
  <router-view/>
  <Toast/>
</template>

<style scoped>
</style>


