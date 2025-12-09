<template>
    <div>
       <div class="inline-flex gap-x-4 justify-between items-center w-full">
        <div>
            filter
        </div>
        <BaseButton>
            <template #title-btn>
                Add
            </template>
        </BaseButton>
       </div>
       <div class="capitalize">
            <EasyTable :headers="headers" :items="items" alternating border-cell table-class-name="customize-table">
                
            </EasyTable>
       </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import { ref } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

 
const headers = ref<Header[]>([
    {
        text : "invoice",
        value : "invoice"
    },
    {
        text : "total amount",
        value : "totalAmount"
    },
    {
        text : "paid mount",
        value : "paidMount"
    },
    {
        text : "change mount",
        value : "changeMount"
    },
])

const items = ref<Item[]>([{

}])
</script>

