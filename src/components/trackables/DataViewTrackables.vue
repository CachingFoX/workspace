<script setup>
import { onMounted, ref, computed, popScopeId } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import Divider from 'primevue/divider';
import DataView from 'primevue/dataview';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';
import Chip from 'primevue/chip';
import TrackableCard from '@/components/TrackableCard.vue';
import TrackableListItem from '@/components/TrackableListItem.vue';
import { useLocalStorageRef } from '@/utils/localStorageRef'

const storeTrackables = useTrackableListStore();
const router = useRouter();
const route = useRoute()

const layout = useLocalStorageRef('trackablelist.layout', 'list');
const sort = useLocalStorageRef('trackablelist.sort', 'title_up');
const filter = useLocalStorageRef('trackablelist.filter', 'filter');

const options = ref(['list', 'grid']);

const props = defineProps({
  trackables: { type: Object, default: [], required: true},
  filter: { type: Object, default: null, required: false}
})

const trackables = computed(()=>{
  if (sort.value in sort_functions) {
    sort_functions[sort.value](props.trackables);
  }
  if (filter.value in filter_functions) {
    return props.trackables.filter(filter_functions[filter.value])
  }
  return props.trackables
})

const alphabetic_ascend = function(attribute) { return (items) => {
    items.sort( (a,b) => { return a[attribute].localeCompare(b[attribute]) })
}}
const alphabetic_descend = function(attribute) { return (items) => {
    items.sort( (a,b) => { return b[attribute].localeCompare(a[attribute]) })
}}
const numeric_ascend = function(attribute) { return (items) => {
    items.sort( (a,b) => { return a[attribute] > b[attribute] })
}}
const numeric_descend = function(attribute) { return (items) => {
    items.sort( (a,b) => { return a[attribute] < b[attribute] })
}}

const sort_functions = {
  'title_up': alphabetic_ascend('title'),
  'title_down': alphabetic_descend('title'),
  'age_old_young': numeric_ascend('tb_id'),
  'age_young_old': numeric_descend('tb_id'),
}
const sortOptions = [
  { label: 'Name A-Z', value: 'title_up' },
  { label: 'Name Z-A', value: 'title_down' },
  { label: 'Älteste',  value: 'age_old_young' },
  { label: 'Neuste',  value: 'age_young_old' },
];

const filter_functions = {
  'no_pictures': (a) => { return a.images.length ? false : true },
  'activated': (a) => { return a.activated },
  'not_activated': (a) => { return !a.activated }
}
const filterOptions = [
  { label: 'alle', value: 'no_filter' },
  { label: 'keine Bilder', value: 'no_pictures' },
  { label: 'aktiviert', value: 'activated' },
  { label: 'unaktiviert', value: 'not_activated' },
  // { label: 'Älteste',  value: 'age_old_young' },
  // { label: 'Neuste',  value: 'age_young_old' },
];

</script>

<template>
  <DataView :value="trackables" :layout="layout">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <div>
          <i class="pi pi-sort mr-2"/>
          <Select v-model="sort"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Sortierung"
            />
        </div>

        <div>
          <i class="pi pi-filter mr-2"/>
          <Select v-model="filter"
            :options="filterOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter"
            />
        </div>

        <div v-if="props.filter" class="flex align-items-center">
          <div>
            <i class="pi pi-filter"/><span class="ml-2 mr-2">Filter:</span>
          </div>
          <Chip
            :label="props.filter.label"
            :icon="props.filter.icon"
            :image="props.filter.avatar"
            class="no-select"
          />
        </div>

        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
          <template #option="{ option }">
            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
          </template>
        </SelectButton>
      </div>
    </template>

    <template #list="slotProps">
      <template v-for="(item, index) in slotProps.items" class="">
        <div class="px-2"><Divider v-if="index" class="-1"/></div>
        <TrackableListItem :trackable="item" class="p-2"/>
      </template>
    </template>

    <template #grid="slotProps">
      <div class="p-1 flex flex-wrap justify-content-center">
        <template v-for="(item, index) in slotProps.items">
          <TrackableCard :trackable="item"
            trackable-owner="south-west"
            trackable-icon="north-west"
            trackable-number="north-east"
          />
        </template>
      </div>
    </template>
  </DataView>
</template>


<style scoped>
.trackable-list-item-title {
}
.trackable-list-item-subtitle {
}
.p-divider {
  margin: 0.25rem 0; /* oben und unten 2rem */
}

/* vertical divider */
.p-divider-vertical {
  margin: 0 0rem; /* links und rechts 1rem */
}

.trackable-list-item {
}
.trackable-list-item:hover {
  background-color: lightblue;
}
.clickable {
  cursor: pointer;
}
.user-tag:hover {
  background-color: #ccc;
}

/* cards */

.card {
  aspect-ratio: 1 / 1;   /* Höhe = Breite */
  object-fit: cover;     /* füllt komplett, schneidet ggf. */
  object-position: center;
  display: block;
  margin: auto;          /* zentriert im div */
  border-radius: 8px;
}

.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 1 / 1;
}

.card-image-container.border {
  border: 1px solid #eee;
  border-radius: 8px;
}


.card-img {
  width: 100%;
}

.card-icon {
  width: 33%;
  min-width: 32px;
}
</style>
