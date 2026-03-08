<script setup>
import { computed, nextTick, ref, onBeforeMount, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue'

const emit = defineEmits(['shortcut'])

const props = defineProps({
  'shortcuts': { Type: Object, default: [], required: true},
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
  console.log(event)
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
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div/>
  <!-- shortcut -->
</template>
