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
import ToggleSwitch from 'primevue/toggleswitch';

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

// const query = ref(null);

const search = (event) => {
  console.log("search", event.query, model.value, event)
  // query.value = event.query.trim();
}

const sortItemsByLabel = (a,b) => {return a.label.localeCompare(b.label)}

const grouped = ref(true)

const suggestedItemsCount = computed(()=>{
  if (!suggestedItems.value?.length) {
    return 0;
  }
  if (!grouped.value ) {
    return suggestedItems.value.length;
  }
  let items = 0;
  suggestedItems.value.forEach(group => {
    items += group.items.length
  });
  return items;
});


function addItems(suggestions, grouped, groupLabel, newSuggestions) {
  if (newSuggestions?.length) {
    if (!grouped) {
      suggestions.push(...newSuggestions)
    } else {
      newSuggestions.sort(sortItemsByLabel);
      suggestions.push({
        label: groupLabel,
        code: groupLabel,
        items: [...newSuggestions]
      })
    }
  }
}

/*
  {
    type:
    lable: defines what is shown in the input field
    route:
    data: stores the data
  }
*/
const suggestedItems = computed(() => {
  let userInput = model.value

  if (!userInput?.trim().length ) {
    console.log("no suggests");
    return []
  }

  console.time("Berechnung");

  loading.value = true

  userInput = userInput.trim();
  let queryLowerCase = userInput.toLowerCase()
  let queryUpperCase = userInput.toUpperCase()

  let suggestedItems = [];
  let results = [];

  // ------------

  results = props.trackables.filter( i => {
    return i.title.toLowerCase().includes(queryLowerCase) ||
           i.series.toLowerCase().includes(queryLowerCase) ||
           i.private_code.startsWith(queryUpperCase) ||
           i.public_code.startsWith(queryUpperCase) ||
           i.tags.some(t=> {
            return t.name.toLowerCase().includes(queryLowerCase)
          })
  })

  addItems(suggestedItems, grouped.value, 'Trackables', results.map((i)=>{
    return { type: 'trackable', label: i.title, route: `/trackable/${i.public_code}` , data: i }
  }))

  // ------------

  results = props.tags.filter ( t => {
    return t.name.toLowerCase().includes(queryLowerCase);
  })

  addItems(suggestedItems, grouped.value, 'Tags', results.map((i)=>{
    return { type: 'tag', label: i.name, route: `/tag/${i.id}?label=${i.name}`, data: i }
  }))

  // ------------

  results = props.series.filter ( s => {
    return s.series.toLowerCase().includes(queryLowerCase);
  })

  addItems(suggestedItems, grouped.value, 'Series', results.map((i)=>{
    return { type: 'series', label: i.series, route: `/series/${i.series}`, data: i }
  }))

  // ----------

  if (!grouped.value) {
    suggestedItems.sort(sortItemsByLabel);
  }

  loading.value = false;

  console.timeEnd("Berechnung");
  console.log(suggestedItems)
  return suggestedItems;
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
  if (typeof model.value == 'string' && model.value?.trim().length >= 6) {
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
      :optionGroupLabel="grouped ? 'label' : null"
      :optionGroupChildren="grouped ? 'items' : null"
      size="normal"
      :suggestions="suggestedItems"
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
      <span class="no-select" v-show="suggestedItemsCount && model">{{suggestedItemsCount}} Treffer</span>
      <span class="no-select" v-show="!model?.length">{{ allItems }} Einträge</span>
    </InputIcon>
  </IconField>
  <label class="switch-label mt-2">
    <ToggleSwitch v-model="grouped" />
    <span>Vorschläge gruppieren</span>
  </label>
</template>

<style scoped>
.switch-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
