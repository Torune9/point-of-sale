<template>
    <div>
        <BurgerBtn v-if="isMobile" :isOpen="isOpen" @open="openMenu" />

        <Transition name="slide">
            <div v-if="isOpen && isMobile" class="fixed inset-0 z-50 flex">

                <div class="absolute inset-0 bg-black/40 h-screen" @click="closeMenu"></div>

                <div class="relative z-10 w-2/3 max-w-xs h-screen bg-secondary shadow-xl flex flex-col justify-between p-4">
                    <Wrapper class="flex flex-col gap-y-2">
                        <a v-for="item in listDataMenu" :href="item.path"
                            class=" text-white border-b border-b-white/30 hover:bg-primary/30 hover:text-light-accent transition-colors duration-300 p-2">
                            {{ item.name }}
                        </a>
                    </Wrapper>
                    <BaseButton size="full">
                        <template #title-btn>
                            <RouterLink :to="{ name: 'login' }">
                                Login
                            </RouterLink>
                        </template>
                    </BaseButton>
                </div>
            </div>
        </Transition>

        <div v-if="!isMobile" class="flex gap-x-14 items-center">
            <Wrapper class="flex flex-row gap-x-2 text-primary">
                <a v-for="item in listDataMenu" :href="item.path"
                    class="transition-colors duration-300 rounded-full px-4 relative shrink-0 before:content-[''] before:absolute before:w-full before:scale-0 before:h-[1px] before:top-full before:left-0 before:bg-white/80 hover:before:scale-100 before:transition-all before:duration-300">
                    {{ item.name }}
                </a>
            </Wrapper>
            <BaseButton size="sm">
                <template #title-btn>
                    <RouterLink :to="{ name: 'login' }" class="w-full block">
                        Login
                    </RouterLink>
                </template>
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Menu } from '@/types/menu'
import BurgerBtn from '../atom/BurgerBtn.vue'
import Wrapper from '../atom/Wrapper.vue'
import ItemMenu from '@/data/simpleMenu.json'
import { useResize } from '@/composables/useResize'
import BaseButton from '../atom/BaseButton.vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const listDataMenu = ref<Array<Menu>>(ItemMenu)
const { isMobile } = useResize()
const routes = useRoute()
const openMenu = (val: boolean) => {
    isOpen.value = val
}

const closeMenu = () => {
    isOpen.value = false
}

watch(()=> routes.fullPath,(to,from)=>{
    isOpen.value = !(to !== from)
})

watch(isMobile, (val) => {
    if (!val) isOpen.value = false
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0%);
}
</style>
