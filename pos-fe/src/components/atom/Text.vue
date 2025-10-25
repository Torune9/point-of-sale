<template>
    <p class="md:text-lg" :class="sizeFontClass">
        <slot />
    </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps < {
    fontSize?: 'md' | 'lg' | 'xl'
} > ()

const sizeFontClass = computed(() => {
    switch (props.fontSize) {
        case 'md':
            return 'text-md';
        case 'lg':
            return 'text-lg';
        case 'xl':
            return 'text-xl';
        default:
            break
    }
})
</script>
