<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center bg-black/10" v-if="isShowConfirm">
        <div class="bg-white rounded-lg shadow-md p-4 w-96">
            <Title tag="h2">Are you sure ?</Title>
            <div class="py-8 mt-2 border-t border-t-black/20 max-h-24 overflow-y-auto w-full">
                <h2 class="break-words">{{ message }}</h2>
            </div>
            <div class="flex justify-end gap-x-4">
                <BaseButton @click="close" type-btn="danger" type="button">
                    <template #title-btn>
                        close
                    </template>
                </BaseButton>
                <BaseButton @click="confirm" type-btn="info" type="button">
                    <template #title-btn>
                        confirm
                    </template>
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue';
import Title from './Title.vue';

const props = defineProps<{
    isShowConfirm: boolean,
    message: string
}>()

const emits = defineEmits<{
    confirm: [],
    close: [close: boolean]
}>()

const close = () => {
    emits('close', false)
}

const confirm = () => {
    close()
    emits('confirm')
}
</script>
