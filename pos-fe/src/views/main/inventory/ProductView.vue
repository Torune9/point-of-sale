<template>
    <div class="h-full">
        <Overlay class="flex justify-center items-center z-50" v-if="overlayLoading">
            <Spinner />
        </Overlay>
        <transition name="fade" mode="out-in">
            <!-- product filter -->
            <div class="flex flex-col gap-y-4 relative" v-if="!isShowElement">
                <div class="grid grid-cols-3 max-lg:grid-cols-3 gap-2 items-end">
                    <TextInput placeholder="search" v-model="search" />
                    <div class="text-end lg:order-3">
                        <BaseButton @click="showForm" class="self-end">
                            <template #title-btn>
                                Create
                            </template>
                        </BaseButton>
                    </div>
                    <select name="category" id="category"
                        class="border border-black/20 p-2 rounded-md focus:outline-0 max-md:col-span-2 cursor-pointer lg:order-2 hover:outline bg-white"
                        v-model="selectedCategory">
                        <option value="" disabled>Choose Category</option>
                        <option v-for="(category, i) in categories" :value="category.id">
                            {{ category.name }}
                        </option>
                        <option value="">All</option>
                    </select>
                </div>
                <div class="absolute border w-full h-full bg-white z-50" @click="() => {
                    isBarcode = false
                    barcodeSrc = ''
                }" v-if="isBarcode">
                    <div>
                        <img :src="barcodeSrc" alt="">
                    </div>
                </div>
                <!-- product table -->
                <div class="capitalize font-inter font-medium">
                    <EasyTable :headers="headers" :items="items" border-cell alternating :rows-per-page="10"
                        :rows-items="[10, 15]" table-class-name="customize-table" @click-row="clickRow"
                        :loading="isLoading" :search-field="searchField" :search-value="search">
                        <template #item-action="item">
                            <div class="flex flex-row gap-2">
                                <BaseButton size="auto" type="button" type-btn="info" @click.stop="setUpdateItem(item)">
                                    <template #title-btn>
                                        <Icon icon="heroicons:pencil-square-16-solid" class="text-sm" />
                                    </template>
                                </BaseButton>
                                <BaseButton size="auto" type="button" type-btn="danger"
                                    @click.stop="deleteProduct(item.id)">
                                    <template #title-btn>
                                        <Icon icon="heroicons:trash-16-solid" class="text-sm" />
                                    </template>
                                </BaseButton>
                            </div>
                        </template>
                        <template #item-updatedAt="{ updatedAt }">
                            {{ convert.convertToLocalDate(updatedAt) }}
                        </template>
                        <template #loading>
                            <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                                style="width: 100px; height: 80px;" />
                        </template>
                        <template #item-price="{ price }">
                            <span>{{ convert.covertToRupiah(price) }}</span>
                        </template>
                    </EasyTable>
                </div>
            </div>
            <FormProduct @close="closeForm" :is-update="isUpdate" :update-items="updateItems" @updated="getProducts" v-else />
        </transition>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import Overlay from '@/components/atom/Overlay.vue';
import Spinner from '@/components/atom/Spinner.vue';
import TextInput from '@/components/atom/TextInput.vue';
import FormProduct from '@/components/organism/FormProduct.vue';
import { useConvert } from '@/composables/useConvert';
import { notify } from '@/helper/toastifyHelper';
import { categoryStore } from '@/stores/categoryStore';
import { productStore } from '@/stores/productStore';
import { userStore } from '@/stores/userStore';
import { Category } from '@/types/category';
import { UpdateItems } from '@/types/payloads/product';
import { onMounted, provide, ref, watch, watchEffect } from 'vue';
import { ClickRowArgument, Header, Item } from 'vue3-easy-data-table';
// composable
const convert = useConvert()
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
        value: "category.name"
    },
    {
        text: "Date",
        value: "updatedAt"
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
const items = ref<Item[]>([])
// store
const storeProduct = productStore()
const storeUser = userStore()
const storeCategory = categoryStore()
// state
const search = ref<string>('')
const isShowElement = ref<boolean>(false)
const isUpdate = ref<boolean>(false)
const updateItems = ref<UpdateItems | null>(null)
const isLoading = ref<boolean>(false)
const overlayLoading = ref<boolean>(false)
const isBarcode = ref<boolean>(false)
const barcodeSrc = ref<string>('')
const searchField = ref("name");
const categories = ref<Category[] | null>(null)
const selectedCategory = ref<string>('')
provide('categories', categories)
// function
const showForm = () => {
    isUpdate.value = false
    isShowElement.value = !isShowElement.value
    updateItems.value = null
}

const setUpdateItem = (item: UpdateItems) => {
    isUpdate.value = true
    updateItems.value = item
    isShowElement.value = true
}

const closeForm = (data: boolean, isLoad: boolean) => {
    isShowElement.value = data
    if (isLoad) {
        getProducts()
    }

}

const getProducts = async () => {
    isLoading.value = true
    try {
        const response = await storeProduct.getProduct(storeUser.userBusiness.id, selectedCategory.value)

        items.value = response.result.data

    } catch (error) {
        console.log(error);
        notify.error("error when getting products")
    } finally {
        isLoading.value = false
    }
}

const deleteProduct = async (productId: string) => {
    overlayLoading.value = true
    try {
        await storeProduct.deleteProduct(storeUser.userBusiness.id, productId)
    } finally {
        await getProducts()
        overlayLoading.value = false
    }
}

const clickRow = (item: ClickRowArgument) => {
    if (item.barcode) {
        barcodeSrc.value = item.barcode
    }
}

const getCategories = async () => {
    try {
        const response = await storeCategory.getCategories(storeUser.userBusiness.id)
        categories.value = response.result.data
    } catch (error) {
        console.log(error);
    }
}

// lifecycle
watch(search, (val) => {
    search.value = val.replace(/[^A-Za-z0-9 ]/g, '')
})
watchEffect(() => isBarcode.value = !!barcodeSrc.value)
watch(selectedCategory, async (val: string) => {
    await getProducts()
})

onMounted(async () => {
    await Promise.all([
        getCategories(),
        getProducts()
    ])
})



</script>
