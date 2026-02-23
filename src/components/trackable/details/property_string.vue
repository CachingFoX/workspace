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
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
})

const emit = defineEmits(['update','remove'])

const editing = ref(false)
const model = ref('')

async function onEdit() {
  model.value = props.value;
  editing.value = true;
  console.log("refInput.value", refInput.value)
  console.log("refInput.value.$el", refInput.value.$el)
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
</script>

<template>
  <PropertySimple v-show="!editing"
    :value="props.value"
    :placeholder="props.placeholder"
    clipboard
    :editable="props.editable"
    :removable="props.removable"
    @edit="onEdit"
    @remove="onRemove"
  />
  <div v-show="editing">
    <div class="flex" >
      <div class="flex justify-content-center align-items-center" >
        <InputGroup class="p-d-flex p-ai-center ">
          <InputText v-model="model" :placeholder="props.placeholder" size="small" ref="refInput"
          @keydown.esc="editing = false"
          @keydown.enter="onSave"/>
          <Button
            icon="pi pi-check"
            size="small"
            @click="onSave"
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
