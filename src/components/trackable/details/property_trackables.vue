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
// components
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
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

function updateModel(trackables) {
    let tracking_numbers_string = storeTrackable.getPropertyByName(property_name);
    trackablesModel.value = demarshallTrackables(trackables, tracking_numbers_string)
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
  let own_id = storeTrackable.id
  return storeTrackables.trackables.filter( a => {
    // not in the selected list and not the own tracking code
    return !trackablesModel.value.some(b => a.id == b.id || a.id == own_id )
  })
})

const suggestedTrackables = computed(() => {
  loading.value = true
  nextTick();
  let queryLowerCase = query.value.toLowerCase()
  let queryUpperCase = query.value.toUpperCase()

  let result = notSelectedTags.value.filter( i => {
    return  i.title.toLowerCase().includes(queryLowerCase)|| //  i.title.toLowerCase().startsWith(queryLowerCase)||
      i.private_code.startsWith(queryUpperCase) ;
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
  event.stopPropagation() // verhindert, dass @click ausgelöst wird
  removeCallback(event) // item-select
}

function onSave() {
  isChanged.value = false;
  let tracking_numbers_string = marshallTrackables(trackablesModel.value);
  storeTrackable.setPropertyByName(property_name, tracking_numbers_string);
  // TODO emit('update', tracking_numbers_string);
}

// TODO remove
// TODO emit('remove', trackable_property_id);

function onCancel() {
  isChanged.value = false;
  let tracking_numbers_string = storeTrackable.getPropertyByName(property_name);
  trackablesModel.value = demarshallTrackables(storeTrackables.trackables, tracking_numbers_string)
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

/*
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const disableDelete = computed(() => {
  return linkedTrackables.value?.id === null ?? true;
});

const disableSave = computed(() => {
  return (model.value ?? "") == (linkedTrackables.value?.property_value ?? "")
});

const onEdit = () => {
  model.value = linkedTrackables.value?.property_value ?? "";
}

const onSave = () => {
  editing.value = false;
  if (model.value != linkedTrackables.value.property_value) {
    storeTrackable.setPropertyByName(property_name, model.value);
  }
};

const onCancel = () => {
  editing.value = false;
  model.value = linkedTrackables.value.property_value;
};

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
      storeTrackable.removePropertyByName(property_name)
      editing.value = false;
    } catch (error) {
      console.error(error);
    }
  },
  reject: () => {}
}

async function onDelete() {
  confirm.require(confirm_delete)
}
*/
</script>

<template>
  <div>
    <AutoComplete
    ref="acRef"
      v-model="trackablesModel"
      :suggestions="suggestedTrackables"
      :typeahead="true"
      multiple
      optionLabel="title"
      @complete="search"
      @option-unselect="onUnselect"
      @option-select="onSelect"
      dropdown
      size="normal"
      :loading="loading"
      @remove="handleRemove"
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

    <InputGroup>
      <Button severity="primary" label="Speichern" icon="pi pi-check" @click="onSave"
        :disabled="!isChanged"/>
      <Button severity="danger" label="Verwerfen" icon="pi pi-times" @click="onCancel"
        :disabled="!isChanged"/>
    </InputGroup>
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
