<script setup>
import { nextTick, computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import IconField from 'primevue/iconfield';
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton';
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';


const props = defineProps({
  buttons: { type: Object, default: [], required: false },
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
  labelFalse: { type: String, default: "no", required: false },
  labelTrue: { type: String, default: "yes", required: false },
})

const emit = defineEmits(['update','remove'])

const buttons = ref([]);
const editing = ref(false)
const model = ref(false)

async function onEdit() {
  editing.value = true;
}

function onRemove() {
  model.value = null;
  emit('remove', props.property)
}

function onUpdate() {
  editing.value = false;
  emit('update', props.property, model.value)
}

function onCancel() {
  model.value = props.value;
  editing.value = false;
}

const options = ref([
    { name: props.labelFalse, value: "false" },
    { name: props.labelTrue,  value: "true" },
]);


const isEditing = computed(()=>{return editing.value})
const isNotEditing = computed(()=>{return !editing.value})

function onClick(item) {
  if (item.command) {
    item.command(props.property);
  }
  if (item.route) {
    router.push(item.route);
  }
  if (item.link) {
    window.open(item.link, "_blank" );
  }
}

const styleClickCatcher = computed(()=>{
  let cursor = ''
  /*
  if (!model.value?.length) {
    cursor = 'text'
  //} else if (isHyperlink.value) {
  //  cursor = 'pointer'
  } else {
    cursor = 'default'
  }
*/
  return {'cursor' : cursor}
});

onBeforeMount(()=>{
  model.value = props.property.property_value;

  if (props.buttons?.length) {
    buttons.value = buttons.value.concat(props.buttons)
  }

  if (props.editable) {
    buttons.value.push({ icon: 'pi-pencil', command: onEdit, show: isNotEditing })
    buttons.value.push({ icon: 'pi-check', command: onUpdate, show: isEditing })
    buttons.value.push({ icon: 'pi-times', severity: 'danger', command: onCancel, show: isEditing })
  }
  if (props.removable ) {
    buttons.value.push({ icon: 'pi-trash', severity: 'danger', command: onRemove, show: isEditing }    )
  }
})
</script>

<template>
  <InputGroup :class="{ 'edit-mode' : editing }">
    <IconField class="w-full">
      <SelectButton v-model="model" :options="options" optionLabel="name" optionValue="value" :disabled="!editing" class="w-full"/>
      <div class="double-click-catcher"
          @dblclick.prevent="onEdit"
          @click="onClickCatcher"
          :style="styleClickCatcher"
          v-if="!editing && props.editable"/>
    </IconField>
      <template v-for="item in buttons">
        <Button
          v-if="item?.show == undefined ? true : item.show"
          :icon="`pi ${item.icon}`"
          :label="item.label"
          :severity="item.severity ?? ''"
          :disabled="item.enabled == undefined ? false : !item.enabled"
          @click.prevent="onClick(item)"
        />
      </template>
  </InputGroup>
</template>

<style scoped>
.edit-mode {
  border: 1px solid #888;
  border-color: var(--p-inputtext-hover-border-color);
  border-radius: 5px;
}
.double-click-catcher {
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background-color: transparent;
  z-index: 900;
}
</style>
