<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'

import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Inputgroup from 'primevue/inputgroup';

import ShortcutBadge from '@/components/common/ShortcutBadge.vue';


const emits = defineEmits(['change'])

const searchModel = ref('');
const inputfield = ref(null);
const isFocused = ref(false);

function onShortcut(event) {
  if (event == 'META_k_') {
    setFocus();
  }
}

async function setFocus() {
  await nextTick()
  inputfield.value.$el.focus();
}

async function clearFocus() {
  await nextTick()
  inputfield.value.$el.blur();
}

function onEnter(e) {
  if (!searchModel.value?.trim().length) {
    return;
  }
  searchModel.value = "";
  clearFocus()
  emits('change', e.target.value)
}
</script>

<template>
  <IconField @click="setFocus">
    <InputIcon class="pi pi-search" />
    <InputText v-model="searchModel"
      placeholder="Tracking Code"
      ref="inputfield"
      :class="{ 'focused': isFocused }"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter="onEnter"
      @keydown.esc="clearFocus"
    />
    <ShortcutBadge
      :shortcuts="isFocused ? ['ENTER', 'ESC'] : [['META', 'k']]"
      :listen="true"
      @shortcut="onShortcut"
    />
  </IconField>
</template>

<style scoped>
.p-inputtext {
  width: 6rem;
}

.p-inputtext.focused {
  width: 300px;
}
</style>
