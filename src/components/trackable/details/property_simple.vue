<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';

const router = useRouter();

const props = defineProps({
  value: { type: [String, Number, null], default: null, required: true },
  placeholder: { type: String, default: null, required: false },
  icon: { type: String, default: null, required: false },
  clipboard: { type: Boolean, default: false, required: false },
  buttons: { type: Object, default: [], required: false },
  property: { type: Object, default: null, required: false },
  editable: { type: Boolean, default: false, required: false },
  removable: { type: Boolean, default: false, required: false },
})

const buttons = ref([]);
const toast = useToast();

const isValueAvailable = computed(()=>{
  return props.value != null ? true : false
})
const displayText = computed(()=>{
  return isValueAvailable.value ? props.value : props.placeholder
})

function onCopyToClipboard() {
  if (!isValueAvailable.value) {
    return
  }
  navigator.clipboard.writeText(props.value)
    .then(() => {
      toast.add({
        severity: 'info',
        summary: `In die Zwischenablage kopiert`,
        detail: props.value,
        life: 1000,
      });
    })
    .catch(err => {
      toast.add({
        severity: 'danger',
        summary: `Fehler beim Zugriff auf die Zwischenablage`,
        detail: props.value,
        life: 2000,
      });
      console.error("Fehler beim Kopieren:", err);
    });
}

const emit = defineEmits(['edit','remove'])

const editing = ref(false)

function onEdit() {
  emit('edit')
}
function onRemove() {
  emit('remove')
}

function onClick(item) {
  if (item.command) {
    item.command(props.data);
  }
  if (item.route) {
    router.push(item.route);
  }
  if (item.link) {
    window.open(item.link, "_blank" );
  }
}
onBeforeMount(()=>{
  buttons.value = buttons.value.concat(props.buttons)
  if (props.editable) {
    buttons.value.push({ icon: 'pi-pencil', command: onEdit })
  }
  if (props.removable ) {
    buttons.value.push({ icon: 'pi-trash', severity: 'danger', command: onRemove }    )
  }
  if (props.clipboard) {
    buttons.value.push({ icon: 'pi-copy', command: onCopyToClipboard, enabled: isValueAvailable  } )
  }
})

onMounted(() => {
})
</script>

<template>
  <div>
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
    </div>
  </div>
</template>

<style scoped>
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
</style>
