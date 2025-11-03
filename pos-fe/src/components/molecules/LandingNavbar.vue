<template>
    <div>
        <BurgerBtn v-if="isMobile" :isOpen="isOpen" @open="openMenu" />

        <Transition name="slide">
            <div v-if="isOpen && isMobile" class="fixed inset-0 z-50 flex">

                <div class="absolute inset-0 bg-black/40" @click="closeMenu"></div>

                <div class="relative z-10 w-2/3 max-w-xs h-full bg-white shadow-xl flex flex-col justify-between p-4">
                    <Wrapper class="flex flex-col gap-y-2">
                        <MenuItem :items="listDataMenu"
                            class="border-b border-b-black/30 hover:bg-secondary hover:text-light-accent transition-colors duration-300 px-2">
                        </MenuItem>
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
            <Wrapper class="flex flex-row gap-x-2">
                <MenuItem :items="listDataMenu"
                    class="transition-colors duration-300 rounded-full px-4 relative shrink-0 before:content-[''] before:absolute before:w-full before:scale-0 before:h-[1px] before:top-full before:left-0 before:bg-black hover:before:scale-100 before:transition-all before:duration-300">
                </MenuItem>
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
import { Menu } from '@/types/Menu'
import BurgerBtn from '../atom/BurgerBtn.vue'
import MenuItem from './MenuItem.vue'
import Wrapper from '../atom/Wrapper.vue'
import ItemMenu from '@/data/simpleMenu.json'
import { useResize } from '@/composables/useResize'
import BaseButton from '../atom/BaseButton.vue'

const isOpen = ref(false)
const listDataMenu = ref<Array<Menu>>(ItemMenu)
const { isMobile } = useResize()

const openMenu = (val: boolean) => {
    isOpen.value = val
}

const closeMenu = () => {
    isOpen.value = false
}

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
