<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import FooterItem from '@/components/common/Footer/Item.vue'
import FooterItemApiEnvironment from '@/components/common/Footer/ItemApiEnvironment.vue'
import FooterItemAppVersion from '@/components/common/Footer/ItemAppVersion.vue'
import FooterItemDatabase from '@/components/common/Footer/ItemDatabase.vue'
import FooterItemUser from '@/components/common/Footer/ItemUser.vue'
import { API_ENVIRONMENT, getApiEnvironment } from "@/config/apiConfig"

const props = defineProps({
  left: { type: Object, default: [], required: false },
  right: { type: Object, default: [], required: false }
})

const itemtypes = {
  'database': FooterItemDatabase,
  'environment': FooterItemApiEnvironment
}

function _component(item) {
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

const isProductive = computed(()=>{
  return getApiEnvironment() == API_ENVIRONMENT.PRODUCTIVE
})
</script>

<template>
  <div class="footer-container" :class="{ 'is-not-productive' : !isProductive }" >
    <div class="flex w-full justify-content-between align-items-center">
      <!-- left -->
      <div class="flex gap-3">
        <component v-for="item in props.left" :is="_component(item)" :item="item" />
      </div>
      <!-- right -->
      <div class="flex gap-0">
        <component v-for="item in props.right" :is="_component(item)" :item="item" />
        <FooterItemUser/>
        <FooterItemApiEnvironment/>
        <FooterItemDatabase/>
        <FooterItemAppVersion/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer-container {
  background: #fafafa;
  box-sizing: border-box;
  border-top: 2px solid #eee;
}

.is-not-productive {
  background-color: crimson;
  color: white;
}
</style>
