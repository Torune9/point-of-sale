<template>
    <div class="h-screen grid grid-rows-[auto_1fr] lg:grid-cols-[auto_1fr]">

        <header class="p-2 lg:col-start-2 sticky top-0">
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

        <aside class="h-screen w-64 fixed bg-gray-100 transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:row-start-1 lg:row-span-2" :class="isShow ? 'translate-x-0' : '-translate-x-full'">
            <button class="absolute top-1/2 left-full bg-gray-200 p-1 lg:hidden" @click="showSideBar">
                show
            </button>
        </aside>

        <main class="lg:col-start-2 lg:row-span-2 p-2 ">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const isShow: Ref<boolean> = ref(false)
const showSideBar = ()=>{
    isShow.value = !isShow.value
}
</script>
