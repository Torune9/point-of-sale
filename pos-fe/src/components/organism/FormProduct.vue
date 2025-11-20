<template>
    <div class="flex flex-col gap-y-4 h-full justify-center max-lg:px-8">
        <div class="flex justify-between">
            <Title tag="h1">
                <span>{{ isUpdate ? 'Update' : 'Create' }}</span>
                <span>&nbsp;Product</span>
            </Title>
            <div>
                <BaseButton size="auto" type="button" type-btn="info" @click="$emit('close', false)">
                    <template #title-btn>
                        <Icon icon="heroicons:x-mark-16-solid" />
                    </template>
                </BaseButton>
            </div>
        </div>
        <form @submit.prevent="submit" class="flex flex-col gap-y-2">
            <TextInput label="name" v-model="formData.name" />
            <TextInput label="price" type="number" v-model="formData.price" />
            <TextInput label="stock" type="number" v-model="formData.stock" />
            <div class="flex flex-col gap-y-2 lg:w-1/2 ">
                <label for="category">Category</label>
                <select name="category" id="category" v-model="formData.category"
                    class="p-2 rounded-lg border border-black/50 focus:outline-primary hover:outline-1 hover:outline-accent transition-all duration-500">
                    <option value="hero">hero</option>
                </select>
            </div>
            <div class="inline-flex justify-end">
                <div class="w-full md:w-48">
                    <BaseButton size="full" type="submit">
                        <template #title-btn>
                            Submit
                        </template>
                    </BaseButton>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, watchEffect } from 'vue';
import BaseButton from '../atom/BaseButton.vue';
import TextInput from '../atom/TextInput.vue';
import Title from '../atom/Title.vue';
import { Product } from '@/types/payloads/product';

const props = withDefaults(defineProps<{
    isUpdate?: boolean,
    updateItems?: Product
}>(), {
    isUpdate: false
})

const emits = defineEmits<{
    close: [isShowEl: boolean]
}>()

const formData = reactive({
    name: '',
    stock: '',
    price: '',
    category: 'hero'
})

const submit = async () => {
    try {
        emits('close', false)
    } catch (error) {

    }
}
watchEffect(() => {
    if (props.isUpdate) {
        console.log(props.isUpdate);

        Object.assign(formData, {
            name: props.updateItems.name,
            category: props.updateItems.category,
            price: Number(props.updateItems.price),
            stock: Number(props.updateItems.stock),
        })
    }
})


</script>
