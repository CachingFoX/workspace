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
const options = ref(['list', 'grid']);

const props = defineProps({
  trackables: { type: Object, default: [], required: true},
  filter: { type: Object, default: null, required: false}
})

const trackables = computed(()=>{
  return props.trackables
})
</script>

<template>
  <DataView :value="trackables" :layout="layout">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <Select>
        </Select>

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
