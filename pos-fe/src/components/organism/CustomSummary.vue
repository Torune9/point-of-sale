<template>
    <div class="border-b cursor-pointer" v-for="(data, idx) in datas" :key="idx" @click="toggle(idx)">
        <div class="flex justify-between items-center p-2 transition-colors duration-300"
            :class="activeIdx == idx ? 'bg-secondary text-white' : ''">
            <Title :tag="data[keys[1]]">
                {{ data[keys[0]] }}
            </Title>
            <Transition name="bounce" mode="out-in">
                <Icon v-if="activeIdx === idx" key="minus" icon="heroicons:minus-solid" class="w-6 h-6" />
                <Icon v-else key="plus" icon="heroicons:plus-solid" class="w-6 h-6" />
            </Transition>

        </div>

        <Transition @enter="enter" @leave="leave" appear>
            <div v-if="idx === activeIdx" :key="idx">
                <div class="p-2">
                    <Text>{{ data[keys[2]] }}</Text>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import Title from "../atom/Title.vue";
import Text from "../atom/Text.vue";
import { Summary } from "@/types/Summary";

const props = defineProps<{
    datas: Summary[]
}>()

const listData = computed<Summary[]>(() => props.datas)

const keys = computed<string[]>(() => {
    const first = listData.value?.[0]
    return first ? Object.keys(first) : []
})

const activeIdx = ref<number | null>(null)

const toggle = (idx: number) => {
    activeIdx.value = activeIdx.value == idx ? null : idx
}

const enter = (el: Element) => {
    const node = el as HTMLElement
    node.style.overflow = 'hidden'
    node.style.height = '0px'
    node.style.opacity = '0'
    const height = node.scrollHeight

    requestAnimationFrame(() => {
        node.style.transition = 'height 300ms linear, opacity 300ms linear'
        node.style.height = `${height}px`
        node.style.opacity = '1'
    })

    const cleanup = () => {
        node.style.height = 'auto'
        node.style.overflow = ''
        node.style.transition = ''
        node.removeEventListener('transitionend', cleanup)
    }
    node.addEventListener('transitionend', cleanup)
}

const leave = (el: Element) => {
    const node = el as HTMLElement
    node.style.overflow = 'hidden'
    const height = node.scrollHeight
    node.style.height = `${height}px`
    node.style.opacity = '1'
    void node.offsetHeight

    requestAnimationFrame(() => {
        node.style.transition = 'height 300ms linear, opacity 300ms linear'
        node.style.height = '0px'
        node.style.opacity = '0'
    })

    const cleanup = () => {
        node.style.transition = ''
        node.style.overflow = ''
        node.removeEventListener('transitionend', cleanup)
    }
    node.addEventListener('transitionend', cleanup)
}
</script>

<style scoped>
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

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>
