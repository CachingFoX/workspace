<script setup>
import { onMounted, computed, onBeforeMount, ref, watch } from 'vue';
import Panel from 'primevue/panel';
import Button from "primevue/button";
import Badge from 'primevue/badge'
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import { useLocalStorageRef } from '@/utils/localStorageRef'
import { useSafeModel, defineGetterSetter, defineModelGetterSetter } from '@/components/dashboard/interface.js'



const props = defineProps({
  title: { type: String, required: true },
  titleIcon: { type: String, default: false, required: false, },
  icons: { type: Object, required: false, default: ()=>[]},
  editable: { type: Boolean, required: false, default: false},
  badge: { type: Number, required: false, default: 0},
  menu: { type: Object, required: false, default: null }
});

const emit = defineEmits();

const modelEditing = defineModel('editing');
const modelCollapsed = defineModel('collapsed');
const collapsed = defineModelGetterSetter(modelCollapsed, 'collapsed', false, emit)
const editing = defineModelGetterSetter(modelEditing, 'editing', false, emit)
// const localEditing = ref(false);
// const localCollapsed = ref(false);

const menu = ref(null);

const toggle = (event) => {
    menu.value.toggle(event);
};

/*
const editing = computed({
  get() {
    return modelEditing.value ?? localEditing.value
  },
  set(val) {
    localEditing.value = val
    if (modelEditing.value !== undefined) {
      emit('update:editing', val)
    }
  }
})

const collapsed = computed({
  get() {
    console.log("Panle.get")
    return modelCollapsed.value ?? localCollapsed.value
  },
  set(val) {
    console.log("Panle.set")
    localCollapsed.value = val
    if (modelCollapsed.value !== undefined) {
      emit('update:collapsed', val)
    }
  }
})
*/

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

function onToggle(e) {
  //emit("toggle", e);
}

</script>


<template>
  <Panel class="m-2" toggleable v-model:collapsed="collapsed" >
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
