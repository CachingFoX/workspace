
<script setup>
import { defineProps, ref } from 'vue'
import DataView from 'primevue/dataview';
import 'primeflex/primeflex.css';
import Chip from 'primevue/chip';
import 'primeicons/primeicons.css'
import Tag from 'primevue/tag';
import TrackableImage from './TrackableImage.vue';
import TrackableDataItem from './TrackableDataItem.vue';
import { computed } from 'vue'
import Badge from 'primevue/badge';
import ToggleButton from 'primevue/togglebutton';

const props = defineProps({
  attribute: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  items: {
    type: Object,
    required: true
  },
  categories: {
    type: Object,
    required: true
  }
})

const categorizedItems = computed(() => {
  const start = performance.now(); // Startzeit erfassen
  const d = {};
  let attribute = props.attribute === undefined ? "" : props.attribute;
  console.log(props.attribute, attribute);
  for (let category of props.categories) {
    let e = [];
    e = props.items.filter(item => {
      if (category == '') {
        return item[attribute].length == 0;
      }
      return item[attribute].includes(category);
    });
    if (e.length) {
      d[category != ''?category:"<Keine Kategorie>"] = e;
    }
  }

  const end = performance.now(); // Endzeit erfassen
  const dauer = end - start; // Dauer berechnen
  console.log("categorize data takes", dauer, "ms");

  return d;
});

const visible = ref([]);
const visible2 = ref([]);

function toggle(index) {
  let x = visible.value;
  x[index]=!x[index];
  console.log(index, visible[index].value,visible);
}

</script>

<template>
  <template v-for="(category_items, category_key, index) in categorizedItems" :key="category_key" >
    <div class="flex mt-4 mb-0" style="border-bottom: 2px solid #333; padding-bottom: 0rem;">
      <div style="align-content: center;"><i class="text-xl font-bold" :class="props.icon"></i></div>
      <div style="align-content: center;" class="ml-2"><span class="text-3xl font-bold">{{ category_key }}</span></div>
      <div style="align-content: center;" class="ml-2"><Badge :value="category_items.length" severity="warn"></Badge></div>
      <div style="flex: 1 1 auto"></div>
      <div style="align-content: center;flex: 0 0 auto">
        <!--<ToggleButton v-model="visiblex"
          onLabel="Einklappen" onIcon="pi pi-caret-up"
          offLabel="Ausklappen" offIcon="pi pi-caret-down"
          size="small" />
        <ToggleButton v-model="visiblex"
          onLabel="Einklappen" onIcon="pi pi-caret-up"
          offLabel="Ausklappen" offIcon="pi pi-caret-down"
          size="small" />-->
        <i class="pi pi-sort-up-fill" v-show="!visible[index]" @click="toggle(index)"></i>
        <i class="pi pi-sort-down-fill" v-show="visible[index]" @click="toggle(index)"></i>
      </div>
    </div>
    <TrackableDataItem :items="category_items" v-show="!visible[index]"
      @selectCollection="$emit('selectCollection', $event)"
      @selectTag="$emit('selectTag', $event)"/>
  </template>
</template>

<style scoped>
</style>
