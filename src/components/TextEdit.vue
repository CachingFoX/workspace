
<script setup>
import { ref, computed, watch } from "vue";
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ButtonGroup from 'primevue/buttongroup';
import Textarea from 'primevue/textarea';
import InputGroup from 'primevue/inputgroup';

// Props
const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Click to edit" },
  textarea: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// States
const editing = ref(false);
const internalValue = ref(props.modelValue?.value);

// Computed für Anzeige
const displayText = computed(() => {
  const val = internalValue.value ?? "";
  return val.trim() !== "" ? val : props.placeholder;
});

const disableSave = computed(() => {
  return (internalValue.value ?? "") == (props.modelValue ?? "")
});

// Start Bearbeitung
const startEditing = () => {
  editing.value = true;
};

// Save: Änderungen propagieren
const save = () => {
  editing.value = false;
  if (internalValue.value != props.modelValue) {
    emit("update:modelValue", internalValue.value);
  }
};

// Cancel: Alte Daten wiederherstellen
const cancel = () => {
  internalValue.value = props.modelValue ?? "";
  editing.value = false;
};


// Watch: externe Änderungen
watch(
  () => props.modelValue,
  (newVal) => {
    if (!editing.value) {
      internalValue.value = newVal ?? "";
    }
  },
  { immediate: true }
);
</script>


<template>
  <Inplace v-model:active="editing">
    <!-- Anzeige-Modus -->
    <template #display>
      <span @click="startEditing" class="text-display" style="white-space: pre-line; ">
        {{ displayText }}
      </span>
      <span class="ml-1 pi pi-pencil"></span>
    </template>

    <!-- Bearbeitungsmodus -->
    <template #content>
      <div v-if="textarea" class="w-full px-2">
        <Textarea fluid class="w-full" size="small"
          v-model="internalValue"
          @keydown.esc.prevent="cancel"
          :autofocus="true"
        />
        <ButtonGroup class="flex items-center justify-content-end">
          <Button label="Save" icon="pi pi-check" severity="" @click="save" :disabled="disableSave"/>
          <Button label="Cancel" icon="pi pi-times" severity="danger" @click="cancel" />
        </ButtonGroup>
      </div>
      <InputGroup v-else class="px-2 p-d-flex p-ai-center ">
        <InputText
          v-model="internalValue"
          @keydown.enter.prevent="save"
          @keydown.esc.prevent="cancel"
          :autofocus="true"
        />
        <Button icon="pi pi-check" label="Save" @click="save" :disabled="disableSave"
        />
        <Button
          icon="pi pi-times"
          label="Cancel"
          severity="danger"
          @click="cancel"
        />
      </InputGroup>
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
