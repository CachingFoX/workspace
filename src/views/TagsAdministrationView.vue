<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import { tagService, useTagsStore } from '@/di/trackables';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import DataView from 'primevue/dataview';
import Badge from 'primevue/badge';
import Select from 'primevue/select';
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const storeTags = useTagsStore();
const router = useRouter();
const route = useRoute()
const toast = useToast();


async function onDelete(tagId, tagName) {
  confirm.require({
    message: `Möchtest du das Tag ${tagName} löschen?`,
    header: 'Löschen',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
        label: 'Abbrechn',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: 'Löschen',
        severity: 'danger',
    },
    accept: async () => {
      try {
        await storeTags.deleteTag(tagId);
        // await storeTrackable.deleteTrackable();
        // router.push('/trackables');
      } catch (error) {
        toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
        console.log(error);
      }
    },
    reject: () => {}
  })
}

onMounted(()=>{
  storeTags.load();
})

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    {label: 'Name aufsteigend', value: 'name', icon: 'pi-sort-alpha-up'},
    {label: 'Name absteigend', value: '!name', icon: 'pi-sort-alpha-down-alt'},
    {label: 'Selten verwendet', value: 'use', icon: 'pi-sort-numeric-up'},
    {label: 'Häufig verwendet', value: '!use', icon: 'pi-sort-numeric-down-alt'},
  ]);
const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }

    storeTags.setSorting(sortField.value, sortOrder.value===1?false:true);
};

function onSave(event) {
  let x = event.target.value;
  toast.add({ severity: 'success', summary: 'Gespeichert', detail: 'Schlagwort wurde gespeichert '+x, life: 3000 });
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <DataView :value="storeTags.tags">
        <template #header>
          <div class="flex align-items-center">
            <div>
              <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sortierung" @change="onSortChange($event)">
                <template #option="slotProps">
                  <div class="flex items-center">
                    <div><span class="pi" :class="slotProps.option.icon"/> {{ slotProps.option.label}}</div>
                  </div>
                </template>
              </Select>
            </div>
            <div class="flex-grow-1"></div>
            <div>
              <InputGroup>
                <InputText placeholder="Schlagwort"/>
                <Button label="Neues Schlagwort" icon="pi pi-plus" severity="primary" ></Button>
              </InputGroup>
            </div>
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-column">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div class="flex px-3 py-2 align-items-center gap-2 line" style="border-bottom: 1px solid #ccc;">
                <div class="pl-0"><span class="pi pi-tag"></span></div>
                <div class="px-1">
                  <Badge :value="item.use" size="large" severity="warn"></Badge>
                </div>
                <div class="flex-grow-1">
                  <span v-show="!item.editing">{{ item.name }}</span>
                  <InputGroup v-show="item.editing">
                    <InputText v-model="item.new_name" size="small"/>
                    <Button icon="pi pi-check" severity="success" size="small" @click="onSave($event); item.editing = false"></Button>
                    <Button icon="pi pi-times" severity="danger" size="small" @click="item.editing = false"></Button>
                  </InputGroup>
                </div>
                <div>
                  <ButtonGroup>
                    <Button icon="pi pi-list" severity="primary" size="small" :disabled="item.use<=0"></Button>
                  </ButtonGroup>
                  <ButtonGroup class="ml-1">
                    <Button icon="pi pi-pencil" severity="primary" size="small" @click="item.editing = !item.editing"></Button>
                    <Button icon="pi pi-trash" severity="danger" size="small" :disabled="item.use>0" @click="onDelete(item.id, item.name)"></Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
            <!--
              <div v-for="(item, index) in slotProps.items" :key="index">
                  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                      <div class="md:w-40 relative">
                          <img class="block xl:block mx-auto rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                          <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px">
                              <Tag :value="item.inventoryStatus" :severity="primary"></Tag>
                          </div>
                      </div>
                      <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                          <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                              <div>
                                  <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                  <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                              </div>
                              <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                  <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                      <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                      <i class="pi pi-star-fill text-yellow-500"></i>
                                  </div>
                              </div>
                          </div>
                          <div class="flex flex-col md:items-end gap-8">
                              <span class="text-xl font-semibold">${{ item.price }}</span>
                              <div class="flex flex-row-reverse md:flex-row gap-2">
                                  <Button icon="pi pi-heart" variant="outlined"></Button>
                                  <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            -->
          </div>
        </template>
      </DataView>
    </template>
    <template v-slot:footer>
      <div class="w-full flex justify-content-between align-items-center align-content-center">
        <div class="">{{ storeTags.tags.length }} Schlagwörter</div>
        <div>
          {{ storeTags.state }}
          <span v-show="storeTags.progress" class="pi pi-spin pi-spinner" style="font-size: 1.0rem"/></div>
      </div>
    </template>
  </BaseLayout>
</template>


<style scoped>
.line:hover {
  background-color: #f5f5f5;
}
</style>
