<script setup>
import { FormFieldClasses } from '@primevue/forms'
import { computed, nextTick, ref, onBeforeMount, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue'

const emit = defineEmits(['shortcut'])

const props = defineProps({
  'shortcuts': { Type: Object, default: [], required: true},
  'listen': { Type: Boolean, default: FormFieldClasses, required: false}
})

/*
  shortcuts=""
  :shortcuts="[]"

  shortcuts="K"
  :shortcuts="K"
  :shortcuts="['K']"
  :shortcuts="['ESC', ['CTRL','C'], ['CTRL','V']]"

  note: :shortcuts="['CTRL','C']" => 2 shortcuts: CTRL and C
*/
const shortcuts = computed(()=>{
  if (!props.shortcuts?.length) {
    return []
  }

  if (typeof props.shortcuts == 'string') { // simple on key
    return [props.shortcuts]
  }

  if (typeof props.shortcuts == 'object') {
    return props.shortcuts.map( shortcut => {
      if (typeof shortcut == 'string') {
        return [shortcut]
      }
      if (typeof shortcut == 'object') {
        return shortcut
      }
      console.error('ShortcutBadge: shortcut - unknown input data type', typeof props.shortcuts, "value", props.shortcuts)
      return ['???']
    })
  }

  console.error('ShortcutBadge: shortcuts - unknown input data type:', typeof props.shortcuts, "value", props.shortcuts)
  return ['???']
})

function formatKey(_key) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  let key = _key.trim().toUpperCase();
  if (key == 'META') {
    return isMac ? '⌘' : '🗔' /* U+1F5D4 / windows desktop */
  }
  return key;
}

function onKeyDown(event) {
  shortcuts.value.forEach(shortcut => {
    let valid = true
    let shortcut_string = ""
    shortcut.forEach(key => {
      if (key == 'META') {
        valid = valid && event.metaKey
        shortcut_string += "META_"
      } else if (key == 'CTRL') {
        valid = valid && event.ctrlKey
        shortcut_string += "CTRL_"
      } else if (key == event.key) {
        valid = valid
        shortcut_string += event.key + "_"
      } else {
        valid = false
      }
    })

    if (valid) {
      event.preventDefault();
      emit('shortcut', shortcut_string)
    }
  })
}

watchEffect(()=>{
  if (props.listen) {
    window.addEventListener('keydown', onKeyDown)
  } else {
    window.removeEventListener('keydown', onKeyDown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="shortcut-badge-container">
    <template  v-for="(shortcut, shortcutIndex) in shortcuts" :key="shortcutIndex">
     <span class="mr-2" />
      <template v-for="(key, keyIndex) in shortcut" :key="keyIndex">
        <span v-if="keyIndex" class="shortcut-badge no-key shortcut-badge">+</span>
        <span class="shortcut-badge key shortcut-badge-key">{{ formatKey(key) }}</span>
      </template>
    </template>
  </div>
</template>

<style scoped>
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
  padding: 2px 2px;
  background-color: transparent;
}

.shortcut-badge.key {
  border-radius: 4px;
  border: 1px solid #ccc;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}
</style>
