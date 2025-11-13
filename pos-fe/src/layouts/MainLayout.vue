<template>
    <div class="min-h-screen grid grid-rows-[auto_1fr] lg:grid-cols-[auto_1fr]">

        <header class="p-2 lg:col-start-2 sticky top-0 z-20">
            <div class="flex justify-between items-center p-2 bg-gray-100 rounded-2xl">
                <div class="w-32">
                    <img src="../assets/images/logo.png" alt="image logo" class="invert">
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-14 h-14 border rounded-full">

                    </div>
                    <div>
                        <p class="font-medium">
                            Stephanie Brown
                        </p>
                        <p class="text-xs">
                            stephanie@mail.com
                        </p>
                    </div>
                </div>
            </div>
        </header>

        <aside class="scroll-hidden z-50 h-screen lg:overflow-hidden w-64 fixed bg-gray-100 transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:row-start-1 lg:row-span-2 box-border" :class="isShow ? 'translate-x-0' : '-translate-x-full'">
            <button class="absolute top-1/2 left-full bg-primary text-white rounded-tr rounded-br p-1 lg:hidden" @click="showSideBar">
                <Icon icon="heroicons:arrow-right-20-solid" class="transition-all duration-500" :class="isShow ? 'rotate-y-180' : 'rotate-y-0'"/>
            </button>
            <div class="p-4">
                <h1 class="bg-white font-medium capitalize h-full p-2 rounded-2xl shadow">
                    Hi, Stephanie 😊
                </h1>
            </div>
            <div class="overflow-y-auto p-2 h-full">
                <MultiMenu :menu="listMenu"/>
            </div>
        </aside>
        <Overlay v-if="isShow" @click="showSideBar" class="lg:hidden z-30"/>

        <main class="lg:col-start-2 lg:row-span-2 p-2 ">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import Overlay from '@/components/atom/Overlay.vue';
import MultiMenu from '@/components/molecules/MultiMenu.vue';
import sideMenuList from '@/data/sidebarMenu.json'
import { SubMenu } from '@/types/menu';
import { Ref, ref } from 'vue';

const listMenu : Ref<SubMenu[]> = ref(sideMenuList as SubMenu[])

const isShow: Ref<boolean> = ref(false)
const showSideBar = ()=>{
    isShow.value = !isShow.value
}
</script>

<style scoped>
::-webkit-scrollbar{
    width: 1px;
}

::-webkit-scrollbar-thumb{
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
