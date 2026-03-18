<script setup>
import { computed, onMounted, ref } from 'vue'
import { ownerService } from "@/di/trackables.js"
import { useRouter, useRoute } from 'vue-router';
import CloudWidget from '@/components/dashboard/CloudWidget.vue'

const router = useRouter();

const ready = ref(false);
const results = ref([]);

onMounted(() => {
  ownerService.get_all_owners().then((e)=>{
    e.forEach(element => {
      element.icon = element.owner ? "pi-user" : "pi-times"
      element.owner = element.owner ? element.owner : "not activated"
    });
    results.value = e;
    ready.value = true;
  })
});

function onClick(e) {
  router.push("/owner/"+e.owner)
}
</script>

<template>
  <!-- TODO text und icon für "inactivate" / pi-times-->
  <CloudWidget
    title="Eigentümer"
    title-icon="pi-users"
    title-count
    :items="results"
    :ready="ready"
    label-text="owner"
    label-count="count"
    label-icon="icon"
    clickable
    @select="onClick"
  />
</template>
