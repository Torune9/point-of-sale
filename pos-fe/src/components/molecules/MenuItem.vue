<template>
    <Item v-for="(item,idx) in items" :key="idx" v-bind="$attrs">
        <RouterLink :to="`${item.path}`" class="font-medium w-full block p-2">
            {{ item.name }}
        </RouterLink>
    </Item>
</template>

<script setup lang="ts">
import { Menu } from '@/types/menu';
import Item from '../atom/Item.vue';

const props = defineProps<{
    items : Array<Menu>
}>()
</script>
