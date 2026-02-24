
<script setup>
import { ref, computed, watch, watchEffect, onBeforeMount} from "vue";
import Button from "primevue/button";
import ButtonGroup from 'primevue/buttongroup';
import Inplace from "primevue/inplace";
import InputGroup from 'primevue/inputgroup';
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
import { trackableService } from '@/di/trackables'
import Carousel from 'primevue/carousel';
import PersistentPanel from '@/components/trackable/panel.vue'
import TrackableCard from '@/components/TrackableCard.vue';
import SuggestTrackables from '@/components/trackable/suggesttrackables.vue';
import Tags from "./tags.vue";

const storeTrackable = useTrackableStore();
const confirm = useConfirm();
const editing = ref(false);
const linkedTrackables = ref(null)
const model = ref('')
const property_name = 'linkedTrackables'

watchEffect(async () => {
  linkedTrackables.value = storeTrackable.getPropertyByName(property_name);
})

const trackables = computed(()=>{
  if (!linkedTrackables.value || !linkedTrackables.value.property_value) {
    return []
  }
  let tokens = linkedTrackables.value.property_value.split(' ');
  if (tokens.length == 0) {
    return []
  }

  return tokens;
})

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
</script>


<template>
  <PersistentPanel storage-key="trackable.details.linkedtrackables" title="Verlinkte Trackables" editable
  @editShow="onEdit" :badge="trackables.length"
  v-model:editing="editing"
  >
    <template #editor>
     <InputGroup  class="pb-3 p-d-flex p-ai-center ">
        <Button icon="pi pi-check" label="Save" @click="onSave" :disabled="disableSave"/>
        <Button icon="pi pi-times" label="Cancel" severity="danger" @click="onCancel"/>
        <InputText v-model="model"
          @keydown.enter.prevent="onSave"
          @keydown.esc.prevent="onCancel"
          :autofocus="true"
          placeholder="name"
        />
        <Button icon="pi pi-trash" label="Löschen" severity="danger" :disabled="disableDelete" @click="onDelete"
        />
      </InputGroup>
    </template>

    <SuggestTrackables/>

    <Carousel :value="trackables" :numVisible="3" :numScroll="3" class="w-full">
      <template #item="slotProps">
        <TrackableCard :trackable="slotProps.data"
          trackable-owner="south-west"
          trackable-icon="north-west"
          trackable-number="north-east"
        />
      </template>
    </Carousel>

  </PersistentPanel>
</template>

<style scoped>
</style>
