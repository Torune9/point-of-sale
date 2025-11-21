<template>
    <div class="h-full grid max-sm:grid-rows-10 max-lg:grid-rows-8 sm:grid-cols-4 lg:grid-flow-row gap-2 [&>*]:p-2 [&>*]:rounded-2xl [&>*]:bg-gray-100">
        <div class="h-fit sm:h-full sm:col-span-2">
            <h1 class="font-medium text-2xl">Dashboard</h1>
            <p>Informasi terkait toko anda</p>
        </div>
        <div class="row-span-3 sm:row-span-3 sm:col-span-4 lg:row-start-2 lg:col-start-1 lg:col-span-2 lg:row-span-7">
            Sales Overview
        </div>
        <div
            class="row-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:row-start-4 sm:col-span-4 lg:col-start-3 lg:row-start-1 lg:row-span-1 lg:col-span-2">
            <div class="bg-primary text-white h-full p-2 rounded-xl" v-for="n in 3">
                <p>
                    {{ Object.keys(n)[0]}}
                </p>
               <p class="break-words text-xl md:text-lg">
                {{ convert.covertToRupiah(Object.values(n)[0] as number) }}
               </p>
            </div>
        </div>
        <div class="row-span-2 sm:col-start-3 sm:row-start-1 sm:col-span-2 sm:row-span-3 lg:col-start-4 lg:row-start-2 lg:col-span-1 lg:row-span-7">
            <p>Anggota</p>
        </div>
        <div class="row-span-2 sm:row-start-2 sm:col-span-2 sm:row-span-2 lg:col-start-3 lg:row-start-2 lg:col-span-1 lg:row-span-7">
            Product
        </div>
    </div>
</template>

<script setup lang="ts">
import Title from '@/components/atom/Title.vue';
import { useConvert } from '@/composables/useConvert';
import { businessStore } from '@/stores/businessStore';
import { userStore } from '@/stores/userStore';
import { onBeforeMount, onMounted, ref } from 'vue';

const storeBusiness = businessStore()
const storeUser = userStore()
const convert = useConvert()

const getTotalCash = () => {
    storeBusiness.getTotalBusinessCash(storeUser.userBusiness.id)
}
onBeforeMount(() => {
    getTotalCash()
})

</script>
