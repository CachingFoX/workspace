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
    results.value = e;
    ready.value = true;
  })
});

function onClick(e) {
  router.push("/owner/"+e.owner)
}
</script>

<template>
  <CloudWidget
    title="Eigentümer"
    title-icon="pi-users"
    badge
    :items="results"
    :ready="ready"
    text-label="owner"
    badge-label="count"
    icon="pi-user"
    clickable
    empty-text="not activated"
    empty-icon="pi-times"
    @select="onClick"
  />
</template>
