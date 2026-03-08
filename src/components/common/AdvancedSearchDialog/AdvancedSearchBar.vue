<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useAdvancedSearchStore, ADVANCED_SEARCH_TYPES } from '@/stores/AdvancedSearchStore.js'

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import AutoComplete from 'primevue/autocomplete';
import AdvancedSearchEmpty from      '@/components/common/AdvancedSearchDialog/Empty.vue';
import AdvancedSearchItemSeries from '@/components/common/AdvancedSearchDialog/ItemSeries.vue';
import AdvancedSearchItemTag from       '@/components/common/AdvancedSearchDialog/ItemTag.vue';
import AdvancedSearchItemTrackable from '@/components/common/AdvancedSearchDialog/ItemTrackable.vue';


const router = useRouter();
const store = useAdvancedSearchStore();

const emits = defineEmits(['select'])

const props = defineProps({
  placeholder: { Type: String, default: [], required: false}
})

const inputfield = ref(null);

async function setFocus() {
  await nextTick()
  inputfield.value.$el.querySelector('input').focus();
}

async function clearFocus() {
  await nextTick()
  inputfield.value.$el.querySelector('input').blur();
}

const itemTypes = {
  [ADVANCED_SEARCH_TYPES.SERIES]: AdvancedSearchItemSeries,
  [ADVANCED_SEARCH_TYPES.TAG]: AdvancedSearchItemTag,
  [ADVANCED_SEARCH_TYPES.TRACKABLE]: AdvancedSearchItemTrackable,
}

function onChange(event) {
  if (typeof event.value == 'object' && event.value.route?.length) {
    emits('select', event.value)
    router.push(event.value.route)
  }
}

function onEnter() {
  if (store.isQueryStringTrackingNumber) {
    emits('select', store.queryString)
    router.push(`/trackable/${store.queryStringUpperCase}?masterdata=autoload`)
    store.queryString = ""
  }
}

onMounted(()=>{
  setFocus()
})
</script>

<template>
  <IconField>
    <InputIcon class="pi pi-search" />
    <AutoComplete class="w-full" ref="inputfield"
      v-model="store.queryString"
      optionLabel="label"
      :optionGroupLabel="store.grouped ? 'label' : null"
      :optionGroupChildren="store.grouped ? 'items' : null"
      size="normal"
      :suggestions="store.suggestions"
      :typeahead="true"
      :loading="store.loading"
      :placeholder="props.placeholder"
      :delay="300"
      @change="onChange"
      @keydown.enter="onEnter"
      inputClass="w-full"
      autofocus
      scrollHeight="26rem"
      dropdown
    >
      <template #empty="slotProps">
        <AdvancedSearchEmpty @click="onEnter"/>
      </template>
      <template #option="slotProps">
        <component :is="itemTypes[slotProps.option.type]" :data="slotProps.option.data" />
      </template>
    </AutoComplete>
    <InputIcon v-show="!store.loading" class="mr-6">
      <span class="no-select" v-show="store.queryString && store.numberOfSuggestions">{{store.numberOfSuggestions}} Treffer</span>
      <span class="no-select" v-show="!store.queryString">{{ store.numberOfItems }} Einträge</span>
    </InputIcon>
  </IconField>
</template>
