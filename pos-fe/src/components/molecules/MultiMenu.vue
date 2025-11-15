<template>
    <Wrapper>
        <Item v-for="(item, i) in props.menu" :key="i"
            class="cursor-pointer select-none capitalize p-1 font-medium" :class="$attrs" @click="">
            <!-- Jika tidak ada submenu, langsung ke router -->
            <RouterLink exact-active-class="bg-secondary/20"  v-if="!item.items" :to="item.path || '#'"
                class="block p-2 hover:bg-secondary hover:text-black/70 transition-colors duration-300 border-b border-secondary/20">
                <span class="flex items-center gap-x-2">
                    <Icon :icon="item.icon" /> {{ item.name }}
                </span>
            </RouterLink>
            <div v-else>

            </div>

            <!-- Jika punya submenu -->
            <div v-if="item.items" class="flex flex-col gap-2">
                <div class="flex justify-between items-center p-2 hover:bg-secondary hover:text-black/70 transition-colors duration-300 border-b border-secondary/20"
                    @click.stop="toggleSubMenu(i)" > 
                    <span class="flex items-center gap-x-2">
                        <Icon :icon="item.icon" /> {{ item.name }}
                    </span>
                    <Icon icon="heroicons:chevron-down" class="transition-transform duration-300"
                        :class="{ 'rotate-180': isOpen(i) }" />
                </div>

                <transition name="fade">
                    <div v-if="isOpen(i)"
                        class="px-6 flex flex-col gap-1 text-sm overflow-hidden font-[500]" :class="$attrs">
                        <RouterLink exact-active-class="bg-secondary/20" v-for="(sub, j) in item.items" :key="j" :to="sub.path || ''"
                            class="p-1.5 hover:bg-secondary   hover:text-black/70 transition-colors duration-200 rounded">
                            {{ sub.name }}
                        </RouterLink>
                    </div>
                </transition>
            </div>
        </Item>
    </Wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Item from '../atom/Item.vue'
import Wrapper from '../atom/Wrapper.vue'
import type { SubMenu } from '@/types/menu'

const props = defineProps<{ menu: SubMenu[] }>()

const openMenus = ref<Map<number, boolean>>(new Map())

const toggleSubMenu = (index: number) => {
    const current = openMenus.value.get(index) || false
    openMenus.value.set(index, !current)
}

const isOpen = (index: number) => openMenus.value.get(index) === true
const activeMenuIdx = ref<number|null>(null)
const selectActiveMenu = (idx:number)=>{
    activeMenuIdx.value = idx
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    height: 0;
}
</style>
