<template>
    <div class="flex flex-col gap-y-2">
        <!-- Pop up -->
        <Transition name="fade">
            <div v-if="isOpen" class="border border-black/20 absolute z-30 bottom-2 bg-white p-2 rounded-2xl">
                <form @submit.prevent="createCategory" class="flex flex-col gap-y-4">
                    <div class="flex flex-row justify-between">
                        <Title tag="h4">Create category</Title>
                        <BaseButton @click.stop="openModal" size="auto" type="button" type-btn="danger">
                            <template #title-btn>
                                <Icon icon="heroicons:x-mark-16-solid" />
                            </template>
                        </BaseButton>
                    </div>
                    <TextInput v-model="categoryName" placeholder="name..." />
                    <BaseButton type="submit" :is-disable="isLoading">
                        <template #title-btn>
                            <span v-if="!isLoading">
                                Submit
                            </span>
                            <div v-else class="flex justify-center items-center">
                                <Spinner size="xs" />
                            </div>
                        </template>
                    </BaseButton>
                </form>
            </div>
        </Transition>
        <div class="flex justify-between items-center">
            <div class="w-1/2">
                <TextInput v-model="search" placeholder="search" />
            </div>
            <div>
                <BaseButton type="button" @click="openModal">
                    <template #title-btn>
                        Create
                    </template>
                </BaseButton>
            </div>
        </div>
        <div>
            <EasyTable table-class-name="customize-table" alternating :headers="header" :items="items"
                :rows-items="[10, 15]" :rows-per-page="10" :search-value="search" :search-field="searchField">
                <template #item-action="item">
                    <div class="inline-flex gap-x-2 p-1">
                        <BaseButton size="auto" type="button" type-btn="info">
                            <template #title-btn>
                                <Icon icon="heroicons:pencil-square-16-solid" />
                            </template>
                        </BaseButton>
                        <BaseButton @click.stop="deleteCategory(item.id)" size="auto" type="button" type-btn="danger">
                            <template #title-btn>
                                <Icon icon="heroicons:trash-16-solid" />
                            </template>
                        </BaseButton>
                    </div>
                </template>
            </EasyTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import Spinner from '@/components/atom/Spinner.vue';
import TextInput from '@/components/atom/TextInput.vue';
import Title from '@/components/atom/Title.vue';
import { categoryStore } from '@/stores/categoryStore';
import { userStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

const storeCategory = categoryStore()
const storeUser = userStore()
const header: Header[] = [
    {
        text: 'Name',
        value: 'name'
    },
    {
        text: 'Action',
        value: 'action'
    }
]
const items: Item = ref<[]>([])

const search = ref<string>('')
const searchField = ref<string>('name')
const categoryName = ref<string>('')

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const openModal = () => {
    isOpen.value = !isOpen.value
    if (!isOpen.value) {
        categoryName.value = ''
    }
}

const getCategories = async () => {
    try {
        const response = await storeCategory.getCategories(storeUser.userBusiness.id)
        items.value = response.result.data
    } catch (error) {
        console.log(error);

    }
}
const createCategory = async () => {
    isLoading.value = true
    try {
        const payload = {
            name: categoryName.value,
            businessId: storeUser.userBusiness.id as string
        }
        const response = await storeCategory.createCategory(payload)

    } finally {
        isOpen.value = false
        isLoading.value = false
        categoryName.value = ''
        getCategories()
    }
}
const deleteCategory = async (productId: string) => {
    try {
        const response = await storeCategory.deleteCategory(storeUser.userBusiness.id, productId)
        console.log(response);

    } finally {
        getCategories()
    }
}
onMounted(() => {
    getCategories()
})
</script>
