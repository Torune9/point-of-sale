<template>
    <BaseLayout>
        <template #header>
            <NavBar/>
        </template>
        <template #content>
            <div class="box-border p-4 flex flex-col gap-y-10">
                <slot/>
            </div>
        </template>
    </BaseLayout>
</template>

<script setup lang="ts">
import NavBar from '@/components/navigation/NavBar.vue';
import BaseLayout from './BaseLayout.vue';
</script>
