<script setup>
import { onMounted, computed, onBeforeMount, ref, watch } from 'vue';
import Panel from 'primevue/panel';
import Button from "primevue/button";
import Badge from 'primevue/badge'
import Divider from 'primevue/divider';

const props = defineProps({
  title: { type: String, required: true },
  titleIcon: { type: String, default: false, required: false, },
  storageKey: { type: String, required: false, default: 'panel' },
  icons: { type: Object, required: false, default: ()=>[]},
  editable: { type: Boolean, required: false, default: false},
  badge: { type: Number, required: false, default: 0},
});

const collapsed = ref(false);
// const editing = ref(false);
const model = defineModel('editing');
const localEditing = ref(false);
const emit = defineEmits('editShow', 'editHide')

const editing = computed({
  get() {
    return model.value ?? localEditing.value
  },
  set(val) {
    if (model.value !== undefined) {
      // model.value = val      // controlled
      emit('update:editing', val)
    } else {
      localEditing.value = val // uncontrolled
    }
    emit(val ? 'editShow' : 'editHide')
  }
})

const storage_key = computed(()=>{
  return `${props.storageKey}.panel.collapsed`.replace(/\s+/g, '').toLowerCase();
})

watch(
    () => collapsed.value,
    (newValue) => { localStorage.setItem(storage_key.value, newValue); }
);

watch(
    () => props.badge,
    (newValue) => { props.badge = newValue; }
);


function onEdit() {
  if (collapsed.value) {
    collapsed.value = false;
    editing.value = true;
  } else {
    editing.value = !editing.value;
  }
}

onBeforeMount(()=>{
  if (props.editable) {
    props.icons.push({
      'icon': 'pi pi-pencil',
      'action': onEdit
    })
  }

  try {
    collapsed.value = localStorage.getItem(storage_key.value) === 'true';
  } catch(error) {
    console.log("Panel: localStorage.getItem(",storage_key.value,") fails", error);
    collapsed.value = false;
  }
})
</script>


<template>
  <Panel class="m-2" toggleable v-model:collapsed="collapsed">
    <template #header>
      <slot name="header">
        <div class="font-bold text-xl" style="flex-grow: 0" @click="collapsed = !collapsed">
          <span class="pi mr-1 text-xl font-bold" :class="props.titleIcon" v-if="props.titleIcon"/>
          <span class="font-bold text-xl" style="color: var(--p-surface-500)">{{ props.title }}</span>
        </div>
        <div class="font-bold text-xl ml-1" style="flex-grow: 1" @click="collapsed = !collapsed">
          <Badge v-if="props.badge" :value="props.badge" severity="success"></Badge>
        </div>
      </slot>
    </template>
    <template #icons>
      <Button v-for="item in props.icons" :icon="item.icon" severity="secondary" rounded text @click="item.action" />
    </template>
    <Divider class="m-0 p-0 mb-4"/>
    <slot name="default"/>
    <slot name="editor" v-if="editing"/>
  </Panel>
</template>
