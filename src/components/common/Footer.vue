<script setup>
import FooterItem from '@/components/common/FooterItem.vue'
import FooterItemDatabase from '@/components/common/FooterItemDatabase.vue'

const props = defineProps({
  left: { type: Object, default: [], required: false },
  right: { type: Object, default: [], required: false }
})

const itemtypes = {
  'database': FooterItemDatabase
}

function _component(item) {
  console.info("type", typeof item)
  if (typeof item === 'object') {
    return FooterItem;
  }
  if (typeof item === 'string' ) {
    if (item in itemtypes) {
      return itemtypes[item]
    }
    console.warn("unknown type", item)
    return null
  }
  console.warn("unknown type", typeof item)
  return null
}
</script>

<template>
  <div class="flex w-full justify-content-between align-items-center">
    <!-- left -->
    <div>
      <component v-for="item in props.left" :is="_component(item)" :item="item" />
    </div>
    <!-- right -->
    <div>
      <component v-for="item in props.right" :is="_component(item)" :item="item" />
    </div>
  </div>
</template>

<style scoped>
</style>
