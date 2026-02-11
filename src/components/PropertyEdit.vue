
<script setup>
import { ref, computed, watch, watchEffect} from "vue";
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ButtonGroup from 'primevue/buttongroup';
import Textarea from 'primevue/textarea';
import InputGroup from 'primevue/inputgroup';
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
import { trackableService } from '@/di/trackables'


const storeTrackable = useTrackableStore();
const confirm = useConfirm();

// Props
const props = defineProps({
  placeholder: { type: String, default: "Click to edit" },
  trackable_property: { type: Object, default: null },
});

const type = computed(() => {
  return props.trackable_property.property_type ?? "unknown type"
});

function get_input_type(x) {
  return x.includes(':') ? x.split(':')[0] : x;
}
function get_output_type(x) {
  return x.includes(':') ? x.split(':')[1] : x;
}

const type_input = computed(() => {
  return get_input_type(props.trackable_property.property_type) ?? "type undefined"
});
const type_output = computed(() => {
  return get_output_type(props.trackable_property.property_type) ?? "type undefined"
});


const name = computed(() => {
  return props.trackable_property.property_name ?? "unknown2"
});
const originalValue = computed(() => {
  return props.trackable_property.property_value
});
const disableDelete = computed(() => {
  return props.trackable_property.id === null;
});


// States
const editing = ref(false);
const model = ref(originalValue.value);

// Computed für Anzeige
const displayText = computed(() => {
  if (originalValue.value == null) {
    return props.placeholder
  }
  return originalValue.value?.trim() !== "" ? originalValue.value : props.placeholder
});

const noContent = computed(() => {
  return (originalValue.value == null) || (originalValue.value?.trim() === "")
});


const disableSave = computed(() => {
  return (model.value ?? "") == (originalValue.value ?? "")
});

// Start Bearbeitung
const startEditing = () => {
  editing.value = true;
};

// Save: Änderungen propagieren
const save = () => {
  editing.value = false;
  if (model.value != originalValue.value) {
    if (props.trackable_property.id) {
      storeTrackable.updateProperty(props.trackable_property.id, model.value);
    } else {
      storeTrackable.newProperty(props.trackable_property.property_id, model.value);
    }
  }
};

// Cancel: Alte Daten wiederherstellen
const cancel = () => {
  model.value = originalValue.value ?? "";
  editing.value = false;
};


// Watch: externe Änderungen
/*
watch(
  () => props.value,
  (newVal) => {
    // if (!editing.value) {
      model.value = newVal ?? "";
    // }
  },
  { immediate: true }
);
*/

async function onDelete() {
  confirm.require({
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
        await storeTrackable.deleteProperty(props.trackable_property.id);
        editing.value = false;
      } catch (error) {
        console.log(error);
      }
    },
    reject: () => {}
  })
}

const tokens = computed(()=>{
  if (originalValue.value == null) return []
  return originalValue.value.split(' ');
})

const trackables = ref([])

watchEffect(async () => {
  if (type_output.value != "tbcodes") {
    return []
  }
  if (tokens.value.length == 0 ) {
    return []
  }

  tokens.value.forEach(element => {
    let x = trackableService.getTrackableByNumber(element).then((trackable)=>{
      trackables.value.push(trackable);
    });
  });
})
</script>


<template>
  <Inplace v-model:active="editing">
    <!-- Anzeige-Modus -->
    <template #display>
      <div v-if="noContent" >
        <span @click="startEditing" class="text-display" style="white-space: pre-line; ">{{ props.placeholder }}</span>
        <span class="ml-2 pi pi-pencil"></span>
      </div>
      <div v-else @click="startEditing">
        <div v-if="type_output == 'text'" @click="startEditing">
          <pre>{{originalValue}}</pre>
        </div>
        <div v-else-if="type_output == 'string'" >
          {{originalValue}}
        </div>
        <div v-else>
          Unsupported type: {{ type_output }} / {{ type }}
        </div>
      </div>

    </template>

    <!-- Bearbeitungsmodus -->
    <template #content>
      <div v-if="type_input == 'text'" class="w-full px-2">
        <Textarea fluid class="w-full" size="small"
          v-model="model"
          @keydown.esc.prevent="cancel"
          :autofocus="true"
        />
        <ButtonGroup class="flex items-center justify-content-end">
          <Button label="Save" icon="pi pi-check" severity="" @click="save" :disabled="disableSave"/>
          <Button label="Cancel" icon="pi pi-times" severity="danger" @click="cancel" />
        </ButtonGroup>
      </div>
      <InputGroup v-else-if="type_input == 'string'" class="px-2 p-d-flex p-ai-center ">
        <Button icon="pi pi-check" label="Save" @click="save" :disabled="disableSave"
        />
        <Button
          icon="pi pi-times"
          label="Cancel"
          severity="danger"
          @click="cancel"
        />
        <InputText
          v-model="model"
          @keydown.enter.prevent="save"
          @keydown.esc.prevent="cancel"
          :autofocus="true"
          :placeholder="name"
        />
        <Button
          icon="pi pi-trash"
          label="Löschen"
          severity="danger"
          :disabled="disableDelete"
          @click="onDelete"
        />
      </InputGroup>
      <div v-else>
        Unsupported type: {{ type_input }} / {{ type }}
      </div>
    </template>
  </Inplace>
</template>

<style scoped>
.p-inplace>div {
  width: 100%;
}
.p-d-flex {
  display: flex;
}
.p-ai-center {
  align-items: center;
}
.p-gap-2 {
  gap: 0.5rem;
}
.text-display {
  cursor: pointer;
  user-select: none;
}
textarea {
  height: 12rem;
}
</style>
