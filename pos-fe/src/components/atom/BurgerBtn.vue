<template>
    <div class="w-8 space-y-1 cursor-pointer lg:hidden" @click="showMenu">
        <span class="block w-full h-1 bg-black"
            :class="[props.isOpen ? 'rotate-45 translate-y-2' : '', 'transition-all duration-300']" />
        <span class="block w-full h-1 bg-black" :class="[props.isOpen ? 'scale-0' : '', 'transition-all duration-300']" />
        <span class="block w-full h-1 bg-black"
            :class="[props.isOpen ? '-rotate-45 -translate-y-2' : '', 'transition-all duration-300']" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    isOpen : boolean
}>()

const emits = defineEmits < {
    open: [isOpen : boolean]
} > ()

const isOpen = ref(false)

const showMenu = () => {
    isOpen.value = !props.isOpen
    emits('open', isOpen.value)
}
</script>
