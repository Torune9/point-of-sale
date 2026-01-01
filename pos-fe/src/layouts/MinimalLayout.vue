<template>
    <header class="sticky top-0">
        <NavBar/>
    </header>
    <main class="wrapper">
        <slot/>
    </main>
    <footer class="px-8 text-center py-8 font-semibold text-black/60">
        © ENTRYPOS 2026 - All rights reserved
    </footer>
</template>

<script setup lang="ts">
import NavBar from '@/components/organism/NavBar.vue';
</script>
