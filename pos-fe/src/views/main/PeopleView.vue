<template>
    <div class="flex flex-col gap-y-4">
        <div class="flex flex-row justify-between items-center gap-x-4">
            <div class="lg:w-1/2 w-full">
                <TextInput placeholder="search" v-model="search" class="w-1/2" />
            </div>
            <BaseButton>
                <template #title-btn>
                    Create
                </template>
            </BaseButton>
        </div>
        <div class="capitalize">
            <EasyTable :headers="headers" :items="items">

            </EasyTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atom/BaseButton.vue';
import TextInput from '@/components/atom/TextInput.vue';
import { Header, Item } from 'vue3-easy-data-table';
const search = ref('')

const headers: Header[] = [
    {
        text: "full name",
        value: "name"
    },
    {
        text: "role",
        value: "role"
    },
    {
        text: "action",
        value: "action"
    },
]
const items: Item[] = [{}]


</script>
