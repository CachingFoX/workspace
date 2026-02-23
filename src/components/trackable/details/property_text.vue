<script setup>
import { nextTick, computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import Textarea from 'primevue/textarea'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';


const props = defineProps({
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
})

const emit = defineEmits(['update','remove'])

const editing = ref(false)
const model = ref('222')

async function onEdit() {
  model.value = props.value;
  editing.value = true;
  await nextTick()
  refInput.value.$el.focus()
}

function onRemove() {
  editing.value = false;
  emit('remove', props.property)
}

function onSave() {
  // props.value = model.value;
  editing.value = false;
  emit('update', props.property, model.value)
}

const refInput = ref(null)

const isValueAvailable = computed(()=>{
  return props.value != null ? true : false
})
const displayText = computed(()=>{
  return isValueAvailable.value ? props.value : props.placeholder
})

</script>

<template>
  <div v-show="!editing" @click="onEdit">
    <pre class="no-select" :style="{ color: isValueAvailable ? '#000' : '#666' }">{{ displayText }}</pre>
  </div>
  <div v-show="editing">
    <div class="flex flex-column" >
      <div class="flex-grow-1" >
        <Textarea fluid class="w-full" size="small" ref="refInput"
          v-model="model"
          @keydown.esc.prevent="editing = false"
        />
      </div>
      <div class="flex items-center justify-content-between mb-2">
        <ButtonGroup>
          <Button label="Speichern" icon="pi pi-check" severity="" @click="onSave" size="small" :disabled="disableSave"/>
          <Button label="Verwerfen" icon="pi pi-times" severity="danger" size="small" @click="editing = false" />
        </ButtonGroup>
        <ButtonGroup class="">
          <Button label="Löschen" icon="pi pi-trash"  size="small" severity="" @click="onRemove" :disabled="disableSave"/>
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-inputtext {
  font-size: 16px;
}

pre {
  overflow: auto;       /* oder overflow-x: auto */
  white-space: pre-wrap; /* optional: bricht lange Zeilen um */
  max-width: 100%;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid transparent;
    margin: 0;
}
pre:hover {
  border: 1px solid #ddd;
}

Textarea {
  height: 12rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;

}
</style>
