<template>
    <div class="flex flex-col gap-y-4 h-full">
        <div class="flex flex-row justify-center">
            <div class="w-full flex flex-row gap-x-2 items-center">
                <button type="button" v-for="(filter, idx) in filters" :key="idx" :aria-selected="activeIdx === idx"
                    @click="selectedFilter(idx)" class="bg-accent text-white hover:bg-secondary cursor-pointer rounded-md transition-all duration-300 w-14 h-max p-1"
                    :class="{
                        'hidden' : activeIdx !== null && activeIdx !== idx,
                        'bg-primary' : activeIdx == idx,
                    }">
                    {{ filter }}
                </button>

            </div>
            <BaseButton type="button">
                <template #title-btn>
                    Create
                </template>
            </BaseButton>
        </div>
        <div class="h-full font-inter font-medium">
            <EasyTable table-class-name="customize-table" :headers="header" :items="item" :rows-per-page="10" :rows-items="[10,15,20]" border-cell alternating>
                <template #item-amount="{amount}">
                    {{ convert.covertToRupiah(amount) }}
                </template>
                <template #item-type="{type}">
                   <span class="block w-8 text-center text-white rounded" :class="{
                    'bg-red-600/80' : type == 'out',
                    'bg-green-600/80' : type == 'in'
                   }">{{ type }}</span>
                </template>
            </EasyTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';

import { ref } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

import { data } from '@/dummy/cashFlow';
import { useConvert } from '@/composables/useConvert';

const filters = ["in", "out"]
const convert = useConvert()

const activeIdx = ref(null)

const header = ref<Header[]>([
    {
        text: "Amount",
        value: "amount"
    },
    {
        text: "Type",
        value: "type"
    },
    {
        text: "Note",
        value: "note"
    },
    {
        text: "Date",
        value: "date"
    },
])

const item = ref<Item[]>(data)

const selectedFilter = (idx: number) => {
    // kalau klik tombol yang sudah aktif → matikan
    if (activeIdx.value === idx) {
        activeIdx.value = null
        return
    }

    // kalau klik tombol lain → jadikan aktif
    activeIdx.value = idx
}

</script>
