<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import Button from 'primevue/button'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';

const router = useRouter();

const props = defineProps({
  value: { type: String, default: null, required: true },
  data: { type: Object, default: null, required: false },
  icon: { type: String, default: null, required: false },
  clipboard: { type: Boolean, default: false, required: false },
  buttons: { type: Object, default: [], required: false },
})

const buttons = ref([]);
const toast = useToast();

onBeforeMount(()=>{
  buttons.value = buttons.value.concat(props.buttons)

  if (props.clipboard) {
    buttons.value.push({ icon: 'pi-copy', command: ()=>{

      navigator.clipboard.writeText(props.value)
        .then(() => {
          toast.add({
            severity: 'info',
            summary: `In die Zwischenablage kopiert`,
            detail: props.value,
            life: 1000,
          });
        })
        .catch(err => {
          toast.add({
            severity: 'danger',
            summary: `Fehler beim Zugriff auf die Zwischenablage`,
            // detail: "props.value",
            life: 2000,
          });
          console.error("Fehler beim Kopieren:", err);
        });
    }})
  }
})

function onClick(item) {
  if (item.command) {
    item.command(props.data);
  }
  if (item.route) {
    router.push(item.route);
  }
  if (item.link) {
    window.open(item.link, "_blank" );
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex justify-content-center align-items-center main" :class="buttons.length ? 'select' : ''" style="height: 32px">
      <div class="flex-shrink-0"><i v-if="props.icon" class="pi pl-2" :class="props.icon"/></div>
      <div class="flex-shrink-1 pl-2 pr-2 no-select no-wrap">{{props.value}}</div>
      <div class="flex-shrink-0">
        <Button v-for="item in buttons"
          :icon="`pi ${item.icon}`"
          :label="item.label"
          :severity="item.severity ?? ''"
          size="small"
          @click="onClick(item)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  border: 1px solid transparent;
  border-radius: 8px;
}
.select:hover {
  border: 1px solid #ddd;
}
.main:hover  {
  visibility: visible;
}
.main Button {
  visibility:hidden;
  border-radius: 0px !important;
}
.main Button:last-child{
  visibility:hidden;
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}
.main Button:first-child{
  margin-left: 4px;
}
.main:hover Button {
  visibility: visible;
}
</style>
