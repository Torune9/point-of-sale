<template>
    <div>
        <div @click="toggle">
            <slot name="trigger" />
        </div>
        <Transition name="fade">
            <div v-if="isOpen" class="absolute w-full" :class="positionClass">
                <slot name="content" />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, } from 'vue';
const props = defineProps<{
    position?: 'tr' | 'bl' | 'tl'
}>()

const isOpen = ref<boolean>(false)

const toggle = () => {
    isOpen.value = !isOpen.value    
}

const positionClass = computed<string>(() => {
    switch (props.position) {
        case 'tr':
            return 'right-0 top-0';
        case 'bl':
            return 'left-0 top-full';
        case 'tl':
            return '-top-full right-full';
        default:
            return 'right-0 top-full'
    }
})

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .4s linear;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
