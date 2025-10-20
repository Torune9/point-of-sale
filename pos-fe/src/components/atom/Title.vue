<template>
    <component :is="props.tag" :class="dynamicClass" class="font-medium font-roboto">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    tag: 'h1' | 'h2' | 'h3' | 'h4'
}>();

const dynamicClass = computed<string>(() => {
    switch (props.tag) {
        case 'h1':
            return 'text-3xl lg:text-4xl';
        case 'h2':
            return 'text-2xl lg:text-3xl';
        default:
            return 'text-xl';
    }
});
</script>
