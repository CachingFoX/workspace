<script setup>
import { nextTick, computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import Textarea from 'primevue/textarea'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
import Carousel from 'primevue/carousel';
import TrackableCard from '@/components/TrackableCard.vue';
// components
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
import InputGroup from 'primevue/inputgroup';

const storeTrackable = useTrackableStore();
const storeTrackables = useTrackableListStore();
const router = useRouter();

const isChanged = ref(false)
const trackablesModel = ref([])
const query = ref('')

const sortTrackablesByTitle = (a,b) => {return a.title.localeCompare(b.title)}

function demarshallTrackables(trackables, tracking_numbers_string) {
  /* Demarshalling a string of tracking numbers in an array of trackable objects sorted by their titles */
  if ( !tracking_numbers_string?.trim().length || !trackables?.length ) {
    return []
  }
  let tokens = tracking_numbers_string.trim().split(' ');

  return trackables.filter( t => {
    return tokens.includes(t.private_code) || tokens.includes(t.public_code)
  }).sort(sortTrackablesByTitle)
}

function marshallTrackables(trackables) {
  /* Marshalling an array of trackable objects to a string of tracking numbers in alphabetic order */
  if ( !trackables?.length ) {
    return ""
  }

  return trackablesModel.value.map( t =>{
    return t.private_code;
  }).sort().join(" ");
}

function updateModel(trackables) {
  trackablesModel.value = demarshallTrackables(trackables, getTrackingNumbersString())
}

watch(
  () => storeTrackables.trackables,
  (newVal) => {
    updateModel(newVal)
  }
)

const search = (event) => {
  query.value = event.query.trim();
}

const notSelectedTags = computed(()=>{

  return storeTrackables.trackables.filter( a => {
    // not in the selected list
    return !trackablesModel.value.some(b => (a.id == b.id ) )
  })
})

const suggestedTrackables = computed(() => {
  loading.value = true

  let own_id = storeTrackable.id
  let own_series = storeTrackable.series
  let queryLowerCase = query.value.toLowerCase()
  let queryUpperCase = query.value.toUpperCase()

  let result = notSelectedTags.value.filter( i => {
    return i.id != own_id && /* i.series != own_series &&*/
          (
            i.title.toLowerCase().includes(queryLowerCase) ||
            i.series.toLowerCase().includes(queryLowerCase) ||
            i.private_code.startsWith(queryUpperCase) ||
            i.public_code.startsWith(queryUpperCase)
          );
  }).sort(sortTrackablesByTitle)

  loading.value = false;
  return result;
});

function onUnselect(event) {
  console.log(event);
  isChanged.value = true;
  return false;
}

function onSelect(event) {
  isChanged.value = true;
  trackablesModel.value.sort(sortTrackablesByTitle);
}

function onClick(tagId) {
}

function onRemove(event, value, removeCallback) {
  // removes item from the internal data structure NOT from the database
  event.stopPropagation() // verhindert, dass @click ausgelöst wird
  removeCallback(event) // item-select
}

function onSave() {
  isChanged.value = false;
  let tracking_numbers_string = marshallTrackables(trackablesModel.value);
  emit('update', props.property, tracking_numbers_string)
}

function onCancel() {
  isChanged.value = false;
  trackablesModel.value = demarshallTrackables(storeTrackables.trackables, getTrackingNumbersString())
}

// -----------------

const props = defineProps({
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  property: { type: Object, default: null, required: false },
})

const emit = defineEmits(['update','remove'])
const loading = ref(false)

onBeforeMount(()=>{
  updateModel(storeTrackables.trackables);
})

const trackables = computed(()=>{
  return demarshallTrackables(storeTrackables.trackables, getTrackingNumbersString())
})

function getProperty() {
  // return storeTrackable.getPropertyByName(property_name);
  return props.property
}

function getTrackingNumbersString() {
  return props.property?.property_value
}


/*

const confirm_delete = {
  message: 'Möchtest du die Eigenschaft löschen?',
  header: 'Löschen',
  icon: 'pi pi-exclamation-triangle',
  rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      outlined: true
  },
  acceptProps: {
      label: 'Löschen',
      severity: 'danger',
  },
  accept: async () => {
    try {
      // remove it (send event)
      editing.value = false;
    } catch (error) {
      console.error(error);
    }
  },
  reject: () => {}
}

*/
</script>

<template>
  <div class="flex flex-column">
    <div>
      <InputGroup>
        <AutoComplete class="w-full" ref="acRef"
          v-model="trackablesModel"
          multiple
          optionLabel="title"
          dropdown
          size="normal"
          :suggestions="suggestedTrackables"
          :typeahead="true"
          :loading="loading"
          @remove="handleRemove"
          @complete="search"
          @option-unselect="onUnselect"
          @option-select="onSelect"
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
          <template #option="slotProps">
            <div class="flex align-items-center gap-2 p-0">
              <img
                :src="slotProps.option.icon_url"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div>
                  <span class="font-semibold mr-2">{{ slotProps.option.title }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  <span class="">{{ slotProps.option.series }}</span>
                  <span v-if="slotProps.option.private_code"> • {{slotProps.option.private_code}}</span>
                  <span class=""> • {{slotProps.option.public_code}}</span>
                </div>
              </div>
            </div>
          </template>
        </AutoComplete>
        <Button severity="primary" label="Speichern" icon="pi pi-check" @click="onSave"
          v-if="isChanged"/>
        <Button severity="danger" label="Verwerfen" icon="pi pi-times" @click="onCancel"
          v-if="isChanged"/>
      </InputGroup>
    </div>
    <div>
      <Carousel :value="trackables" :numVisible="3" :numScroll="3" class="w-full">
        <template #item="slotProps">
          <TrackableCard :trackable="slotProps.data"
            trackable-owner="south-west"
            trackable-icon="north-west"
            trackable-number="north-east"
          />
        </template>
        <template #empty>
          <div></div>
        </template>
      </Carousel>
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
  cursor: default;
}
</style>
