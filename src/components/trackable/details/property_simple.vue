<script setup>
import { computed,ref, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ShortcutBadge from '@/components/common/ShortcutBadge.vue';

const router = useRouter();
const toast = useToast();

const props = defineProps({
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  icon: { type: String, default: null, required: false },
  clipboard: { type: Boolean, default: false, required: false },
  buttons: { type: Object, default: [], required: false },
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
  format: { type: String, default: 'none', required: false,
    validator: (val) => ['uppercase', 'lowercase', 'none'].includes(val),
  },
})

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


const buttons = ref([]);
const model = ref(formattedValue.value);
const refInput = ref(null);

const isValueAvailable = computed(()=>{
  return formattedValue.value != null ? true : false
})

function onCopyToClipboard() {
  if (!isValueAvailable.value) {
    return
  }
  navigator.clipboard.writeText(formattedValue.value)
    .then(() => {
      toast.add({
        severity: 'info',
        summary: `In die Zwischenablage kopiert`,
        detail: formattedValue.value,
        life: 1000,
      });
    })
    .catch(err => {
      toast.add({
        severity: 'danger',
        summary: `Fehler beim Zugriff auf die Zwischenablage`,
        detail: formattedValue.value,
        life: 2000,
      });
      console.error("Fehler beim Kopieren:", err);
    });
}

const emit = defineEmits(['update','remove'])

const editing = ref(false)
const focus = ref(false)

async function onEdit() {
  editing.value = true;
  await nextTick() // wait before set the focus
  refInput.value.$el.focus()
}

function onCancel() {
  editing.value = false;
  model.value = formattedValue.value
}

function onUpdate() {
  editing.value = false;
  emit('update', props.property, formattedModelValue.value)
  model.value = formattedModelValue.value;
}

function onRemove() {
  emit('remove', props.property)
}

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

const isEditing = computed(()=>{return editing.value})
const isNotEditing = computed(()=>{return !editing.value})

onBeforeMount(()=>{
  buttons.value = buttons.value.concat(props.buttons)
  if (props.editable) {
    buttons.value.push({ icon: 'pi-pencil', command: onEdit, show: isNotEditing })
    buttons.value.push({ icon: 'pi-check', command: onUpdate, show: isEditing })
    buttons.value.push({ icon: 'pi-times', severity: 'danger', command: onCancel, show: isEditing })
  }
  if (props.removable ) {
    buttons.value.push({ icon: 'pi-trash', severity: 'danger', command: onRemove, show: isEditing }    )
  }
  if (props.clipboard) {
    buttons.value.push({ icon: 'pi-copy', command: onCopyToClipboard, enabled: isValueAvailable, show: isNotEditing  } )
  }
})

onBeforeMount(() => {
  model.value = formattedValue.value;
})
</script>

<template>
  <div class="w-full" style="position:relative;">
    <InputGroup>
      <IconField>
        <InputIcon class="pi" :class="props.icon" v-if="props.icon"/>
        <InputText class="w-full" ref="refInput"
          v-model="model"
          :disabled="isNotEditing"
          :placeholder="props.placeholder"
          @keydown.esc="onCancel"
          @keydown.enter="onUpdate"
          @focus="focus = true" @blur="focus = false"
          />
        <div class="double-click-catcher" @dblclick.prevent="onEdit" v-if="!editing && props.editable"/>
        <ShortcutBadge v-show="isEditing & focus" :shortcuts="['Enter','ESC']" />
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

  </div>
</template>

<style scoped>
:deep(.p-inputtext:disabled) {
  background-color: transparent;
  color: hsl(0, 0%, 40%);
  opacity: 1;

  border-color: transparent;
  box-shadow: none;

  user-select: none;
  pointer-events: none;
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
