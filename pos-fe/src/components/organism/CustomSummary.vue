<template>
    <div class="border-b border-secondary cursor-pointer" @click="toggle">
        <div class="flex justify-between items-center p-2">
            <Title tag="h3">
                {{ title }}
            </Title>
            <Transition name="bounce" mode="out-in">
                <Icon v-if="isOpen" key="minus" :icon="icon" class="w-6 h-6" />
                <Icon v-else key="plus" :icon="icon" class="w-6 h-6" />
            </Transition>

        </div>
        <Transition name="slide">
            <div v-if="isOpen">
                <div class="p-2">
                    <Text>{{ details }}</Text>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import Title from "../atom/Title.vue";
import Text from "../atom/Text.vue";

const props = defineProps<{
    idx: number,
    title: string,
    details: string,
    activeIdx?: number | null
}>()

const emit = defineEmits<{
    (e: 'toggle', idx: number): void
}>()

const isOpen = computed(() => props.activeIdx === props.idx)

const icon = computed(() =>
    isOpen.value ? "heroicons:minus-solid" : "heroicons:plus-solid"
)

const toggle = () => {
    emit('toggle', props.idx)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: height .5s ease;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    height: 0%;
}

.slide-enter-to,
.slide-leave-from {
    height: max-content;
}

.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    
    50%{
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>
