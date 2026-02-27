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

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const shortcutDisplay = computed(() => (isMac ? '⌘' : 'Ctrl'))
</script>

<template>
  <div class="w-full">
    <InputGroup>
        <IconField>
          <InputIcon class="pi" :class="props.icon" v-if="props.icon"/>
          <InputText class="w-full" ref="refInput"
            v-model="model"
            :disabled="isNotEditing"
            :placeholder="props.placeholder"
            @keydown.esc="onCancel"
            @keydown.enter="onUpdate"
            />
          <div class="shortcut-badge-container">
            <span class="shortcut-badge key shortcut-badge-key mr-1" v-show="isEditing">Enter</span>
            <span class="shortcut-badge key shortcut-badge-key" v-show="isEditing">ESC</span>
            <!--
            <span class="shortcut-badge key shortcut-badge-key">{{ shortcutDisplay }}</span>
            <span class="shortcut-badge no-key shortcut-badge">+</span>
            <span class="shortcut-badge key shortcut-badge-key">K</span>
            -->
          </div>
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

    <!--
    <div class="flex">
      <div class="flex justify-content-center align-items-center display"
        :class="{'select': buttons.length }" style="height: 32px">
        <div class="flex-shrink-0"><i v-if="props.icon" class="pi pl-2" :class="props.icon"/></div>
        <div class="flex-shrink-1 pl-2 pr-2 no-select no-wrap" @click="onEdit"
        :style="{ color: isValueAvailable ? '#000' : '#666' }">
          {{displayText}}
        </div>
        <div class="flex-shrink-0">
          <Button v-if="!editing" v-for="item in buttons"
            :icon="`pi ${item.icon}`"
            :label="item.label"
            :severity="item.severity ?? ''"
            :disabled="item.enabled == undefined ? false : !item.enabled"
            size="small"
            @click="onClick(item)"
          />
        </div>
      </div>
    </div>-->
  </div>
</template>

<style scoped>
:deep(.p-inputtext:disabled) {
  background-color: transparent;
  color: hsl(0, 0%, 40%);
  opacity: 1;
  /*
  border-color: transparent;
  box-shadow: none;
  */
  user-select: none;
  pointer-events: none;
}



.display {
  border: 1px solid transparent;
  border-radius: 8px;
}
.display Button {
  visibility:hidden;
}
.display:hover Button {
  visibility:visible;
}
.display:focus-within {
  border: 2px solid blue;
}

Button {
  border-radius: 0px !important;
}
Button:last-child {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}


/* ------------ */

.select:hover {
  border: 1px solid #ddd;
}


.shortcut-badge-container {
  position: absolute;
  right: 0.5rem; /* Abstand zum rechten Rand */
  top: 45%;
  transform: translateY(-50%);
  z-index: 900;
}

.shortcut-badge {
  color: #333;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
  font-family: monospace;
  user-select: none;
  pointer-events: none;
  background-color: #ffffff;
}

.shortcut-badge.no-key{
  padding: 2px 3px;
}

.shortcut-badge.key {
  border-radius: 4px;
  border: 1px solid #ccc;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}

</style>
