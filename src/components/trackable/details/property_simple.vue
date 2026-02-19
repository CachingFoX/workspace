<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import Button from 'primevue/button'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  value: { type: String, default: null, required: true },
  icon: { type: String, default: null, required: true },
  clipboard: { type: Boolean, default: false, required: false },
  buttons: { type: Object, default: [], required: false },
})

const buttons = ref([]);

onBeforeMount(()=>{
  buttons.value = buttons.value.concat(props.buttons)

  if (props.clipboard) {
    buttons.value.push({ icon: 'pi-copy', command: ()=>{
      console.log("Clipboard", props.clipboard)
    }})
  }
})

function onClick(item) {
  if (item.command) {
    item.command();
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
    <div class="flex-grow-0" >
      <div class="flex justify-content-center align-items-center main" :class="buttons.length ? 'select' : ''" style="height: 33px">
        <i v-if="props.icon" class="pi pl-2" :class="props.icon"/>
        <span class="pl-2 pr-2 no-select">{{props.value}}</span>
        <Button v-for="item in buttons"
          :icon="`pi ${item.icon}`"
          :label="item.label"
          size="small"
          @click="onClick(item)"
        />
      </div>
    </div>
    <div class="flex-grow-1"></div>
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
