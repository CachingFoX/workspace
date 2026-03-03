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

const emits = defineEmits(['change'])

const props = defineProps({
  series: { Type: Object, default: [], required: false},
  tags: { Type: Object, default: [], required: false},
  trackables: { Type: Object, default: [], required: false},
  placeholder: { Type: String, default: [], required: false}
})

const model = ref(null);
const loading = ref(false);
const inputfield = ref(null);
const isFocused = ref(false);


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

const sortTrackablesByTitle = (a,b) => {return a.title.localeCompare(b.title)}

const suggestedTrackables = computed(() => {
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
           i.public_code.startsWith(queryUpperCase);
  }).sort(sortTrackablesByTitle)

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

  loading.value = false;
  return result;
});



const itemTypes = {
  'series': AdvancedSearchItemSeries,
  'tag': AdvancedSearchItemTag,
  'trackable': AdvancedSearchItemTrackable,
}

function onChange(event) {
  if (typeof event.value == 'object' && event.value.route?.length) {
    router.push(event.value.route)
  }
}

function onEnter() {
  console.log(model.value)
  if (typeof model.value == 'string' && model.value?.length >= 6) {
    router.push(`/trackable/${model.value.trim().toUpperCase()}?masterdata=autoload`)
  }

  // searchModel.value = "";
  // clearFocus()
  // emits('change', e.target.value)
}

onMounted(()=>{
  console.log("x")
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
      @complete="search"
      @change="onChange"
      @keydown.enter="onEnter"
      inputClass="w-full"
      autofocus
    >
      <template #empty="slotProps">
        <AdvancedSearchEmpty :model="model"/>
      </template>
      <template #option="slotProps">
        <component :is="itemTypes[slotProps.option.type]" :data="slotProps.option.data" />
      </template>
    </AutoComplete>
  </IconField>
</template>

<style scoped>
</style>
