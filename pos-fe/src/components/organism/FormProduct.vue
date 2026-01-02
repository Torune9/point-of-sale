<template>
    <div class="flex flex-col gap-y-4 h-full justify-center px-8">
        <div class="flex justify-between">
            <Title tag="h1">
                <span>{{ isUpdate ? 'Update' : 'Create' }}</span>
                <span>&nbsp;Product</span>
            </Title>
            <div>
                <BaseButton size="auto" type="button" type-btn="info" @click="closeForm(false)">
                    <template #title-btn>
                        <Icon icon="heroicons:x-mark-16-solid" />
                    </template>
                </BaseButton>
            </div>
        </div>
        <div class="flex flex-row justify-between gap-8 max-lg:flex-col">
            <form @submit.prevent="submit" class="flex flex-col gap-y-2 w-full">
                <TextInput :disabled="loading.generate || loading.submit" label="name" v-model="formData.name" />
                <TextInput :disabled="loading.generate || loading.submit" label="price" v-model="displayPrice" />
                <TextInput :disabled="loading.generate || loading.submit" label="stock" type="number" v-model="formData.stock" />
                <div class="flex flex-col gap-y-2 lg:w-1/2 ">
                    <label for="category">Category</label>
                    <select name="category" id="category"
                        class="border border-black/20 p-2 rounded-md focus:outline-0 cursor-pointer"
                        v-model="formData.categoryId">
                        <option value="" disabled>Choose Category</option>
                        <option v-for="(category, i) in categories" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="w-full md:w-48">
                    <BaseButton :disabled="loading.submit" size="full" type="submit">
                        <template #title-btn>
                            <span v-if="!loading.submit">Submit</span>
                            <div v-else class="flex justify-center items-center">
                                <Spinner size="xs" />
                            </div>
                        </template>
                    </BaseButton>
                </div>
            </form>
            <div class="flex flex-col gap-y-4 justify-center items-center">
                <div v-if="updateItems && updateItems?.barcode || newBarcode" class="flex flex-col gap-y-4">
                    <h1 class="bg-primary text-white px-2 p-1 rounded-md w-max">Product Qrcode</h1>
                    <div class="w-72 h-72 border rounded-md overflow-hidden">
                        <img :src="updateItems.barcode ?? newBarcode" alt="" class="object-cover h-full w-full">
                    </div>
                    <BaseButton type="button" size="sm" type-btn="info">
                        <template #title-btn>
                            Print
                        </template>
                    </BaseButton>
                </div>
                <BaseButton :disabled="loading.generate" v-if="isUpdate && !updateItems.barcode && !newBarcode" @click="generateBarcode"
                    type="button" size="md" type-btn="info">
                    <template #title-btn>
                        <span v-if="!loading.generate">Generate Qrcode</span>
                        <div v-else class="flex justify-center items-center">
                            <Spinner size="xs" />
                        </div>
                    </template>
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import BaseButton from '../atom/BaseButton.vue';
import TextInput from '../atom/TextInput.vue';
import Title from '../atom/Title.vue';
import { UpdateItems } from '@/types/payloads/product';
import { Category } from '@/types/category';
import { productStore } from '@/stores/productStore';
import { userStore } from '@/stores/userStore';
import Spinner from '../atom/Spinner.vue';
const categories: Category[] = inject('categories')

const props = withDefaults(defineProps<{
    isUpdate?: boolean,
    updateItems?: UpdateItems
}>(), {
    isUpdate: false
})

const storeProduct = productStore()
const storeUser = userStore()
const emits = defineEmits<{
    close: [isShowEl: boolean, isLoad?: boolean],
    updated: [isUpdated : boolean]
}>()

const formData = reactive({
    name: '',
    stock: 0,
    price: 0,
    categoryId: ''
})
const newBarcode = ref<string>('')
const loading = reactive({
    submit: false,
    generate: false
})


const generateBarcode = async () => {
    loading.generate = true
    try {
        const response = await storeProduct.generateBarcode(props.updateItems.businessId, props.updateItems.id)
        newBarcode.value = response.result.data

    } finally {
        loading.generate = false
        emits('updated',true)
    }
}

const closeForm = (isShowEl: boolean, isLoad?: boolean) => emits('close', isShowEl, isLoad)

const submit = async () => {
    loading.submit = true
    try {
        if (props.isUpdate) {
            await storeProduct.updateProduct(formData, storeUser.userBusiness.id, props.updateItems.id)
        } else {
            await storeProduct.createProduct({
                ...formData,
                businessId: storeUser.userBusiness.id
            })
        }
        closeForm(false, true)
    } catch (error) {
        console.log(error);
    }
    finally {
        loading.submit = false
    }
}

const displayPrice = ref('')

watch(displayPrice, (val) => {

    let onlyNumber = val.replace(/\D/g, '')
    formData.price = Number(onlyNumber)

    displayPrice.value = formData.price.toLocaleString('id-ID')
})

onMounted(() => {
    if (props.isUpdate && props.updateItems) {
        const category = props.updateItems.category;

        formData.price = Number(props.updateItems.price)
        displayPrice.value = formData.price.toLocaleString('id-ID')

        formData.name = props.updateItems.name
        formData.categoryId = category?.id
        formData.stock = Number(props.updateItems.stock)
    }
})


</script>
