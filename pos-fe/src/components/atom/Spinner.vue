<template>
    <div class="border-black/50  rounded-full animate-spin" :class="[selectedSize, selectedFillColors]">
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg',
    fillColors?: 'red' | 'green' | 'cyan' | 'yellow' | 'blue'
}>(), {
    size: 'sm',
    fillColors: 'red'
})

const selectedSize = computed<string>(() => {
    const classNeeded = {
        xs: 'h-6 w-6 border-4',
        sm: 'h-12 w-12 border-8',
        md: 'h-14 w-14 border-9',
        lg: 'h-16 w-16 border-10',
    }

    return classNeeded[props.size]
})

const selectedFillColors = computed<string>(() => {
    const classNeeded = {
        red: 'border-b-red-600',
        green: 'border-b-green-500',
        blue: 'border-b-blue-500',
        cyan: 'border-b-cyan-500',
        yellow: 'border-b-yellow-500',
    }

    return classNeeded[props.fillColors]
})

</script>
