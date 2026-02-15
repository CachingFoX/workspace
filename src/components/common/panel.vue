<script setup>
import { onMounted, computed, onBeforeMount, ref, watch } from 'vue';
import Panel from 'primevue/panel';
import Button from "primevue/button";
import Badge from 'primevue/badge'
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import { useLocalStorageRef } from '@/utils/localStorageRef'

const props = defineProps({
  title: { type: String, required: true },
  titleIcon: { type: String, default: false, required: false, },
  storageKey: { type: String, required: false, default: 'panel' },
  icons: { type: Object, required: false, default: ()=>[]},
  editable: { type: Boolean, required: false, default: false},
  badge: { type: Number, required: false, default: 0},
  menu: { type: Object, required: false, default: null }
});

const storage_key = computed(()=>{
  return `${props.storageKey}.panel.collapsed`.replace(/\s+/g, '').toLowerCase();
})

const collapsed = useLocalStorageRef(storage_key.value, false);

const model = defineModel('editing');
const emit = defineEmits('editShow', 'editHide')

const localEditing = ref(false);
const menu = ref(null);

const toggle = (event) => {
    menu.value.toggle(event);
};


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
})
</script>


<template>
  <Panel class="m-2" toggleable v-model:collapsed="collapsed">
    <template #header>
      <slot name="header">
        <div class="flex align-items-center gap-2 flex-nowrap font-bold text-xl" style="flex-wrap: nowrap; align-items: center;" @click="collapsed = !collapsed">
          <div style="flex-grow: 0" v-if="props.titleIcon">
            <span class="text-lg pi" :class="props.titleIcon"/>
          </div>
          <div style="flex-grow: 0">
            <span class="font-bold text-xl" style="color: var(--p-surface-500)">{{ props.title }}</span>
          </div>
          <Badge v-if="props.badge" :value="props.badge" severity="success"/>
        </div>
      </slot>
    </template>
    <template #icons>
      <Button v-for="item in props.icons" :icon="item.icon" severity="secondary" rounded text @click="item.action" />
      <Button icon="pi pi-bars" severity="secondary" rounded text @click="toggle" v-if="props.menu"/>
      <Menu ref="menu" id="config_menu" :model="props.menu" popup />
    </template>
    <Divider class="m-0 p-0 mb-4"/>
    <slot name="default"/>
    <slot name="editor" v-if="editing"/>
  </Panel>
</template>
