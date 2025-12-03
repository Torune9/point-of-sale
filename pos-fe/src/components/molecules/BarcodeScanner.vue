<template>
    <div class="scanner inset-0 w-full h-full z-50 bg-black/10 fixed flex justify-center items-center" v-if="isActive">
        <div v-if="isLoading" class="absolute">
            <Spinner />
        </div>

        <div id="reader" class="w-[360px] h-[260px]" :class="{
            'opacity-0': isLoading
        }"></div>
        <div class="absolute top-8 right-8" v-if="!isLoading">
            <BaseButton type="button" size="auto" @click="stopScanner">
                <template #title-btn>
                    <Icon icon="heroicons:x-mark-16-solid" class="text-2xl" />
                </template>
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, inject, Ref, nextTick } from 'vue'
import { Html5Qrcode } from "html5-qrcode"
import BaseButton from '../atom/BaseButton.vue'
import Spinner from '../atom/Spinner.vue'
const isActive: Ref = inject('isActive')
const isLoading = ref<boolean>(false)

let html5QrCode = null

async function requestPermission() {
    isLoading.value = true
    try {
        await startScanner()
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const emits = defineEmits<{
    getData: [value: string]
}>()

async function startScanner() {
    isLoading.value = true
    try {
        html5QrCode = new Html5Qrcode("reader")
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 300, height: 200 } },
            (decodedText: string) => {
                emits('getData', decodedText)
                stopScanner()
            },
            (errorMessage: any) => {
                if (!errorMessage.includes("NotFoundException")) {
                    console.warn("Scan error:", errorMessage)
                }
            }
        )
    } catch (error) {
        console.error("Scanner error:", error)
    } finally {
        isLoading.value = false
    }
}

async function stopScanner() {
    isActive.value = false
    if (html5QrCode) {
        try {
            await html5QrCode.stop()
            console.log("Kamera dimatikan")
        } catch (e) {
            console.error("Gagal mematikan kamera", e)
        }
    }
}

watch(isActive, async (val) => {
    if (val) {
        await nextTick()
        await requestPermission()
    }
})

</script>

<style>
.scanner {
    text-align: center;
}
</style>
