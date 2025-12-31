<template>
    <header class="sticky top-0">
        <NavBar/>
    </header>
    <main class="wrapper">
        <slot/>
    </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/organism/NavBar.vue';
</script>
