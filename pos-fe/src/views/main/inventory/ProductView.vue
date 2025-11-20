<template>
    <div class="h-full">
        <transition name="fade" mode="out-in">
            <div class="flex flex-col gap-y-4" v-if="!isShowElement">
                <div class="flex flex-row justify-between items-center gap-x-4">
                    <div class="lg:w-1/2 w-full">
                        <TextInput placeholder="search" v-model="search" />
                    </div>
                    <BaseButton @click="showForm">
                        <template #title-btn>
                            Create
                        </template>
                    </BaseButton>
                </div>
                <div class="capitalize font-inter font-medium">
                    <EasyTable :headers="headers" :items="items" border-cell alternating table-class-name="customize-table">
                        <template #item-action="item">
                            <div class="flex flex-row gap-2">
                                <BaseButton size="auto" type="button" type-btn="info" @click.stop="setUpdateItem(item)">
                                    <template #title-btn>
                                        <Icon icon="heroicons:pencil-square-16-solid"  class="text-sm"/>
                                    </template>
                                </BaseButton>
                                <BaseButton size="auto" type="button" type-btn="danger">
                                    <template #title-btn>
                                        <Icon icon="heroicons:trash-16-solid" class="text-sm"/>
                                    </template>
                                </BaseButton>
                            </div>
                        </template>
                    </EasyTable>
                </div>
            </div>
            <FormProduct @close="closeForm" :is-update="isUpdate" :update-items="updateItems" v-else />
        </transition>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import TextInput from '@/components/atom/TextInput.vue';
import FormProduct from '@/components/organism/FormProduct.vue';
import { products } from '@/dummy/product';
import { Product } from '@/types/payloads/product';
import { ref } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

const headers = ref<Header[]>([
    {
        text: "SKU",
        value: "sku"
    },
    {
        text: "Name",
        value: "name"
    },
    {
        text: "Price",
        value: "price"
    },
    {
        text: "Category",
        value: "category"
    },
    {
        text: "Date",
        value: "date"
    },
    {
        text: "Stock",
        value: "stock"
    },
    {
        text: "Action",
        value: "action"
    },
])
const items = ref<Item[]>(products)

const search = ref<string>('')
const isShowElement = ref<boolean>(false)
const isUpdate = ref<boolean>(false)
const updateItems = ref<Product>()

const showForm = () => {
    isUpdate.value = false
    isShowElement.value = !isShowElement.value
}

const setUpdateItem = (item: Product) => {
    isUpdate.value = true
    updateItems.value = item
    isShowElement.value = true
}

const closeForm = (data: boolean) => {
    isShowElement.value = data
}
</script>
