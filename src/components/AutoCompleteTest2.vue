<script setup>
import { ref, watch, onMounted } from 'vue';
import { TagService } from "../services/TagService.js";
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';

const allItems = [
  { name: 'Apple', id: 1 },
  { name: 'Ananas', id: 2 },
  { name: 'Banana', id: 3 },
  { name: 'Birne', id: 4 },
  { name: 'Cherry', id: 5 },
  { name: 'Mango', id: 6 },
  { name: 'Marajuca', id: 7 },
  { name: 'Orange', id:8 },
  { name: 'Mandarine', id: 9 },
]

const inputValue = ref('')
const filteredSuggestions = ref([])
const lastHandledValue = ref(null);
const inputSource = ref(null)

// Filter-Methode
function searchSuggestions(event) {
  const query = event.query.toLowerCase()
  filteredSuggestions.value = allItems.filter(item =>
    item.name.toLowerCase().includes(query)
  )
}

function onEnter(e) {
  console.log("onEnter",e.target.value, typeof inputValue.value, inputValue.value);
}
</script>

<template>#
  <AutoComplete
    v-model="inputValue"
    optionLabel="name"
    :suggestions="filteredSuggestions"
    field="name"
    @complete="searchSuggestions"
    :force-selection="false"
    placeholder="Tippe etwas ein"
    dropdown
    @option-select="onOptionSelect"
    @value-change="onValueChange"
    @keydown.enter.prevent="onEnter"
  />
</template>

