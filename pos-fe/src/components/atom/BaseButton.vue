<template>
    <button :type="type" class="p-2 rounded-full cursor-pointer font-semibold text-white transition-all duration-300"
        :class="[sizeClass, typeClass]">
        <slot name="title-btn" />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'full' | 'auto',
    typeBtn?: 'danger' | 'info' | 'success' | 'cta',
    type?: 'submit' | 'button'
}>()
    , {
        type: 'button'
    })
const sizeClass = computed<string>(() => {
    switch (props.size) {
        case 'sm':
            return 'w-32';
        case 'md':
            return 'w-64';
        case 'lg':
            return 'w-96';
        case 'full':
            return 'w-full';
        case 'auto':
            return 'w-auto'
        default:
            return 'w-40'
    }
})

const typeClass = computed<string>(() => {
    switch (props.typeBtn) {
        case 'danger':
            return 'bg-red-700 hover:bg-red-600';
        case 'info':
            return 'bg-blue-700 hover:bg-blue-600';
        case 'success':
            return 'bg-green-700 hover:bg-green-600';
        case 'cta':
            return 'bg-cta hover:bg-cta/80';
        default:
            return 'bg-primary hover:bg-primary/80'
    }
})

</script>
