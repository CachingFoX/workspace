<script setup>
import Tag from 'primevue/tag';

const props = defineProps({
  itemType: { Type: String, default: null, required: false },
  itemTypeColor: { Type: String, default: "info", required: false },
  itemLabel: { Type: String, default: "???", required: true },
  itemImage: { Type: String, default: "???", required: true },
  itemSublabel: { Type: String, default: null, required: false },
})
</script>

<template>
  <div class="flex align-items-center gap-2 p-0 w-full">
    <div class="flex-grow-0" style="width: 32px; height: 32px;">
      <slot name="left">
        <img :src="props.itemImage" class="rounded-full" style="width: 100%; height: 100%;"/>
      </slot>
    </div>
    <div class="flex-grow-1">
      <slot name="main">
        <div>
          <span class="font-semibold mr-2">{{ props.itemLabel }}</span>
        </div>
        <div v-if="props.itemSublabel">
          <span class="text-sm text-gray-500">{{ props.itemSublabel }}</span>
        </div>
      </slot>
    </div>
    <div class="flex-grow-0">
      <slot name="right">
        <Tag :severity="props.itemTypeColor">{{props.itemType}}</Tag>
      </slot>
    </div>
  </div>
</template>
