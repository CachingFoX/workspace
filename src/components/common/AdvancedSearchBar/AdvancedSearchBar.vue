<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import AutoComplete from 'primevue/autocomplete';
import AdvancedSearchEmpty from      '@/components/common/AdvancedSearchBar/Empty.vue';
import AdvancedSearchItemSeries from '@/components/common/AdvancedSearchBar/ItemSeries.vue';
import AdvancedSearchItemTag from       '@/components/common/AdvancedSearchBar/ItemTag.vue';
import AdvancedSearchItemTrackable from '@/components/common/AdvancedSearchBar/ItemTrackable.vue';

const router = useRouter();

const emits = defineEmits(['select'])

const props = defineProps({
  series: { Type: Object, default: [], required: false},
  tags: { Type: Object, default: [], required: false},
  trackables: { Type: Object, default: [], required: false},
  placeholder: { Type: String, default: [], required: false}
})

const model = ref(null);
const loading = ref(false);
const inputfield = ref(null);

async function setFocus() {
  await nextTick()
  inputfield.value.$el.querySelector('input').focus();
}

async function clearFocus() {
  await nextTick()
  inputfield.value.$el.querySelector('input').blur();
}

const query = ref(null);

const search = (event) => {
  query.value = event.query.trim();
}

const sortItemsByLabel = (a,b) => {return a.label.localeCompare(b.label)}

/*
  {
    type:
    lable: defines what is shown in the input field
    route:
    data: stores the data
  }
*/
const suggestedTrackables = computed(() => {
  console.time("Berechnung");

  if (!query.value?.length || !props.trackables?.length) {
    return []
  }
  loading.value = true

  nextTick();
  let queryLowerCase = query.value.toLowerCase()
  let queryUpperCase = query.value.toUpperCase()

  let result = [];

  let resultTBs = props.trackables.filter( i => {
    return i.title.toLowerCase().includes(queryLowerCase) ||
           i.series.toLowerCase().includes(queryLowerCase) ||
           i.private_code.startsWith(queryUpperCase) ||
           i.public_code.startsWith(queryUpperCase) ||
           i.tags.some(t=> {
            return t.name.toLowerCase().includes(queryLowerCase)
          })
  })

  result.push(...resultTBs.map(i=>{
    return { type: 'trackable', label: i.title, route: `/trackable/${i.public_code}` , data: i }
  }))

  // ------------

  let resultTags = props.tags.filter ( t => {
    return t.name.toLowerCase().includes(queryLowerCase);
  })

  result.push(...resultTags.map(i=>{
    return { type: 'tag', label: i.name, route: `/tag/${i.id}?label=${i.name}`, data: i }
  }))

  // ------------

  let resultSeries = props.series.filter ( s => {
    return s.series.toLowerCase().includes(queryLowerCase);
  })

  result.push(...resultSeries.map( i=>{
    return { type: 'series', label: i.series, route: `/series/${i.series}`, data: i }
  }))

  // ----------

  result.sort(sortItemsByLabel);

  loading.value = false;

  console.timeEnd("Berechnung");
  return result;
});



const itemTypes = {
  'series': AdvancedSearchItemSeries,
  'tag': AdvancedSearchItemTag,
  'trackable': AdvancedSearchItemTrackable,
}

function onChange(event) {
  if (typeof event.value == 'object' && event.value.route?.length) {
    emits('select', event.value)
    router.push(event.value.route)
  }
}

function onEnter() {
  if (isTrackingNumber.value) {
    emits('select', model.value)
    router.push(`/trackable/${model.value.trim().toUpperCase()}?masterdata=autoload`)
  }
}

const allItems = computed(()=>{
  return props.trackables.length + props.tags.length + props.series.length
})

const isTrackingNumber = computed(()=>{
  if (typeof model.value == 'string' && model.value?.length >= 6) {
    let a = model.value.trim().toUpperCase()
    if (!a.includes(' ') && !a.startsWith('TB')) {
      return true;
    }
  }
  return false;
})


onMounted(()=>{
  setFocus()
})
</script>

<template>
  <IconField>
    <InputIcon class="pi pi-search" />
    <AutoComplete class="w-full" ref="inputfield"
      v-model="model"
      optionLabel="label"
      size="normal"
      :suggestions="suggestedTrackables"
      :typeahead="true"
      :loading="loading"
      :placeholder="props.placeholder"
      :delay="300"
      @complete="search"
      @change="onChange"
      @keydown.enter="onEnter"
      inputClass="w-full"
      autofocus
      scrollHeight="26rem"
      dropdown
    >
      <template #empty="slotProps">
        <AdvancedSearchEmpty @click="onEnter" :input="model" :show-button="isTrackingNumber"/>
      </template>
      <template #option="slotProps">
        <component :is="itemTypes[slotProps.option.type]" :data="slotProps.option.data" />
      </template>
    </AutoComplete>
    <InputIcon v-show="!loading" class="mr-6">
      <span class="no-select" v-show="suggestedTrackables.length && model">{{suggestedTrackables.length}} Treffer</span>
      <span class="no-select" v-show="!model?.length">{{ allItems }} Einträge</span>
    </InputIcon>
  </IconField>
</template>

<style scoped>
</style>
