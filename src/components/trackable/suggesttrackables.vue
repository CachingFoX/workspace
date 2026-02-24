<script setup>
import { computed,ref, watch, onBeforeMount, watchEffect, onMounted } from 'vue'
// prime vue
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
import Button from "primevue/button";
import InputGroup from 'primevue/inputgroup';

const storeTrackable = useTrackableStore();
const storeTrackables = useTrackableListStore();
const router = useRouter();

const property_name = 'linkedTrackables'
const isChanged = ref(false)
const trackablesModel = ref([])
const query = ref('')

const sortTrackablesByTitle = (a,b) => {return a.title.localeCompare(b.title)}

function demarshallTrackables(trackables, tracking_numbers_string) {
  /* Demarshalling a string of tracking numbers in an array of trackable objects sorted by their titles */
  if ( !tracking_numbers_string?.property_value?.trim().length || !trackables?.length ) {
    return []
  }
  let tokens = tracking_numbers_string.property_value.split(' ');

  return trackables.filter( t => {
    return tokens.includes(t.private_code) || tokens.includes(t.public_code)
  }).sort(sortTrackablesByTitle)
}

function marshallTrackables(trackables) {
  /* Marshalling an array of trackable objects to a string of tracking numbers in alphabetic order */
  if ( !trackables?.length ) {
    return []
  }

  return trackablesModel.value.map( t =>{
    return t.private_code;
  }).sort().join(" ");
}

watch(
  () => storeTrackables.trackables,
  (newVal) => {
    let tracking_numbers_string = storeTrackable.getPropertyByName(property_name);
    trackablesModel.value = demarshallTrackables(storeTrackables.trackables, tracking_numbers_string)
  }
)

const search = (event) => {
  query.value = event.query.trim();
}

const notSelectedTags = computed(()=>{
  let own_id = storeTrackable.id
  return storeTrackables.trackables.filter( a => {
    // not in the selected list and not the own tracking code
    return !trackablesModel.value.some(b => a.id == b.id || a.id == own_id )
  })
})

const suggestedTrackables = computed(() => {
  let queryLowerCase = query.value.toLowerCase()
  let queryUpperCase = query.value.toUpperCase()

  return notSelectedTags.value.filter( i => {
    return i.title.toLowerCase().startsWith(queryLowerCase)||
      i.private_code.startsWith(queryUpperCase) ;
  }).sort(sortTrackablesByTitle)
});

async function addCustomValue(event) {
  const input = event.target.value.trim()
  const inputLowerCase = input.toLowerCase()
  event.target.value = "";

  if (input.length == 0 ) {
    return;
  }
}

function onUnselect(event) {
  isChanged.value = true;
}

function onSelect(event) {
  isChanged.value = true;
  trackablesModel.value.sort(sortTrackablesByTitle);
}

function onClick(tagId) {
  // router.push("/tag/"+tagId)
}

function onRemove(event, value, removeCallback) {
  event.stopPropagation() // verhindert, dass @click ausgelöst wird
  removeCallback(event) // item-select
}

function onSave() {
  isChanged.value = false;
  let tracking_numbers_string = marshallTrackables(trackablesModel.value);
  storeTrackable.setPropertyByName(property_name, tracking_numbers_string);
}

function onCancel() {
  isChanged.value = false;
  let tracking_numbers_string = storeTrackable.getPropertyByName(property_name);
  trackablesModel.value = demarshallTrackables(storeTrackables.trackables, tracking_numbers_string)
}
</script>

<template>
  <div class="flex flex-column tags-container">
    <div>
      <AutoComplete
        v-model="trackablesModel"
        :suggestions="suggestedTrackables"
        :typeahead="true"
        multiple
        optionLabel="title"
        @complete="search"
        @keydown.enter="addCustomValue"
        @option-unselect="onUnselect"
        @option-select="onSelect"
        dropdown
        size="normal"
      >
        <template #chip="{ value, removeCallback }">
          <div class="custom-chip no-select">
            <Chip class="chip" :label="value.title" :image="value.icon_url" removable size="small" @click="onClick(value.id)"
            @remove="onRemove($event, value, removeCallback)"
              :xpt="{
                root: { style: { padding: '5px 5px', fontSize: '14px', borderRadius: '8px', 'gap': '0.4rem' } },
                label: { style: { fontSize: '14px' } },
                icon: { style: { marginTop: '2px', padding: '0px 3px' } }
              }"
            />
          </div>
        </template>
      </AutoComplete>
    </div>
    <div>
      <InputGroup>
        <Button severity="primary" label="Speichern" icon="pi pi-check" @click="onSave"
          :disabled="!isChanged"/>
        <Button severity="danger" label="Verwerfen" icon="pi pi-times" @click="onCancel"
          :disabled="!isChanged"/>
      </InputGroup>
    </div>

  </div>
</template>

<style scoped>
:deep(.p-chip-remove-icon:hover) {
  color: red;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
}
.chip {
  cursor: pointer;
}
</style>
