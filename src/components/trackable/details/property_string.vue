<script setup>
import { nextTick, computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';


const props = defineProps({
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  icon: { type: String, default: null, required: false },
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
  format: { type: String, default: 'none', required: false,
    validator: (val) => ['uppercase', 'lowercase', 'none'].includes(val),
  },
  buttons: { type: Object, default: [], required: false },
})

const emit = defineEmits(['update','remove'])

const editing = ref(false)
const model = ref('')

async function onEdit() {
  model.value = formattedValue.value;
  editing.value = true;
  await nextTick() // wait before set the focus
  refInput.value.$el.focus()
}

function onRemove() {
  editing.value = false;
  emit('remove', props.property)
}

function formatString(text, format) {
  switch (format) {
    case 'uppercase':
      return text?.toUpperCase()
    case 'lowercase':
      return text?.toLowerCase()
    case 'none':
      return text
    default:
      console.warn('PropertyString: unknown format:', format )
      return text
  }
}
const formattedModelValue = computed(() => {
  return formatString(model.value, props.format)
})
const formattedValue = computed(() => {
  return formatString(props.value, props.format)
})

function onUpdate() {
  editing.value = false;
  emit('update', props.property, formattedModelValue.value)
}

let buttons = [];

onBeforeMount(()=>{
  buttons = buttons.concat(props.buttons)
})

const refInput = ref(null)
</script>

<template>
  <PropertySimple v-show="!editing"
    :value="formattedValue"
    :placeholder="props.placeholder"
    clipboard
    :editable="props.editable"
    :removable="props.removable"
    :buttons="buttons"
    :icon="props.icon"
    @edit="onEdit"
    @remove="onRemove"
  />
  <div v-show="editing">
    <div class="flex" >
      <div class="flex justify-content-center align-items-center" >
        <InputGroup class="p-d-flex p-ai-center ">
          <InputText v-model="model" :placeholder="props.placeholder" size="small" ref="refInput"
          @keydown.esc="editing = false"
          @keydown.enter="onUpdate"/>
          <Button
            icon="pi pi-check"
            size="small"
            @click="onUpdate"
          />
          <Button
            icon="pi pi-times"
            size="small"
            severity="danger"
            @click="editing = false"
          />
        </InputGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-inputtext {
  font-size: 16px;
}
</style>
