<template>
    <nav class="fixed h-18 w-full flex flex-row justify-between items-center px-4 bg-white z-50 shadow-md">
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
import { ref } from "vue"
import LandingNavbar from "@/components/molecules/LandingNavbar.vue"
</script>
