<template>
    <div class="h-full flex flex-col gap-y-10 justify-center items-center relative">
        <Title tag="h1" class="text-center">
            You don't have a business yet, please create an instance
        </Title>
        <BaseButton type="button" type-btn="cta" @click="showOrHideModal">
            <template #title-btn>
                <p class="p-1">Create</p>
            </template>
        </BaseButton>
        <Transition name="fade">
            <Overlay class="inset-0 z-50 flex justify-center items-center backdrop-blur-lg" v-if="isShow">
                <button>
                    close
                </button>
                <form action="#" class="absolute rounded-2xl bg-white flex flex-col gap-y-4 p-4 w-3/4 sm:w-2/4 lg:w-2/6">
                    <div class="flex flex-row justify-between">
                        <Title tag="h4">
                            Create Business
                        </Title>
                        <BaseButton size="auto" type="button" type-btn="danger" @click="showOrHideModal">
                            <template #title-btn>
                                <Icon icon="heroicons:x-mark-16-solid"/>
                            </template>
                        </BaseButton>
                    </div>
                    <TextInput v-model="name" placeholder="business name"/>
                    <div class="">
                        <BaseButton type="submit" size="sm">
                            <template #title-btn>
                                Submit
                            </template>
                        </BaseButton>
                    </div>
                </form>
            </Overlay>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '../atom/TextInput.vue';
import Title from '../atom/Title.vue';
import Overlay from '../atom/Overlay.vue';
import BaseButton from '../atom/BaseButton.vue';

const isShow = ref<boolean>(false)

const showOrHideModal = ()=>{
    isShow.value = !isShow.value
}


const name = ref<string>('')
</script>
