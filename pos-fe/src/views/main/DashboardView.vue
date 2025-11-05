<template>
    <div class="h-full grid grid-rows-10 lg:grid-rows-8 grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 rounded-2xl p-4 outline outline-gray-200">
        <div class="flex flex-col justify-evenly col-span-2 lg:row-span-2">
            <h1 class="font-medium text-4xl">Dashboard</h1>
            <p class="text-gray-500">Informasi terkait toko anda</p>
        </div>
        <div class="bg-white shadow outline outline-gray-200 col-span-2 row-span-3 p-4 rounded-2xl lg:col-start-1 lg:row-start-3 lg:row-span-7">
            Sales Overview
        </div>
        <div class="grid grid-cols-2 gap-2 lg:grid-cols-3 max-lg:col-span-2 max-lg:row-span-3 md:col-start-2 md:row-span-6 lg:col-start-3 lg:row-start-1 lg:col-span-2 lg:row-span-3">
            <div class="bg-white shadow outline outline-gray-200 h-full rounded-2xl" v-for="n in 3">

            </div>
        </div>
        <div class="bg-white shadow outline outline-gray-200 row-span-3 md:row-start-5 p-4 rounded-2xl lg:row-start-4 lg:row-span-6">
            Anggota
        </div>
        <div class="bg-white shadow outline outline-gray-200 row-span-3  p-4 rounded-2xl lg:row-span-6">
            Product
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
