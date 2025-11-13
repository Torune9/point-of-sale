<template>
    <!-- Headline -->
    <section class="flex flex-col lg:flex-row gap-x-16 content">
        <div class="flex flex-col gap-y-8 justify-center items-center sm:h-screen py-8 sm:py-0">
            <div class="w-full flex flex-col gap-y-8  lg:text-start">
                <h1 class="text-5xl lg:text-6xl">
                    Kelola Penjualan & Stok Lebih Mudah dengan EntryPOS
                </h1>
                <h2>
                    Solusi kasir sederhana untuk bisnis yang sedang tumbuh.EntryPOS membantu Anda mencata transaksi,
                    memantau stok, dan melihat laporan semua dalam satu dashboard yang mudah digunakan.
                </h2>
            </div>
            <div class="lg:w-full">
                <BaseButton typeBtn="cta">
                    <template #title-btn>
                        Pakai sekarang
                    </template>
                </BaseButton>
            </div>
        </div>
        <div class="w-full flex justify-center items-center max-lg:hidden">
            <div class=" rounded overflow-hidden h-[90%]">
                <img src="../assets/images/hero.jpg" alt="orang sedang memegang struk di depan mesin kasir"
                    class="h-full w-full object-cover">
            </div>
        </div>
    </section>
    <!-- Content -->
    <section class="flex flex-col gap-y-4 content">
        <Title tag="h1">
            Tentang Kami
        </Title>
        <div>
            <Text>
                EntryPOS adalah sistem Point of Sale yang dirancang untuk membantu pelaku usaha mengelola penjualan,
                stok, dan laporan dengan cara yang sederhana namun efisien. Kami percaya setiap bisnis, sekecil apa pun,
                berhak memiliki alat yang mudah digunakan untuk berkembang. EntryPOS dibuat dengan fokus pada kemudahan,
                kecepatan, dan keandalan agar Anda dapat menjalankan bisnis tanpa hambatan teknis.
            </Text>
        </div>
    </section>
    <!-- Fitur -->
    <section class="flex flex-col gap-y-4 content">
        <Title tag="h1">
            Fitur
        </Title>
        <div class="flex flex-col gap-y-2">
            <CustomSummary :datas="listFeature" />
        </div>
    </section>

</template>

<script setup lang="ts">

import Text from '@/components/atom/Text.vue';
import Title from '@/components/atom/Title.vue';

import CustomSummary from '@/components/organism/CustomSummary.vue';

import featureList from "@/data/feature.json"
import { onMounted, onUpdated, ref, Ref } from 'vue';

import { Summary } from "@/types/summary";
import BaseButton from '@/components/atom/BaseButton.vue';

const listFeature: Ref = ref<Summary[]>([])

onMounted(() => {
    listFeature.value = featureList
})

</script>
