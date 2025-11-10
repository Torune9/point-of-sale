<template>
    <nav class="h-18 w-full flex flex-row justify-between items-center px-8 bg-white z-50 transition-all duration-300"
        :class="isHidden ? '-translate-y-full' : 'translate-y-0'">
        <div>
            <div class="w-36">
                <img :src="logo" alt="navbar logo image" class="w-full h-full object-cover invert">
            </div>
        </div>
        <LandingNavbar/>
    </nav>
</template>

<script setup>
import logo from "@/assets/images/logo.png"
import LandingNavbar from "@/components/molecules/LandingNavbar.vue"

import { ref, onMounted, onUnmounted } from "vue"

const isHidden = ref(false)
let lastScroll = 0

const handleScroll = () => {
    const currentScroll = window.scrollY
    if (window.innerWidth >= 768) {
        if (currentScroll > lastScroll && currentScroll > 60) {
            isHidden.value = true
        } else {
            isHidden.value = false
        }
        lastScroll = currentScroll
    } else {
        isHidden.value = false
    }
}

onMounted(() => {
    window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
})
</script>
