<script setup lang="ts">
import { ref, computed } from 'vue'
import Item from '../atom/Item.vue'
import Wrapper from '../atom/Wrapper.vue'
import type { SubMenu } from '@/types/Menu'

const props = defineProps<{ menu: SubMenu[] }>()

const openMenus = ref<Map<number, boolean>>(new Map())

const toggleSubMenu = (index: number) => {
    const current = openMenus.value.get(index) || false
    console.log(current);

    openMenus.value.set(index, !current)
}

const isOpen = (index: number) => openMenus.value.get(index) === true
</script>

<template>
    <Wrapper>
        <Item v-for="(item, i) in props.menu" :key="i"
            class="cursor-pointer select-none capitalize p-1 font-medium text-black/80" @click="toggleSubMenu(i)">

            <RouterLink v-if="!item.items" :to="'#'"
                class="block p-2 rounded hover:bg-gray-300 hover:text-black/90 transition-colors duration-300">
                <span class="flex items-center gap-x-2">
                    <Icon :icon="item.icon"/>{{ item.name }}
                </span>
            </RouterLink>

            <div v-else class="">
                <div class="flex justify-between items-center p-2 rounded hover:bg-gray-300 hover:text-black/90 transition-colors duration-300">
                    <span class="flex items-center gap-x-2">
                        <Icon :icon="item.icon"/>{{ item.name }}
                    </span>
                    <Icon icon="heroicons:chevron-down" class="transition-transform duration-300"
                        :class="{ 'rotate-180': isOpen(i) }" />
                </div>

                <transition name="fade">
                    <div v-if="isOpen(i)" class="px-6 flex flex-col gap-1 text-sm text-black/80 overflow-hidden font-normal">
                        <RouterLink v-for="(sub, j) in item.items" :key="j" to="#" class="p-1.5 hover:bg-gray-300 transition-colors duration-200 rounded">
                            {{ sub.name }}
                        </RouterLink>
                    </div>
                </transition>
            </div>
        </Item>
    </Wrapper>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: .5s;
}

.fade-enter-from,
.fade-leave-to {
    height: 0;
}
</style>
