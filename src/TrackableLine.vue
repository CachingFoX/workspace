

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

function handleTagClick(tag) {
  // Hier kannst du z.B. ein Event emitten oder eine Navigation auslösen
  console.log('Tag clicked:', tag)
}

function handleCollectionClick(collection) {
  // Hier kannst du z.B. ein Event emitten oder eine Navigation auslösen
  console.log('Collection clicked:', collection)
}

</script>

<template>
  <div class="trackable-line">
    <div style="flex: 0 0 32px; display: flex; align-items: center; margin-right: 10px; margin-left: 10px;"><img :src="item.iconURL" /></div>
    <div style="flex: 1 1 auto; display: flex; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 2px; width: 100%;">
        <div>{{ item.name }}</div>
        <div style="font-size: 0.8em; color: gray;">{{ item.originName }}</div>
        <div v-if="item.tags.length > 0" style="font-size: 0.8em; color: gray;">
            Stichworte:
            <span v-for="(col, idx) in item.tags" :key="col">
              <a href="#" style="color: inherit; text-decoration: underline;"
              @click.prevent="handleCollectionClick(col); $emit('selectTag', col)"
              >{{ col }}</a><span v-if="idx < item.tags.length - 1">, </span>
            </span>
        </div>
        <div v-if="item.collections.length > 0" style="font-size: 0.8em; color: gray;">
          Sammlung:
          <span v-for="(col, idx) in item.collections" :key="col">
            <a
              href="#"
              style="color: inherit; text-decoration: underline; cursor: pointer;"
              @click.prevent="handleCollectionClick(col); $emit('selectCollection', col)"
            >{{ col }}</a><span v-if="idx < item.collections.length - 1">, </span>  </span>
        </div>
        <div style="font-size: 0.8em; color: gray;">
          {{ item.note }}
        </div>
      </div>
    </div>
    <div style="flex: 0 0 64px; display: flex; align-items: center;"></div>
    <div style="flex: 0 0 100px; display: flex; align-items: center;"></div>
    <div style="flex: 0 0 100px; display: flex; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 2px; width: 100%;">
        <div v-if="item.privateCode" style="text-align: center;">
          <template v-if="item.activateCode">
            🔑 <a :href="'https://www.geocaching.com/track/Activate.aspx?trknum='+item.privateCode+'&activationCode='+item.activateCode"
            target="_blank" rel="noopener noreferrer"
            >{{ item.privateCode }}</a>
          </template>
          <template v-else>
            🔒 <a :href="'https://www.geocaching.com/track/details.aspx?tracker='+item.privateCode"
            target="_blank" rel="noopener noreferrer"
            >{{ item.privateCode }}</a>
          </template>

        </div>
        <div  v-if="item.publicCode" style="text-align: center;">
          🌍 <a :href="'https://www.geocaching.com/track/details.aspx?tracker='+item.publicCode"
            target="_blank" rel="noopener noreferrer"
            >{{ item.publicCode }}</a>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
.trackable-line {
  border-bottom: 1px solid #eee;
  display: flex;
  margin-bottom: 4px;
  margin-right: 0px;
  margin-left: 0px;
  padding: 8px 0px;
  width: 100%;
  transition: background 0.2s;
  width: 100%;
}
.trackable-line:hover {
  background: #f5f5f5;
}
</style>
